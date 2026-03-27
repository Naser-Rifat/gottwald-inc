import * as THREE from "three";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
// import { AnimatedTube } from "./animatedTube";
import CosmicDust from "./cosmicDust";
import { initDebugGui } from "./debugGui";
import LoadingGroup from "./loadingGroup";
import PhysicsSandbox from "./physicsSandbox";
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
  physicsSandbox?: PhysicsSandbox;
  // animatedTube?: AnimatedTube;
  cosmicDust?: CosmicDust;
  videoPanel?: VideoPanelShader;
  projectTiles?: ProjectTiles;
  stats?: { dom: HTMLElement; update: () => void };
  private resizeHandler: () => void;
  private isDisposed = false;

  constructor() {
    this.resizeHandler = () => this.onWindowResized();

    this.initThree();

    setTimeout(() => {
      if (!this.isDisposed) {
        this.initScene();
      }
    }, 1);

    window.addEventListener("resize", this.resizeHandler);

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

    // Defer HDR loading so it doesn't block first paint
    const loadHDR = () => {
      if (this.isDisposed) return;
      new RGBELoader().load("/assets/hdri/quarry_01_1k.hdr", (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        this.scene.environment = texture;
      });
    };
    if (typeof requestIdleCallback !== "undefined") {
      requestIdleCallback(loadHDR);
    } else {
      setTimeout(loadHDR, 200);
    }
  };

  initScene = () => {
    this.loadingGroup = new LoadingGroup(this.camera, () => {
      if (this.loadingGroup) {
        this.scene.remove(this.loadingGroup);
        this.loadingGroup = undefined;
      }
    });
    this.scene.add(this.loadingGroup);

    // this.cosmicDust = new CosmicDust();
    // this.scene.add(this.cosmicDust);

    // this.physicsSandbox = new PhysicsSandbox(this.camera);
    // this.scene.add(this.physicsSandbox);

    // this.animatedTube = new AnimatedTube(this.camera);
    // this.scene.add(this.animatedTube);

    this.videoPanel = new VideoPanelShader(this.camera);
    this.scene.add(this.videoPanel);

    this.projectTiles = new ProjectTiles(this);
    this.scene.add(this.projectTiles);
  };

  onScroll = () => {
    if (!this.camera) return;
    // Move the Three.js camera's Y position to match the page scroll.
    this.camera.position.y =
      (-window.scrollY / window.innerHeight) * this.frustumSize;
  };

  setCameraFrustumSize = (frustumSize: number) => {
    this.frustumSize = frustumSize;
    updateCameraIntrisics(this.camera, this.frustumSize);
  };

  onWindowResized = () => {
    if (!this.renderer) return;
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    updateCameraIntrisics(this.camera, this.frustumSize);
    
    // Crucial: Update the camera's Y position to match the new innerHeight
    // before computing any unproject() math in the children's resize() hooks.
    this.onScroll();

    // this.cosmicDust?.resize();
    // this.physicsSandbox?.resize();
    // this.animatedTube?.resize();
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
    // this.cosmicDust?.update(dt);
    // this.physicsSandbox?.update(dt);
    // this.animatedTube?.update(dt);
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

    // 1. Stop the animation loop IMMEDIATELY
    this.renderer?.setAnimationLoop(null);

    // 2. Remove all event listeners
    window.removeEventListener("resize", this.resizeHandler);

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
