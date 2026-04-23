import * as THREE from "three";
import { Vector4 } from "three";
import { getDebugGui } from "./debugGui";
import { videoPanelFrag } from "./shaders/videoPanelFrag";
import { videoPanelVert } from "./shaders/videoPanelVert";
import {
  createVideoTexture,
  elementToLocalRect,
  elementToWorldRect,
  pagePixelsToWorldUnit,
} from "./utils/utils";

const PANEL_START_ID = "video-panel-start";
const PANEL_END_ID = "video-panel-end";
const PANEL_END_PARENT_ID = "video-panel-end-parent";
const SIZE = 1;
const SUBDIVISIONS = 16;

// Hero video. Hosted on Cloudinary for proper streaming/range-request support —
// self-hosting the 31MB webm on Vercel returned intermittent 503s.
export const VIDEO_PANEL_SRC =
  "https://res.cloudinary.com/dsfe6i3vf/video/upload/v1776960831/Gott_Wald_Hero_Flim_1_e4ert0.webm";

/**
 * Get the scroll position (in px) at which an element's TOP
 * reaches the CENTER of the viewport — matching ScrollTrigger's
 * "top center" semantics.
 */
function getScrollAtTopCenter(elementId: string): number {
  const el = document.getElementById(elementId);
  if (!el) return 0;
  const rect = el.getBoundingClientRect();
  // rect.top is viewport-relative; add scrollY to make it page-absolute,
  // then subtract half the viewport height so the element top = vh/2.
  return rect.top + window.scrollY - window.innerHeight * 0.5;
}

export default class VideoPanelShader extends THREE.Group {
  animateProgress = { value: 0 };
  borderRadius = { value: 0.085 };
  tintColour = { value: new THREE.Color(1.0, 1.0, 1.0) };
  camera: THREE.OrthographicCamera;
  material!: THREE.ShaderMaterial;
  mesh!: THREE.Mesh;
  scrollPositionAnimStart = 0;
  scrollPositionAnimEnd = 0;
  scrollPositionAnimFollowEnd = 0;
  followDistanceWorld = 0;

  // ResizeObserver watches for layout shifts that would invalidate
  // our stored pixel boundaries (e.g. fonts load, images resize).
  private layoutObserver?: ResizeObserver;

  constructor(camera: THREE.OrthographicCamera) {
    super();

    this.camera = camera;

    const startWorldRect = elementToWorldRect(PANEL_START_ID, camera);
    this.position.copy(startWorldRect.position);

    const videoTexture = createVideoTexture(VIDEO_PANEL_SRC);
    const startRectLocal = elementToLocalRect(PANEL_START_ID, this, camera);
    const endRectLocal = elementToLocalRect(PANEL_END_ID, this, camera);

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        startRect: { value: VideoPanelShader.rectToVec4(startRectLocal) },
        endRect: { value: VideoPanelShader.rectToVec4(endRectLocal) },
        animateProgress: this.animateProgress,
        borderRadius: this.borderRadius,
        tintColour: this.tintColour,
        map: { value: videoTexture },
      },
      vertexShader: videoPanelVert,
      fragmentShader: videoPanelFrag,
      transparent: true,
    });
    this.mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(SIZE, SIZE, SUBDIVISIONS, SUBDIVISIONS),
      this.material,
    );
    this.mesh.frustumCulled = false;
    this.add(this.mesh);

    this.calculateElementValues();
    this.watchLayout();

    this.initDebug();
  }

  /**
   * Store the scroll positions (in page pixels) at which each
   * animation phase starts/ends. Uses element TOP at viewport CENTER
   * to match the original ScrollTrigger "top center" semantics exactly.
   */
  calculateElementValues() {
    this.scrollPositionAnimStart = getScrollAtTopCenter(PANEL_START_ID);
    this.scrollPositionAnimEnd = getScrollAtTopCenter(PANEL_END_ID);
    this.scrollPositionAnimFollowEnd = getScrollAtTopCenter(PANEL_END_PARENT_ID);

    this.followDistanceWorld = pagePixelsToWorldUnit(
      this.scrollPositionAnimFollowEnd - this.scrollPositionAnimEnd,
      this.camera,
    );
  }

  /**
   * Watch the home-content container for size changes.
   * If fonts or images load and push elements down, we recalculate
   * the stored pixel boundaries so the animation remains accurate.
   */
  private watchLayout() {
    const container = document.getElementById("home-content");
    if (!container || typeof ResizeObserver === "undefined") return;

    let rafId = 0;
    this.layoutObserver = new ResizeObserver(() => {
      // Debounce to one recalculation per frame
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        // Must call full resize() to update both uniforms and scroll start/end offsets
        this.resize();
      });
    });
    this.layoutObserver.observe(container);
  }

  /**
   * Called every RAF frame from homeScene.animate().
   * Computes animateProgress and mesh.position.y directly from
   * window.scrollY — no GSAP callbacks, no tick-scheduling lag.
   * Both camera and video panel update in the exact same animate() frame.
   */
  onScroll = () => {
    const scroll = window.scrollY;

    // ── Phase 1: mask morphs from pill → full-screen ──
    const animRange = this.scrollPositionAnimEnd - this.scrollPositionAnimStart;
    if (animRange > 0) {
      this.animateProgress.value = Math.min(
        1,
        Math.max(0, (scroll - this.scrollPositionAnimStart) / animRange),
      );
    }

    // ── Phase 2: mesh follows the page scroll after morph is complete ──
    const followRange =
      this.scrollPositionAnimFollowEnd - this.scrollPositionAnimEnd;
    if (followRange > 0) {
      const followProgress = Math.min(
        1,
        Math.max(0, (scroll - this.scrollPositionAnimEnd) / followRange),
      );
      this.mesh.position.y = -followProgress * this.followDistanceWorld;
    }
  };

  initDebug = () => {
    const gui = getDebugGui();
    if (!gui) return;
    const folder = gui.addFolder("Video Panel Shader");
    folder.add(this.animateProgress, "value", 0, 1).name("Mask progress");
    folder.add(this.borderRadius, "value", 0, 1).name("Border radius");
    folder.addColor(this.tintColour, "value").name("Tint colour");
  };

  static rectToVec4(rect: {
    position: THREE.Vector3;
    width: number;
    height: number;
  }) {
    return new Vector4(
      rect.position.x,
      rect.position.y,
      rect.height,
      rect.width,
    );
  }

  resize = () => {
    this.calculateElementValues();

    const startWorldRect = elementToWorldRect(PANEL_START_ID, this.camera);
    if (startWorldRect.width > 0) {
      this.position.copy(startWorldRect.position);
    }

    const startRectLocal = elementToLocalRect(
      PANEL_START_ID,
      this,
      this.camera,
    );
    const endRectLocal = elementToLocalRect(PANEL_END_ID, this, this.camera);

    this.material.uniforms.startRect.value =
      VideoPanelShader.rectToVec4(startRectLocal);
    this.material.uniforms.endRect.value =
      VideoPanelShader.rectToVec4(endRectLocal);

    this.onScroll();
  };

  update = () => {};

  dispose() {
    this.layoutObserver?.disconnect();
  }
}
