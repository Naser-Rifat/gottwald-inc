import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import type HomeScene from "../homeScene";
import PillarTile from "./PillarTile";

export default class PillarTiles extends THREE.Group {
  renderTarget?: THREE.WebGLRenderTarget;
  portalScene?: THREE.Scene;
  portalCamera?: THREE.PerspectiveCamera;
  projectTiles: PillarTile[] = [];
  homeScene: HomeScene;

  constructor(homeScene: HomeScene) {
    super();

    this.homeScene = homeScene;
    this.initTiles();
  }

  initTiles = async () => {
    this.projectTiles.forEach((projectTile) => {
      this.remove(projectTile);
      projectTile.cleanup();
    });

    const pillarTile1 = new PillarTile("tile-1", this.homeScene);
    const pillarTile2 = new PillarTile("tile-2", this.homeScene);
    const pillarTile3 = new PillarTile("tile-3", this.homeScene);
    const pillarTile4 = new PillarTile("tile-4", this.homeScene);

    const loader = new GLTFLoader();

    const tile1 = loader.loadAsync("/assets/project-tiles/tile-1.glb");
    const tile2 = loader.loadAsync("/assets/project-tiles/tile-2.glb");
    const tile3 = loader.loadAsync("/assets/project-tiles/tile-3.glb");
    const tile4 = loader.loadAsync("/assets/project-tiles/tile-4.glb");
    const results = await Promise.all([tile1, tile2, tile3, tile4]);

    pillarTile1.addToPortalScene(results[0].scene);
    pillarTile2.addToPortalScene(results[1].scene);
    pillarTile3.addToPortalScene(results[2].scene);
    pillarTile4.addToPortalScene(results[3].scene);

    this.add(pillarTile1, pillarTile2, pillarTile3, pillarTile4);

    this.projectTiles.push(pillarTile1);
    this.projectTiles.push(pillarTile2);
    this.projectTiles.push(pillarTile3);
    this.projectTiles.push(pillarTile4);
  };

  resize = () => {
    this.projectTiles.forEach((projectTile) => projectTile.resize());
  };

  update(dt: number, renderer: THREE.WebGLRenderer) {
    this.projectTiles.forEach((projectTile) =>
      projectTile.update(dt, renderer),
    );
  }
}
