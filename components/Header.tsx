export default function Header() {
  return (
    <header className="flex justify-between items-start gap-5 py-[3vw]">
      <div className="flex-1">
        <h3 className="text-lg font-bold tracking-wide">LUSION.CO</h3>
        <p className="text-sm text-gray-600">
          A recreation by{" "}
          <a
            href="https://canxerian.com"
            className="text-gray-500 hover:text-blue-600 transition-colors underline-offset-2 hover:underline"
          >
            canxerian.com
          </a>
        </p>
      </div>
      <div className="flex-[3]">
        <p className="text-sm text-gray-600">Recreated for fun and education</p>
        <p className="text-sm text-gray-600">
          Visit the original:{" "}
          <a
            href="https://lusion.co"
            className="text-gray-500 hover:text-blue-600 transition-colors underline-offset-2 hover:underline"
          >
            lusion.co
          </a>
        </p>
      </div>
      <div>
        <a
          className="button"
          href="https://github.com/canxerian/lusion-reverse-engineered"
          target="_blank"
          rel="noopener noreferrer"
        >
          View on GitHub
        </a>
      </div>
    </header>
  );
}
