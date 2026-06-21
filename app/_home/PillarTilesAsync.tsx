import { getPillars } from "@/lib/api/pillars";
import PillarTilesSection from "./PillarTilesSection";

/**
 * Server component that fetches pillars then renders PillarTilesSection.
 *
 * This file exists so page.tsx can stream the above-the-fold sections
 * (intro portal, hero, video section, intro copy) immediately while the
 * ~800ms pillars API call resolves in parallel. Without this split, the
 * await for getPillars() at the page level blocked every single byte of
 * HTML — even content that didn't depend on pillar data.
 *
 * The wrapper sits inside a <Suspense> boundary in page.tsx; its fallback
 * occupies the section's full viewport height so the page doesn't shift
 * when the pillar tiles stream in.
 */
export default async function PillarTilesAsync() {
  const pillars = await getPillars();
  return <PillarTilesSection pillars={pillars} />;
}
