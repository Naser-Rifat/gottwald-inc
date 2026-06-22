"use client";

import {
  ADDRESS_LINES,
  BUILD_VERSION,
  NETWORK_SIGNATURE,
  REGISTRATION_CODE,
} from "../_data/brandMetadata";

interface MetadataItemProps {
  label: string;
  children: React.ReactNode;
  /** Wider bottom-margin variant used for the address block. */
  spacing?: "tight" | "loose";
}

function MetadataItem({
  label,
  children,
  spacing = "tight",
}: MetadataItemProps) {
  const mb = spacing === "loose" ? "mb-4" : "mb-2";
  return (
    <div>
      <h4
        className={`uppercase tracking-[0.3em] font-light text-white/80 ${mb}`}
      >
        {label}
      </h4>
      {children}
    </div>
  );
}

export default function MetadataColumn() {
  return (
    <div className="lg:col-span-3 flex flex-col gap-8 lg:items-end lg:text-right">
      <MetadataItem label="Registration Code">
        <span className="text-white tracking-widest tabular-nums font-mono">
          {REGISTRATION_CODE}
        </span>
      </MetadataItem>

      <MetadataItem label="Build Version">
        <span className="text-white tracking-widest font-mono">
          {BUILD_VERSION}
        </span>
      </MetadataItem>

      <MetadataItem label="Network Signature">
        <span className=" font-bold tracking-widest text-turquoise font-mono drop-shadow-[0_0_6px_rgba(18,168,172,0.35)]">
          {NETWORK_SIGNATURE}
        </span>
      </MetadataItem>

      <MetadataItem label="Address" spacing="loose">
        <address className="text-white tracking-[0.1em] font-medium text-[13px] uppercase not-italic leading-[1.7]">
          {ADDRESS_LINES.map((line, idx) => (
            <span key={idx}>
              {line}
              {idx < ADDRESS_LINES.length - 1 && <br />}
            </span>
          ))}
        </address>
      </MetadataItem>
    </div>
  );
}
