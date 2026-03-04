import RAPIER, { Ray } from "@dimforge/rapier3d-compat";
import * as THREE from "three";
import {
  createBevelledPlane,
  elementToWorldRect,
  pageToWorldCoords,
} from "./utils/utils";

const OBJECT_COUNT = 30;
const DAMPING = 0.6;
const ATTRACTION_FORCE = 3.5;
const MOUSE_FORCE_COEF = 10;
const MOUSE_LIGHT_INTENSITY = 40;
const STENCIL_REF = 1;

export default class PhysicsSandbox extends THREE.Group {
  ballPosition = new THREE.Vector3();
  meshBodyLookup = new Map<THREE.Mesh, RAPIER.RigidBody>();
  attractionPos = new THREE.Vector3(0, 0, 0);
  lastMousePos = new THREE.Vector3();
  camera: THREE.OrthographicCamera;
  world!: RAPIER.World;
  ballMaterial!: THREE.MeshStandardMaterial;
  physicsMaskMesh!: THREE.Mesh;
  mouseBall!: { mesh: THREE.Mesh; rigidbody: RAPIER.RigidBody };

  constructor(camera: THREE.OrthographicCamera) {
    super();

    this.camera = camera;
    this.initViewMask();
    this.initBallMaterial();
    this.initPhysics();

    window.addEventListener("mousemove", this.onMouseMove, false);
  }

  initViewMask = () => {
    const divWorldRect = elementToWorldRect("physics-sandbox-div", this.camera);
    const stencilMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0.02, 0.02, 0.02),
      depthWrite: false,
      stencilWrite: true,
      stencilRef: STENCIL_REF,
      stencilFunc: THREE.AlwaysStencilFunc,
      stencilZPass: THREE.ReplaceStencilOp,
    });

    const width = Math.abs(divWorldRect.width);
    const height = Math.abs(divWorldRect.height);
    const geometry = createBevelledPlane(width, height, 0.1);

    this.physicsMaskMesh = new THREE.Mesh(geometry, stencilMat);
    this.physicsMaskMesh.position.copy(divWorldRect.position);
    this.add(this.physicsMaskMesh);

    this.attractionPos.copy(divWorldRect.position);
  };

  initBallMaterial() {
    this.ballMaterial = new THREE.MeshStandardMaterial({
      color: 0xe91e63,
      metalness: 0,
      roughness: 0.22,
      stencilWrite: true,
      stencilRef: STENCIL_REF,
      stencilFunc: THREE.EqualStencilFunc,
    });
  }

  async initPhysics() {
    await RAPIER.init();

    this.world = new RAPIER.World({ x: 0, y: 0, z: 0 });

    for (let i = 0; i < OBJECT_COUNT; i++) {
      const ball = this.createBall(0.6, this.getRandomPosition(5));
      this.add(ball.mesh);
      this.addToWorld(ball.mesh, ball.rigidbody);
    }

    this.mouseBall = this.createBall(0.6, { x: 0, y: 0, z: 0 }, true);
    this.mouseBall.mesh.add(
      new THREE.PointLight(new THREE.Color(1, 1, 1), MOUSE_LIGHT_INTENSITY),
    );
    this.add(this.mouseBall.mesh);
  }

  createBall(
    ballRadius: number,
    ballPosition: { x: number; y: number; z: number },
    isKinematic = false,
    ballRestitution = 0.3,
  ) {
    const { x, y, z } = ballPosition;

    const rigidbodyDesc = isKinematic
      ? RAPIER.RigidBodyDesc.kinematicPositionBased()
      : RAPIER.RigidBodyDesc.dynamic();
    rigidbodyDesc.setTranslation(x, y, z);
    rigidbodyDesc.setLinearDamping(DAMPING);

    const shape = RAPIER.ColliderDesc.ball(ballRadius);
    shape.setMass(ballRadius);
    shape.setRestitution(ballRestitution);

    const rigidbody = this.world.createRigidBody(rigidbodyDesc);
    this.world.createCollider(shape, rigidbody);

    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(ballRadius),
      this.ballMaterial,
    );
    mesh.position.set(x, y, z);
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    mesh.renderOrder = 2;
    return { rigidbody, mesh };
  }

  getRandomPosition(radius: number) {
    return this.ballPosition.randomDirection().multiplyScalar(radius);
  }

  onMouseMove = (event: MouseEvent) => {
    if (!this.world) {
      return;
    }

    const worldCords = pageToWorldCoords(event.x, event.y, this.camera);

    const { x, y, z } = worldCords;

    this.mouseBall.rigidbody.setTranslation({ x, y, z }, true);
    this.mouseBall.mesh.position.set(x, y, z);

    const mouseDelta = this.mouseBall.mesh.position
      .clone()
      .sub(this.lastMousePos);

    this.lastMousePos.copy(this.mouseBall.mesh.position);

    const ray = new Ray(
      this.camera.position,
      this.lastMousePos.clone().sub(this.camera.position),
    );
    const hit = this.world.castRay(ray, 50, true);

    if (hit) {
      this.meshBodyLookup.forEach((rigidbody) => {
        if (rigidbody === hit.collider.parent()) {
          rigidbody.applyImpulseAtPoint(
            mouseDelta.multiplyScalar(MOUSE_FORCE_COEF),
            this.lastMousePos,
            true,
          );
        }
      });
    }
  };

  addToWorld(mesh: THREE.Mesh, rigidbody: RAPIER.RigidBody) {
    this.meshBodyLookup.set(mesh, rigidbody);
  }

  resize = () => {
    this.remove(this.physicsMaskMesh);
    this.initViewMask();
  };

  update(_dt: number) {
    if (this.world) {
      this.world.step();
    }

    this.meshBodyLookup.forEach((rigidbody, mesh) => {
      const dirToCenter = this.attractionPos
        .clone()
        .sub(mesh.position)
        .setLength(ATTRACTION_FORCE);
      rigidbody.resetForces(true);
      rigidbody.addForce(dirToCenter, true);

      mesh.position.copy(rigidbody.translation());
      mesh.quaternion.copy(rigidbody.rotation());
    });
  }

  dispose() {
    window.removeEventListener("mousemove", this.onMouseMove);
  }
}
