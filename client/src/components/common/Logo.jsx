const Logo = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 512 512" fill="none" className={className}>
    <g transform="translate(256 256) scale(2.2) translate(-256 -256)">
      <path
        d="m156 156 100 100 100-100v200H156z"
        stroke="currentColor"
        strokeWidth="16"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m206 156 50 50 50-50"
        stroke="currentColor"
        strokeWidth="16"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  </svg>
);

export default Logo;
