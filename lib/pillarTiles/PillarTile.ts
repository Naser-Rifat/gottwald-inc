import * as THREE from "three";

import { getDebugGui } from "../debugGui";
import { projectTileFrag } from "../shaders/projectTileFrag";
import { projectTileVert } from "../shaders/projectTileVert";
import { animateAsync, randomSign, waitAsync } from "../utils/animationUtils";
import { elementToWorldRect } from "../utils/utils";

import type HomeScene from "../homeScene";

const ASPECT = 16 / 9;
const HORIZONTAL_MASK_CLOSED = 0.5;
const HORIZONTAL_MASK_OPEN = 0;

export default class ProjectTile extends THREE.Group {
  elementId: string;
  homeScene: HomeScene;
  stretchAmount = { value: 0.0, targetValue: 0.0 };
  maskAmount = {
    value: HORIZONTAL_MASK_CLOSED,
    targetValue: HORIZONTAL_MASK_CLOSED,
  };
  uMouse = { value: new THREE.Vector2(999.0, 999.0) };
  targetMouse = new THREE.Vector2(999.0, 999.0);
  uTime = { value: 0 };
  tileMeshMat!: THREE.ShaderMaterial;
  tileMesh!: THREE.Mesh;
  tileWorldRect!: { position: THREE.Vector3; width: number; height: number };
  lastScrollPosition?: number;

  private resizeObserver?: ResizeObserver;

  constructor(elementId: string, homeScene: HomeScene) {
    super();

    this.elementId = elementId;
    this.homeScene = homeScene;

    this.initTileMesh();
    this.initInteractionObserver();
    this.loadTexture();

    const el = document.getElementById(elementId);
    if (el) {
      el.addEventListener("mouseenter", this.onMouseEnter);
      el.addEventListener("mousemove", this.onMouseMove);
      el.addEventListener("mouseleave", this.onMouseLeave);
      el.addEventListener("click", this.onClick);
      
      // Auto-resize mesh if the DOM element changes size (fixes 0x0 bug on initial load)
      this.resizeObserver = new ResizeObserver(() => {
        this.resize();
      });
      this.resizeObserver.observe(el);
    }

    this.initDebug();
  }

  loadTexture() {
    const el = document.getElementById(this.elementId);
    if (!el) return;
    const img = el.querySelector("img");
    if (img) {
      const src = img.currentSrc || img.src;
      if (!src) return;
      new THREE.TextureLoader().load(src, (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        if (this.tileMeshMat) {
          this.tileMeshMat.uniforms.map.value = texture;
          this.tileMeshMat.needsUpdate = true;
          
          // Reveal WebGL mesh only when the texture is fully loaded
          el.classList.add("webgl-active");
        }
      });
    }
  }

  initTileMesh() {
    this.tileWorldRect = elementToWorldRect(
      this.elementId,
      this.homeScene.camera,
    );

    this.tileMeshMat = new THREE.ShaderMaterial({
      uniforms: {
        maskAmount: this.maskAmount,
        aspect: { value: this.tileWorldRect.height > 0 ? this.tileWorldRect.width / this.tileWorldRect.height : ASPECT },
        stretchAmount: this.stretchAmount,
        uMouse: this.uMouse,
        uTime: this.uTime,
        map: { value: null },
      },
      vertexShader: projectTileVert,
      fragmentShader: projectTileFrag,
      transparent: true,
    });

    this.tileMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(
        this.tileWorldRect.width,
        this.tileWorldRect.height,
        64,
      ),
      this.tileMeshMat,
    );
    this.tileMesh.position.copy(this.tileWorldRect.position);

    this.add(this.tileMesh);
  }

  initInteractionObserver = () => {
    const el = document.getElementById(this.elementId);
    if (!el) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(
        (entry) =>
          {
            this.maskAmount.targetValue = entry.isIntersecting
              ? HORIZONTAL_MASK_OPEN
              : HORIZONTAL_MASK_CLOSED;
          },
      );
    }, { rootMargin: "300px 0px" });
    observer.observe(el);
  };

  onMouseEnter = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const rect = target.getBoundingClientRect();
    const xAbs = e.clientX - rect.left;
    const yAbs = e.clientY - rect.top;

    const x = xAbs / rect.width;
    const y = yAbs / rect.height;

    // Snap the actual uMouse value instantly to avoid the ripple flying in from 999,999
    this.uMouse.value.set(x, 1.0 - y);
    this.targetMouse.set(x, 1.0 - y);
  };

  onMouseMove = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const rect = target.getBoundingClientRect();
    const xAbs = e.clientX - rect.left;
    const yAbs = e.clientY - rect.top;

    const x = xAbs / rect.width;
    const y = yAbs / rect.height;

    this.targetMouse.set(x, 1.0 - y); // WebGL y is flipped
  };

  onMouseLeave = () => {
    // Move targetMouse far away so the shader calculates a huge distance,
    // which makes the hoverMask perfectly 0.0
    this.targetMouse.set(999.0, 999.0);
  };

  onClick = async () => {
    const addCssClass = (isForward: boolean) => {
      const homeContent = document.getElementById("home-content");
      if (isForward) {
        document.body.classList.add("no-scroll");
        homeContent?.classList.add("fade-out");
      } else {
        document.body.classList.remove("no-scroll");
        homeContent?.classList.remove("fade-out");
      }
    };

    const zoomSequence = async (
      pageCamTargetFrustum: number,
      pageCamTargetPosition: THREE.Vector3,
      pageCamTargetRotationZ: number,
      isForward: boolean,
    ) => {
      const pageCamStartFrustum = this.homeScene.frustumSize;
      const pageCamStartPosition = this.homeScene.camera.position.clone();
      const pageCamStartRotationZ = this.homeScene.camera.rotation.z;

      await animateAsync(500, (percent) => {
        const pageCamFrustum = THREE.MathUtils.lerp(
          pageCamStartFrustum,
          pageCamTargetFrustum,
          percent,
        );
        const pageCamRotationZ = THREE.MathUtils.lerp(
          pageCamStartRotationZ,
          pageCamTargetRotationZ,
          percent,
        );

        this.homeScene.setCameraFrustumSize(pageCamFrustum);
        this.homeScene.camera.position.lerpVectors(
          pageCamStartPosition,
          pageCamTargetPosition,
          percent,
        );
        this.homeScene.camera.rotation.z = pageCamRotationZ;
      });
    };

    const pageCamStartFrustumSize = this.homeScene.frustumSize;
    const pageCamStartPosition = this.homeScene.camera.position.clone();
    const pageCamStartRotationZ = this.homeScene.camera.rotation.z;

    const onBack = async (e: Event) => {
      e.preventDefault();
      document.getElementById("project-tile-modal")?.classList.remove("show");
      await waitAsync(1000);
      await zoomSequence(
        pageCamStartFrustumSize,
        pageCamStartPosition,
        pageCamStartRotationZ,
        false,
      );
      addCssClass(false);
      const homeContent = document.getElementById("home-content");
      if (homeContent) homeContent.style.visibility = "visible";

      const buttons = document.getElementsByClassName(
        "project-tile-back-button",
      );
      for (const button of Array.from(buttons)) {
        button.removeEventListener("click", onBack);
      }
    };

    addCssClass(true);
    await waitAsync(1000);
    await zoomSequence(
      this.calculatePageCamTargetFrustum(),
      this.tileMesh.position.clone(),
      randomSign() * 0.1,
      true,
    );
    const homeContent = document.getElementById("home-content");
    if (homeContent) homeContent.style.visibility = "hidden";
    document.getElementById("project-tile-modal")?.classList.add("show");

    const buttons = document.getElementsByClassName("project-tile-back-button");
    for (const button of Array.from(buttons)) {
      button.addEventListener("click", onBack);
    }
  };

  calculatePageCamTargetFrustum = () => {
    const el = document.getElementById(this.elementId);
    if (!el) return this.homeScene.frustumSize;
    const height = el.getBoundingClientRect().height;
    const ratio = height / window.innerHeight;
    const fudge = 0.4;
    return this.homeScene.frustumSize * ratio - fudge;
  };

  initDebug = () => {
    const gui = getDebugGui();
    if (!gui) return;
    const folder = gui.addFolder("Project Tile");
    folder.add(this.maskAmount, "value", -1, 1).name("Mask amount");
    folder.add(this.stretchAmount, "value", -1, 1).name("Stretch amount");
  };

  resize = () => {
    this.tileWorldRect = elementToWorldRect(
      this.elementId,
      this.homeScene.camera,
    );

    this.remove(this.tileMesh);

    if (this.tileMeshMat) {
      this.tileMeshMat.uniforms.aspect.value = 
        this.tileWorldRect.height > 0 ? this.tileWorldRect.width / this.tileWorldRect.height : ASPECT;
    }

    this.tileMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(
        this.tileWorldRect.width,
        this.tileWorldRect.height,
        64,
      ),
      this.tileMeshMat,
    );
    this.tileMesh.position.copy(this.tileWorldRect.position);
    this.add(this.tileMesh);
  };

  update(dt: number, renderer: THREE.WebGLRenderer) {
    this.uMouse.value.lerp(this.targetMouse, dt * 5.0);
    this.uTime.value += dt;
    this.maskAmount.value = THREE.MathUtils.lerp(
      this.maskAmount.value,
      this.maskAmount.targetValue,
      dt * 3,
    );

    this.updateStretchAmount(dt);
  }

  updateStretchAmount(dt: number) {
    if (
      this.lastScrollPosition !== undefined &&
      this.lastScrollPosition !== window.scrollY
    ) {
      const distance = window.scrollY - this.lastScrollPosition;
      // 'distance' is pixels per frame. If we scroll fast, it might be 30-50px.
      // We want to map a 50px delta to a targetValue of ~1.0
      this.stretchAmount.targetValue = THREE.MathUtils.clamp(
        distance * 0.02,
        -1,
        1,
      );
    } else {
      this.stretchAmount.targetValue = 0;
    }
    this.lastScrollPosition = window.scrollY;

    this.stretchAmount.value = THREE.MathUtils.lerp(
      this.stretchAmount.value,
      this.stretchAmount.targetValue,
      dt * 15.0, // Faster lerp so it responds immediately
    );
  }

  cleanup() {
    this.tileMeshMat.dispose();

    const el = document.getElementById(this.elementId);
    if (el) {
      el.removeEventListener("mouseenter", this.onMouseEnter);
      el.removeEventListener("mousemove", this.onMouseMove);
      el.removeEventListener("mouseleave", this.onMouseLeave);
      el.removeEventListener("click", this.onClick);
    }
    
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }
}
