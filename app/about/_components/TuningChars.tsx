/**
 * Server-rendered per-character spans for the hero `.tuning-line`
 * sequence. Previously these were created on hydration by
 * `line.innerHTML = ""` + DOM-mutation in AboutClient — which briefly
 * left the SSR-painted text empty and invalidated the LCP candidate
 * (Chrome counted LCP from when the per-char structure was repainted,
 * adding ~400–500ms of render delay on `/about`).
 *
 * Rendering the char structure in JSX lets the same string paint *as
 * its final structure* on first frame; GSAP then animates the
 * already-mounted `.tuning-char` nodes without ever touching innerHTML.
 *
 * The parent `<h1>` carries `aria-label="…"`, so each char span is
 * marked `aria-hidden="true"` and the headline reads as a single phrase
 * to screen readers.
 */
export default function TuningChars({ text }: { text: string }) {
  return (
    <>
      {Array.from(text).map((ch, i) => (
        <span
          key={i}
          className="tuning-char inline-block"
          aria-hidden="true"
        >
          {ch === " " ? " " : ch}
        </span>
      ))}
    </>
  );
}
