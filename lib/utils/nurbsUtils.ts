import * as THREE from "three";
import { NURBSCurve } from "three/examples/jsm/curves/NURBSCurve.js";

export function createNurbsCurve(
  nurbsPoints: THREE.Vector4[],
  nurbsDegree = 3,
): NURBSCurve {
  const nurbsKnots: number[] = [];

  for (let i = 0; i <= nurbsDegree; i++) {
    nurbsKnots.push(0);
  }

  for (let i = 0, j = nurbsPoints.length; i < j; i++) {
    const knot = (i + 1) / (j - nurbsDegree);
    nurbsKnots.push(THREE.MathUtils.clamp(knot, 0, 1));
  }

  const nurbsCurve = new NURBSCurve(nurbsDegree, nurbsKnots, nurbsPoints);
  return nurbsCurve;
}
