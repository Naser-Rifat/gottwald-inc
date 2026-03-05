import * as THREE from "three";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
// import { AnimatedTube } from "./animatedTube";
import CosmicDust from "./cosmicDust";
import { getDebugGui, initDebugGui } from "./debugGui";
import LoadingGroup from "./loadingGroup";
import PhysicsSandbox from "./physicsSandbox";
import ProjectTiles from "./projectTiles/projectTiles";
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
  private scrollHandler: () => void;
  private resizeHandler: () => void;
  private isDisposed = false;

  constructor() {
    this.scrollHandler = () => this.onScroll();
    this.resizeHandler = () => this.onWindowResized();

    this.initThree();

    setTimeout(() => {
      if (!this.isDisposed) {
        this.initScene();
      }
    }, 1);

    window.addEventListener("scroll", this.scrollHandler);
    window.addEventListener("resize", this.resizeHandler);

    if (process.env.NODE_ENV === "development") {
      this.initDebug();
    }
  }

  initThree = () => {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    if (!canvas) return;

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas,
      stencil: true,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setAnimationLoop(this.animate);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;

    this.camera = new THREE.OrthographicCamera();
    this.camera.near = 0;
    this.camera.far = 1000;
    this.camera.position.z = 10;
    updateCameraIntrisics(this.camera, this.frustumSize);

    this.onScroll();

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);

    new RGBELoader().load("/assets/hdri/quarry_01_1k.hdr", (texture) => {
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
    // Move the threejs camera's y position to make it appear to be scrolling with the page.
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

    // this.cosmicDust?.resize();
    // this.physicsSandbox?.resize();
    // this.animatedTube?.resize();
    this.videoPanel?.resize();
    this.projectTiles?.resize();
  };

  animate = () => {
    if (this.isDisposed) return;
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
    window.removeEventListener("scroll", this.scrollHandler);
    window.removeEventListener("resize", this.resizeHandler);

    this.renderer?.setAnimationLoop(null);
    // this.cosmicDust?.dispose();
    // this.physicsSandbox?.dispose();
    // this.animatedTube?.dispose();
    this.videoPanel?.dispose();
    this.renderer?.dispose();
  };
}
