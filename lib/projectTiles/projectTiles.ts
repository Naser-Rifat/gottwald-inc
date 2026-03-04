import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import ProjectTile from "./ProjectTile";

import type HomeScene from "../homeScene";

export default class ProjectTiles extends THREE.Group {
  renderTarget?: THREE.WebGLRenderTarget;
  portalScene?: THREE.Scene;
  portalCamera?: THREE.PerspectiveCamera;
  projectTiles: ProjectTile[] = [];
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

    const projectTile1 = new ProjectTile("tile-1", this.homeScene);
    const projectTile2 = new ProjectTile("tile-2", this.homeScene);
    const projectTile3 = new ProjectTile("tile-3", this.homeScene);
    const projectTile4 = new ProjectTile("tile-4", this.homeScene);

    const loader = new GLTFLoader();

    const tile1 = loader.loadAsync("/assets/project-tiles/tile-1.glb");
    const tile2 = loader.loadAsync("/assets/project-tiles/tile-2.glb");
    const tile3 = loader.loadAsync("/assets/project-tiles/tile-3.glb");
    const tile4 = loader.loadAsync("/assets/project-tiles/tile-4.glb");
    const results = await Promise.all([tile1, tile2, tile3, tile4]);

    projectTile1.addToPortalScene(results[0].scene);
    projectTile2.addToPortalScene(results[1].scene);
    projectTile3.addToPortalScene(results[2].scene);
    projectTile4.addToPortalScene(results[3].scene);

    this.add(projectTile1, projectTile2, projectTile3, projectTile4);

    this.projectTiles.push(projectTile1);
    this.projectTiles.push(projectTile2);
    this.projectTiles.push(projectTile3);
    this.projectTiles.push(projectTile4);
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
