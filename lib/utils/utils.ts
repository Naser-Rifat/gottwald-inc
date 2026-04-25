import * as THREE from "three";

export function pageToWorldCoords(
  pageX: number,
  pageY: number,
  camera: THREE.OrthographicCamera,
): THREE.Vector3 {
  const normalisedScreenCoordsX = (pageX / window.innerWidth) * 2 - 1;
  const normalisedScreenCoordsY = -(pageY / window.innerHeight) * 2 + 1;

  const nearRelativeToCam = camera.near + camera.position.z;
  const farRelativeToCam = -camera.far - camera.position.z;
  const t = THREE.MathUtils.inverseLerp(
    farRelativeToCam,
    nearRelativeToCam,
    -camera.position.z,
  );

  const screenPos = new THREE.Vector3(
    normalisedScreenCoordsX,
    normalisedScreenCoordsY,
    -t,
  );
  screenPos.unproject(camera);

  return screenPos;
}

export function pagePixelsToWorldUnit(
  pagePixels: number,
  camera: THREE.OrthographicCamera,
): number {
  const camViewHeight = camera.top - camera.bottom;
  const worldUnitsPerPixel = camViewHeight / window.innerHeight;
  return pagePixels * worldUnitsPerPixel;
}

export function updateCameraIntrisics(
  cameraRef: THREE.OrthographicCamera,
  frustum: number,
): void {
  const aspect = window.innerWidth / window.innerHeight;
  const horizontal = (frustum * aspect) / 2;
  const vertical = frustum / 2;
  cameraRef.left = -horizontal;
  cameraRef.right = horizontal;
  cameraRef.top = vertical;
  cameraRef.bottom = -vertical;
  cameraRef.updateMatrixWorld();
  cameraRef.updateProjectionMatrix();
}

export function createBevelledPlane(
  width: number,
  height: number,
  radius: number,
): THREE.ShapeGeometry {
  const x = width / 2;
  const y = height / 2;

  const shape = new THREE.Shape();
  shape.moveTo(-x + radius, y);
  shape.lineTo(x - radius, y);
  shape.quadraticCurveTo(x, y, x, y - radius);
  shape.lineTo(x, -y + radius);
  shape.quadraticCurveTo(x, -y, x - radius, -y);
  shape.lineTo(-x + radius, -y);
  shape.quadraticCurveTo(-x, -y, -x, -y + radius);
  shape.lineTo(-x, y - radius);
  shape.quadraticCurveTo(-x, y, -x + radius, y);

  const geometry = new THREE.ShapeGeometry(shape);
  geometry.computeBoundingBox();

  const bbox = geometry.boundingBox!;
  const minX = bbox.min.x;
  const maxX = bbox.max.x;
  const minY = bbox.min.y;
  const maxY = bbox.max.y;

  const rangeX = maxX - minX;
  const rangeY = maxY - minY;

  geometry.attributes.uv = new THREE.BufferAttribute(
    new Float32Array(geometry.attributes.position.count * 2),
    2,
  );

  for (let i = 0; i < geometry.attributes.position.count; i++) {
    const px = geometry.attributes.position.getX(i);
    const py = geometry.attributes.position.getY(i);

    const u = (px - minX) / rangeX;
    const v = (py - minY) / rangeY;

    (geometry.attributes.uv as THREE.BufferAttribute).setXY(i, u, v);
  }

  return geometry;
}

export function getElementPageCoords(
  elementId: string,
  anchor = { x: 0.5, y: 0.5 },
) {
  const element = document.getElementById(elementId);
  if (!element) return { x: 0, y: 0, width: 0, height: 0 };
  const rect = element.getBoundingClientRect();
  const width = rect.width;
  const height = rect.height;
  const elX = rect.left + width * anchor.x;
  const elY = rect.top + height * anchor.y;

  return { x: elX, y: elY, width, height };
}

export function elementToWorldRect(
  elementId: string,
  camera: THREE.OrthographicCamera,
  anchor = { x: 0.5, y: 0.5 },
) {
  const elementPageCoords = getElementPageCoords(elementId, anchor);

  const position = pageToWorldCoords(
    elementPageCoords.x,
    elementPageCoords.y,
    camera,
  );
  const width = pagePixelsToWorldUnit(elementPageCoords.width, camera);
  const height = pagePixelsToWorldUnit(elementPageCoords.height, camera);

  return { position, width, height };
}

export function elementToLocalRect(
  elementId: string,
  parent: THREE.Object3D,
  camera: THREE.OrthographicCamera,
) {
  const worldRect = elementToWorldRect(elementId, camera, { x: 0, y: 0 });
  const { position, width, height } = worldRect;

  parent.worldToLocal(position);

  return { position, width, height };
}

export function elementToLocalRectPoints(
  elementId: string,
  parent: THREE.Object3D,
  camera: THREE.OrthographicCamera,
) {
  const worldRect = elementToWorldRect(elementId, camera, { x: 0, y: 0 });

  const tl = worldRect.position;

  const tr = worldRect.position.clone();
  tr.x += worldRect.width;

  const bl = worldRect.position.clone();
  bl.y -= worldRect.height;

  const br = worldRect.position.clone();
  br.x += worldRect.width;
  br.y -= worldRect.height;

  const center = worldRect.position.clone();
  center.x += worldRect.width * 0.5;
  center.y -= worldRect.height * 0.5;

  parent.worldToLocal(tl);
  parent.worldToLocal(tr);
  parent.worldToLocal(br);
  parent.worldToLocal(bl);

  return { tl, tr, br, bl, center };
}

export type VideoSource = { src: string; type: string };

export function createVideoTexture(
  sources: VideoSource[],
): THREE.VideoTexture {
  const video = document.createElement("video");
  // All config MUST be set before assigning src — src is what triggers the
  // network fetch and any preload behavior. crossOrigin must precede src for
  // WebGL to sample a cross-origin video without tainting the canvas.
  video.crossOrigin = "anonymous";
  video.loop = true;
  video.muted = true;
  video.playsInline = true;
  // "auto" lets the browser progressively buffer via range requests so
  // THREE.VideoTexture has frames to sample the moment play() succeeds.
  // "metadata" leaves the texture empty until play() forces data load,
  // producing a black panel during the gap.
  video.preload = "auto";

  // Pick the first source the browser claims it can play. canPlayType returns
  // "probably" / "maybe" / "" — anything non-empty is good enough to attempt.
  // Safari can't decode WebM/VP9 reliably, so the MP4 fallback is what keeps
  // the panel working on iOS and older macOS.
  const chosen =
    sources.find((s) => video.canPlayType(s.type) !== "") ?? sources[0];
  const src = chosen.src;
  video.src = src;
  video.addEventListener("error", () => {
    console.warn(`[VideoPanel] load error for ${src}`, video.error);
  });

  const tryPlay = () => {
    video.play().catch((err) => {
      // Surface autoplay/CORS/network failures so they're debuggable.
      // Without this, a broken video looks identical to a working one.
      console.warn(`[VideoPanel] play() rejected:`, err?.name, err?.message);
    });
  };

  // Defer play until the video section is actually in view
  const startAnchor = document.getElementById("video-panel-start");
  if (startAnchor) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          tryPlay();
        } else {
          video.pause();
        }
      },
      { rootMargin: "200px 0px" }, // Start loading slightly before in view
    );
    observer.observe(startAnchor);
  } else {
    // Fallback: play as soon as the browser reports data is ready
    video.addEventListener("canplay", tryPlay, { once: true });
  }

  const texture = new THREE.VideoTexture(video);
  texture.colorSpace = THREE.SRGBColorSpace;

  return texture;
}
