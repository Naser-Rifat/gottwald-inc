import * as THREE from "three";
import { Vector4 } from "three";
import { getDebugGui } from "./debugGui";
import { videoPanelFrag } from "./shaders/videoPanelFrag";
import { videoPanelVert } from "./shaders/videoPanelVert";
import {
  createVideoTexture,
  elementToLocalRect,
  elementToWorldRect,
  getElementPageCoords,
  pagePixelsToWorldUnit,
} from "./utils/utils";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PANEL_START_ID = "video-panel-start";
const PANEL_END_ID = "video-panel-end";
const PANEL_END_PARENT_ID = "video-panel-end-parent";
const SIZE = 1;
const SUBDIVISIONS = 32;

export default class VideoPanelShader extends THREE.Group {
  animateProgress = { value: 0 };
  borderRadius = { value: 0.085 };
  tintColour = { value: new THREE.Color(0.6, 0.6, 1.0) };
  camera: THREE.OrthographicCamera;
  material!: THREE.ShaderMaterial;
  mesh!: THREE.Mesh;
  scrollPositionAnimStart = 0;
  scrollPositionAnimEnd = 0;
  scrollPositionAnimFollowEnd = 0;
  followDistanceWorld = 0;
  scrollTriggerContext!: gsap.Context;

  constructor(camera: THREE.OrthographicCamera) {
    super();

    this.camera = camera;

    const startWorldRect = elementToWorldRect(PANEL_START_ID, camera);
    this.position.copy(startWorldRect.position);

    const videoTexture = createVideoTexture(
      "/assets/about-gott-wald.webm",
    );
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
    this.initScrollTrigger();

    this.initDebug();
  }

  initScrollTrigger = () => {
    // We clean up any existing GSAP instances on this class when resizing
    if (this.scrollTriggerContext) {
      this.scrollTriggerContext.revert();
    }

    this.scrollTriggerContext = gsap.context(() => {
      const startEl = document.getElementById(PANEL_START_ID);
      const endEl = document.getElementById(PANEL_END_PARENT_ID);
      const innerEndEl = document.getElementById(PANEL_END_ID);

      if (!startEl || !endEl || !innerEndEl) return;

      // The core animation mask mapping
      ScrollTrigger.create({
        trigger: startEl,
        start: "top center",
        endTrigger: innerEndEl,
        end: "top center",
        onUpdate: (self) => {
          this.animateProgress.value = self.progress;
        },
      });

      // The positional follow distance 
      ScrollTrigger.create({
        trigger: innerEndEl,
        start: "top center",
        endTrigger: endEl,
        end: "top center",
        onUpdate: (self) => {
          this.mesh.position.y = -self.progress * this.followDistanceWorld;
        },
      });
    });
  };

  calculateElementValues() {
    this.scrollPositionAnimStart =
      getElementPageCoords(PANEL_START_ID).y +
      window.scrollY -
      window.innerHeight * 0.5;
    this.scrollPositionAnimEnd =
      getElementPageCoords(PANEL_END_ID).y +
      window.scrollY -
      window.innerHeight * 0.5;
    this.scrollPositionAnimFollowEnd =
      getElementPageCoords(PANEL_END_PARENT_ID).y +
      window.scrollY -
      window.innerHeight * 0.5;
    this.followDistanceWorld = pagePixelsToWorldUnit(
      this.scrollPositionAnimFollowEnd - this.scrollPositionAnimEnd,
      this.camera,
    );
  }

  onScroll = () => {
    // Handled purely by GSAP scroll triggers now
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

    this.initScrollTrigger();
  };

  update = () => {};

  dispose() {
    if (this.scrollTriggerContext) {
      this.scrollTriggerContext.revert();
    }
  }
}
