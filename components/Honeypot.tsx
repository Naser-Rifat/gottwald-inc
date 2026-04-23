export default function Honeypot() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        left: "-9999px",
        width: "1px",
        height: "1px",
        overflow: "hidden",
      }}
    >
      <label htmlFor="company_fax">Company fax</label>
      <input
        type="text"
        id="company_fax"
        name="company_fax"
        tabIndex={-1}
        autoComplete="off"
      />
    </div>
  );
}
