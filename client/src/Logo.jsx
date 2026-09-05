// Midnight Geometric Triangle Logo (Gold/Yellow)
export function MidnightLogo({ size = 32, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'block' }}
    >
      {/* Outer inverted triangle */}
      <polygon points="50,92 6,10 94,10" fill="#F5D04E" />
      {/* Geometric inner cuts matching the uploaded Midnight logo */}
      <polygon points="28,24 55,24 41,45" fill="#111411" />
      <polygon points="62,10 71,10 49,76" fill="#111411" />
      <polygon points="76,24 49,76 59,62 76,38" fill="#111411" />
      <line x1="62" y1="10" x2="34" y2="62" stroke="#111411" strokeWidth="3" />
      <line x1="71" y1="10" x2="40" y2="70" stroke="#111411" strokeWidth="3" />
      <line x1="28" y1="24" x2="55" y2="24" stroke="#111411" strokeWidth="3.5" />
      <line x1="24" y1="32" x2="41" y2="45" stroke="#111411" strokeWidth="3.5" />
    </svg>
  );
}

// Valorant Official V Emblem (Red)
export function ValorantLogo({ size = 32, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'block' }}
    >
      {/* Left long slash of Valorant V */}
      <polygon points="22,20 22,39 52,77 66,77" fill="#FF4655" />
      {/* Right top triangle of Valorant V */}
      <polygon points="60,44 88,20 88,39 74,44" fill="#FF4655" />
    </svg>
  );
}

// Bloodstrike Emblem (Official Style B Skull Icon)
export function BloodstrikeLogo({ size = 32, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'block' }}
    >
      <rect x="10" y="10" width="80" height="80" rx="12" fill="#E52521" />
      <text
        x="50"
        y="68"
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize="54"
        fontWeight="900"
        fontFamily="'Space Grotesk', system-ui, sans-serif"
        fontStyle="italic"
        letterSpacing="-2"
      >
        B
      </text>
      <path d="M 20 80 L 80 20" stroke="#111411" strokeWidth="6" strokeLinecap="round" opacity="0.3" />
    </svg>
  );
}

// PUBG Mobile Official Style Logo (White box outline on black with PUBG MOBILE text / Level 3 Helmet silhouette)
export function PubgLogo({ size = 32, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'block' }}
    >
      {/* Outer border container */}
      <rect x="10" y="15" width="80" height="70" rx="4" stroke="#FFFFFF" strokeWidth="6" fill="#111411" />
      {/* Inner PUBG box frame tabs */}
      <rect x="5" y="32" width="5" height="12" fill="#FFFFFF" />
      <rect x="90" y="32" width="5" height="12" fill="#FFFFFF" />
      <rect x="5" y="56" width="5" height="12" fill="#FFFFFF" />
      <rect x="90" y="56" width="5" height="12" fill="#FFFFFF" />
      {/* PUBG Text */}
      <path
        d="M 18 26 H 32 C 35 26 37 28 37 31 V 37 C 37 40 35 42 32 42 H 24 V 54 H 18 V 26 Z M 24 32 V 36 H 31 V 32 H 24 Z"
        fill="#FFFFFF"
      />
      <path
        d="M 40 26 H 46 V 46 C 46 51 49 54 53 54 C 57 54 60 51 60 46 V 26 H 66 V 46 C 66 54 60 59 53 59 C 46 59 40 54 40 46 V 26 Z"
        fill="#FFFFFF"
      />
      <path
        d="M 70 26 H 82 C 85 26 87 28 87 31 V 50 C 87 53 85 55 82 55 H 70 V 26 Z M 76 31 V 49 H 81 V 31 H 76 Z"
        fill="#FFFFFF"
      />
      {/* MOBILE subtext */}
      <text
        x="50"
        y="75"
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize="11"
        fontWeight="900"
        fontFamily="sans-serif"
        letterSpacing="2"
      >
        MOBILE
      </text>
    </svg>
  );
}

// Roblox Tilted Square Emblem (White/Silver)
export function RobloxLogo({ size = 32, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'block' }}
    >
      <g transform="rotate(-15 50 42)">
        <rect x="22" y="14" width="56" height="56" rx="4" fill="#FFFFFF" />
        <rect x="40" y="32" width="20" height="20" rx="2" fill="#111411" />
      </g>
      <text
        x="50"
        y="92"
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize="15"
        fontWeight="900"
        fontFamily="sans-serif"
        letterSpacing="3"
      >
        ROBLOX
      </text>
    </svg>
  );
}
