export default function CustomScrollbar() {
  return (
    <div
      id="scrollbar"
      className="fixed h-[120px] w-1 bg-black/10 right-[10px] top-1/2 -translate-y-1/2 rounded-lg z-50"
    >
      <div
        id="scrollbar-handle"
        className="bg-black/45 absolute w-full h-[10px] rounded-lg"
      />
    </div>
  );
}
