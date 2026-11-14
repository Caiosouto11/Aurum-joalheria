export default function Gem({ className = "" }) {
  return (
    <svg
      viewBox="0 0 200 180"
      className={className}
      role="img"
      aria-label="Diamante lapidado"
    >
      <defs>
        <clipPath id="gem-clip">
          <polygon points="50,40 150,40 190,80 100,170 10,80" />
        </clipPath>
        <linearGradient id="gem-shine-grad" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.9" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>

      <g stroke="#6b7886" strokeWidth="0.8" strokeLinejoin="round">
        <polygon points="50,40 100,40 85,80 70,80" fill="#e4ebf1" />
        <polygon points="100,40 150,40 130,80 115,80" fill="#cdd8e2" />
        <polygon points="100,40 115,80 85,80" fill="#f8fbfd" />
        <polygon points="50,40 70,80 10,80" fill="#b9c6d2" />
        <polygon points="150,40 190,80 130,80" fill="#9eadbb" />
        <polygon points="10,80 70,80 100,170" fill="#aebdcb" />
        <polygon points="70,80 130,80 100,170" fill="#dfe8ef" />
        <polygon points="130,80 190,80 100,170" fill="#8697a8" />
      </g>

      <g clipPath="url(#gem-clip)">
        <rect
          className="gem-shine"
          x="0"
          y="0"
          width="46"
          height="180"
          fill="url(#gem-shine-grad)"
        />
      </g>
    </svg>
  );
}
