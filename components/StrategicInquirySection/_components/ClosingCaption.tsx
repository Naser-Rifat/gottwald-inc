"use client";

export default function ClosingCaption() {
  return (
    <div className="strategic-reveal flex flex-col gap-5 opacity-0 mt-2">
      <span aria-hidden="true" className="block h-px w-full bg-silver/15" />
      <div className="flex items-center gap-3">
        <span className="block w-1 h-1 rounded-full bg-gold/70" />
        <p className="text-[10px] tracking-[0.32em] uppercase text-silver/55 font-medium">
          Confidential by default — Standards-led governance — Network
          capacity: 888±
        </p>
      </div>
    </div>
  );
}
