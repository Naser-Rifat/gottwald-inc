/**
 * Single bootstrap for GSAP + ScrollTrigger.
 *
 * Before this module existed, every file that used `ScrollTrigger`
 * called `gsap.registerPlugin(ScrollTrigger)` defensively (15 files at
 * last count). The plugin registration is idempotent so the duplicates
 * weren't *wrong*, but they added redundant module-level side effects
 * and 15 copies of the same import pair.
 *
 * Now anyone who needs ScrollTrigger pulls both from here:
 *
 *   import { gsap, ScrollTrigger } from "@/lib/gsap-bootstrap";
 *
 * The `if (typeof window …)` guard keeps registration off the server
 * render path — ScrollTrigger reads from `window`/`document` at import
 * time on some entry points and would otherwise crash SSR.
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
