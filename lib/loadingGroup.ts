import { CountUp } from "countup.js";
import * as THREE from "three";
import { getDebugGui } from "./debugGui";
import { loadingMeshFrag } from "./shaders/loadingMeshFrag";
import { loadingMeshVert } from "./shaders/loadingMeshVert";
import { pagePixelsToWorldUnit, pageToWorldCoords } from "./utils/utils";

const LOADING_CONTENT_ID = "loading-content";
const HOME_CONTENT_ID = "home-content";

export default class LoadingGroup extends THREE.Group {
  letterRotation = { value: 0 };
  letterScale = { value: 1 };
  backgroundAlpha = { value: 1 };
  
  // Cinematic variables
  CINEMATIC_MINIMUM_DURATION = 2.2;
  elapsedTime = 0;
  networkTarget = 0;
  networkProgressValue = 0;
  lastDisplayPercent = -1;

  loadingProgress = { value: 0, target: 0 };
  postLoadSequenceProgress = { value: 0 };
  isSequenceFinished = false;
  loadingContentEl: HTMLElement | null;
  homeContentEl: HTMLElement | null;
  onDoneLoadSequence?: () => void;
  material!: THREE.ShaderMaterial;
  mesh!: THREE.Mesh;
  countUp!: CountUp;

  constructor(
    camera: THREE.OrthographicCamera,
    onDoneLoadSequence?: () => void,
  ) {
    super();

    this.loadingContentEl = document.getElementById(LOADING_CONTENT_ID);
    this.homeContentEl = document.getElementById(HOME_CONTENT_ID);

    // Hide the fluid canvas behind our loading overlay —
    // the post-load sequence (80–100%) will smoothly fade it back in.
    const gc = document.getElementById("global-fluid-canvas");
    if (gc) gc.style.opacity = "0";

    document.body.classList.add("no-scroll");

    this.onDoneLoadSequence = onDoneLoadSequence;

    // Track only the target, don't update UI directly here anymore.
    THREE.DefaultLoadingManager.onProgress = (
      _url: string,
      itemsLoaded: number,
      itemsTotal: number,
    ) => {
      const percent = itemsLoaded / itemsTotal;
      this.networkTarget = percent;
    };

    this.initOdometer();
    this.initMesh(camera);
    this.initDebug();
  }

  initOdometer = () => {
    if (!this.loadingContentEl) return;
    this.countUp = new CountUp(this.loadingContentEl, 100, {
      formattingFn: (n: number) => n.toString().padStart(3, "0"),
      duration: 0.5, // keep internal duration short, we drive the pacing in update()
    });
  };

  initMesh = (camera: THREE.OrthographicCamera) => {
    const pos = pageToWorldCoords(
      window.innerWidth * 0.5,
      window.innerHeight * 0.5,
      camera,
    );
    const width = pagePixelsToWorldUnit(window.innerWidth, camera);
    const height = pagePixelsToWorldUnit(window.innerHeight, camera);

    this.material = new THREE.ShaderMaterial({
      vertexShader: loadingMeshVert,
      fragmentShader: loadingMeshFrag,
      depthTest: false,
      uniforms: {
        aspect: { value: window.innerWidth / window.innerHeight },
        letterRotation: this.letterRotation,
        letterScale: this.letterScale,
        backgroundAlpha: this.backgroundAlpha,
        loadingProgress: this.loadingProgress,
        postLoadSequenceProgress: this.postLoadSequenceProgress,
      },
      transparent: true,
    });

    this.mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(width, height),
      this.material,
    );
    this.mesh.renderOrder = 1000;
    this.mesh.position.copy(pos);
    this.add(this.mesh);
  };

  initDebug() {
    const gui = getDebugGui();
    if (!gui) return;
    const folder = gui.addFolder("Loading");
    folder
      .add(this.letterRotation, "value", -Math.PI / 2, 0)
      .name("Letter rotation");
    folder.add(this.letterScale, "value", 1, 10).name("Letter scale");
    folder.add(this.backgroundAlpha, "value", 0, 1).name("Background alpha");
    folder.add(this.loadingProgress, "value", 0, 1).name("Loading progress");
    folder
      .add(this.postLoadSequenceProgress, "value", 0, 1)
      .name("Post load sequence");
  }

  update = (dt: number) => {
    if (this.isSequenceFinished) {
      return;
    }

    this.elapsedTime += dt;

    // 1. Smoothly interpolate network progress to the target
    this.networkProgressValue = THREE.MathUtils.lerp(
      this.networkProgressValue,
      this.networkTarget,
      dt * 10,
    ) + 0.0000000001; // Avoid strict 0

    // Prevent network hang: if all assets were cached and itemsTotal was 0,
    // force network target to 1 to ensure it completes.
    if (this.elapsedTime > 0.5 && this.networkTarget === 0 && this.networkProgressValue < 0.1) {
      this.networkTarget = 1.0; 
    }

    // 2. Guaranteed cinematic minimum duration (0.0 -> 1.0 linearly)
    const cinematicProgress = Math.min(this.elapsedTime / this.CINEMATIC_MINIMUM_DURATION, 1.0);

    // 3. Final display logic: Bottlenecked by whichever is SLOWER.
    // If network is cached, cinematicProgress (time) slows it down.
    // If network is slow, networkProgressValue holds it back.
    const finalProgress = Math.min(this.networkProgressValue, cinematicProgress);
    
    // Safety clamp
    this.loadingProgress.value = Math.max(0, Math.min(finalProgress, 1));

    // Update the visual odometer cleanly
    const displayPercent = Math.round(this.loadingProgress.value * 100);
    if (displayPercent !== this.lastDisplayPercent) {
        this.countUp?.update(displayPercent);
        this.lastDisplayPercent = displayPercent;
    }

    if (this.loadingProgress.value >= 0.999) {
      this.postLoadSequenceProgress.value += dt * 0.6;
      this.postLoadSequenceProgress.value = Math.min(
        this.postLoadSequenceProgress.value,
        1,
      );

      // Fade in the dark fluid in perfect sync with the WebGL background vanishing
      if (this.postLoadSequenceProgress.value >= 0.8) {
        let t = (this.postLoadSequenceProgress.value - 0.8) / 0.2;
        t = Math.max(0, Math.min(1, t));
        const smoothstep = t * t * (3 - 2 * t);

        const gc = document.getElementById("global-fluid-canvas");
        if (gc) {
          gc.style.opacity = smoothstep.toString();
        }
      }

      if (this.postLoadSequenceProgress.value === 1) {
        this.isSequenceFinished = true;

        // Guarantee fluid canvas is fully visible
        const gc = document.getElementById("global-fluid-canvas");
        if (gc) gc.style.opacity = "1";

        document.body.classList.remove("no-scroll");
        this.loadingContentEl?.remove();
        this.homeContentEl?.classList.remove("fade-out");
        this.onDoneLoadSequence?.();
      }
    }
  };
}

