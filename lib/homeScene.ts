import * as THREE from "three";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
import { getDeviceTier } from "@/lib/deviceTier";
import { initDebugGui } from "./debugGui";
import LoadingGroup from "./loadingGroup";
import ProjectTiles from "./pillarTiles/pillarTiles";
import { updateCameraIntrisics } from "./utils/utils";
import VideoPanelShader from "./videoPanelShader";

export default class HomeScene {
  frustumSize = 10; // value of 1 results in 1 world space unit equating to height of viewport
  clock = new THREE.Clock();
  renderer!: THREE.WebGLRenderer;
  camera!: THREE.OrthographicCamera;
  scene!: THREE.Scene;
  loadingGroup?: LoadingGroup;
  videoPanel?: VideoPanelShader;
  projectTiles?: ProjectTiles;
  stats?: { dom: HTMLElement; update: () => void };
  private resizeHandler: () => void;
  private isDisposed = false;
  private environmentLoaded = false;
  private environmentLoadHandler?: () => void;
  public mouse = new THREE.Vector2(0, 0);
  public scrollVelocity = 0;
  private lastScrollY = 0;

  constructor() {
    this.resizeHandler = () => this.onWindowResized();

    this.initThree();

    setTimeout(() => {
      if (!this.isDisposed) {
        this.initScene();
      }
    }, 1);

    window.addEventListener("resize", this.resizeHandler);
    window.addEventListener("mousemove", this.onMouseMove);

    if (process.env.NODE_ENV === "development") {
      this.initDebug();
    }
  }

  initThree = () => {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    if (!canvas) return;

    this.renderer = new THREE.WebGLRenderer({
      antialias: false,
      canvas,
      stencil: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setAnimationLoop(this.animate);

    this.camera = new THREE.OrthographicCamera();
    this.camera.near = 0;
    this.camera.far = 1000;
    this.camera.position.z = 10;
    updateCameraIntrisics(this.camera, this.frustumSize);

    this.onScroll();

    this.scene = new THREE.Scene();
    // this.scene.background = new THREE.Color(0x000000);

    // The HDR environment is a nice reflection layer, but not required for
    // first paint. Load it only after the visitor interacts with the scene.
    if (getDeviceTier() !== "mobile") {
      this.environmentLoadHandler = () => this.loadEnvironmentMap();
      window.addEventListener("scroll", this.environmentLoadHandler, {
        passive: true,
        once: true,
      });
      window.addEventListener("pointerdown", this.environmentLoadHandler, {
        passive: true,
        once: true,
      });
    }
  };

  private loadEnvironmentMap = () => {
    if (this.isDisposed || this.environmentLoaded) return;
    this.environmentLoaded = true;

    new RGBELoader().load("/assets/hdri/quarry_01_1k.hdr", (texture) => {
      if (this.isDisposed) {
        texture.dispose();
        return;
      }
      texture.mapping = THREE.EquirectangularReflectionMapping;
      this.scene.environment = texture;
    });
  };

  initScene = () => {
    this.loadingGroup = new LoadingGroup(this.camera, () => {
      if (this.loadingGroup) {
        this.scene.remove(this.loadingGroup);
        this.loadingGroup = undefined;
      }
    });
    this.scene.add(this.loadingGroup);

    // Video panel skipped on mobile — the 90s 1080p webm isn't worth the
    // bandwidth or decode cost on small screens. Desktop mounts synchronously
    // so scroll-position math runs before the user has a chance to scroll.
    if (getDeviceTier() !== "mobile") {
      this.videoPanel = new VideoPanelShader(this.camera);
      this.scene.add(this.videoPanel);
    }

    this.projectTiles = new ProjectTiles(this);
    this.scene.add(this.projectTiles);
  };

  private onMouseMove = (e: MouseEvent) => {
    // Normalize to -1 to +1
    this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  };

  onScroll = () => {
    if (!this.camera) return;

    // Calculate smoothed scroll velocity
    const currentScrollY = window.scrollY;
    const targetVelocity = currentScrollY - this.lastScrollY;
    this.scrollVelocity = THREE.MathUtils.lerp(this.scrollVelocity, targetVelocity, 0.1);
    this.lastScrollY = currentScrollY;

    // Move the Three.js camera's Y position to match the page scroll.
    this.camera.position.y =
      (-currentScrollY / window.innerHeight) * this.frustumSize;
  };

  setCameraFrustumSize = (frustumSize: number) => {
    this.frustumSize = frustumSize;
    updateCameraIntrisics(this.camera, this.frustumSize);
  };

  onWindowResized = () => {
    if (!this.renderer) return;
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    // Crucial: Update the camera's Y position to match the new innerHeight
    // before computing any unproject() math in the children's resize() hooks.
    this.onScroll();

    updateCameraIntrisics(this.camera, this.frustumSize);

    // Explicitly update the global matrix so child component unproject math uses the precise coordinate system
    this.camera.updateMatrixWorld(true);

    this.videoPanel?.resize();
    this.projectTiles?.resize();
  };

  animate = () => {
    if (this.isDisposed) return;
    
    // ─── CRITICAL: Update camera + video panel in SAME frame ───
    // Both use direct window.scrollY math — zero GSAP callback delay,
    // zero frame desync. The camera and mesh move in perfect lockstep.
    this.onScroll();
    this.videoPanel?.onScroll();

    const dt = this.clock.getDelta();

    this.loadingGroup?.update(dt);
    this.videoPanel?.update();
    this.projectTiles?.update(dt, this.renderer);

    this.renderer.render(this.scene, this.camera);
    this.stats?.update();
  };

  initDebug = async () => {
    const gui = await initDebugGui();
    if (gui) {
      const folder = gui.addFolder("Scene");
      folder
        .add(this, "frustumSize", 0, 100)
        .onChange(this.setCameraFrustumSize);
    }
  };

  dispose = () => {
    this.isDisposed = true;

    // Restore the fluid canvas in case we're mid-loading sequence
    // (LoadingGroup may have set it to opacity: 0)
    const gc = document.getElementById("global-fluid-canvas");
    if (gc) gc.style.opacity = "1";

    // 1. Stop the animation loop IMMEDIATELY
    this.renderer?.setAnimationLoop(null);

    // 2. Remove all event listeners
    window.removeEventListener("resize", this.resizeHandler);
    window.removeEventListener("mousemove", this.onMouseMove);
    if (this.environmentLoadHandler) {
      window.removeEventListener("scroll", this.environmentLoadHandler);
      window.removeEventListener("pointerdown", this.environmentLoadHandler);
    }

    // 3. Dispose scene children
    this.videoPanel?.dispose();

    // 4. Clear the scene
    if (this.scene) {
      this.scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry?.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach((m) => m.dispose());
          } else {
            object.material?.dispose();
          }
        }
      });
      this.scene.clear();
    }

    // 5. Force WebGL context loss to release GPU resources
    if (this.renderer) {
      this.renderer.forceContextLoss();
      this.renderer.dispose();
    }
  };
}
