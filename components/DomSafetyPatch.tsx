"use client";

import { useEffect } from "react";

/**
 * DomSafetyPatch
 *
 * Patches `Node.prototype.removeChild` and `Node.prototype.insertBefore`
 * to gracefully handle cases where React's reconciler tries to remove or
 * insert nodes that have been moved/removed by third-party libraries
 * (Three.js, GSAP ScrollTrigger, browser extensions, ad scripts, etc).
 *
 * This is the canonical fix for the well-known React error:
 * "Failed to execute 'removeChild' on 'Node': The node to be removed
 *  is not a child of this node."
 *
 * @see https://github.com/facebook/react/issues/11538
 * @see https://github.com/vercel/next.js/issues/35642
 */
export default function DomSafetyPatch() {
  useEffect(() => {
    // Patch removeChild
    const originalRemoveChild = Node.prototype.removeChild;
    Node.prototype.removeChild = function <T extends Node>(child: T): T {
      if (child.parentNode !== this) {
        if (process.env.NODE_ENV === "development") {
          console.warn(
            "[DomSafetyPatch] removeChild: node is not a child of this parent, skipping.",
          );
        }
        return child;
      }
      return originalRemoveChild.call(this, child) as T;
    };

    // Patch insertBefore
    const originalInsertBefore = Node.prototype.insertBefore;
    Node.prototype.insertBefore = function <T extends Node>(
      newNode: T,
      referenceNode: Node | null,
    ): T {
      if (referenceNode && referenceNode.parentNode !== this) {
        if (process.env.NODE_ENV === "development") {
          console.warn(
            "[DomSafetyPatch] insertBefore: reference node is not a child of this parent, skipping.",
          );
        }
        return newNode;
      }
      return originalInsertBefore.call(this, newNode, referenceNode) as T;
    };

    return () => {
      Node.prototype.removeChild = originalRemoveChild;
      Node.prototype.insertBefore = originalInsertBefore;
    };
  }, []);

  return null;
}
