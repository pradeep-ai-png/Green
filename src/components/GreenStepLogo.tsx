import React from 'react';

interface GreenStepLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'hero';
  showSubtitle?: boolean;
  className?: string;
  glow?: boolean;
  orientation?: 'vertical' | 'horizontal';
}

export const GreenStepLogo: React.FC<GreenStepLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  className = '',
  glow = false,
  orientation = 'vertical',
}) => {
  const sizeMap = {
    xs: {
      emblem: 28,
      titleClass: 'text-sm font-bold',
      subClass: 'text-[9px]',
    },
    sm: {
      emblem: 34,
      titleClass: 'text-base font-bold',
      subClass: 'text-[10px]',
    },
    md: {
      emblem: 46,
      titleClass: 'text-xl font-bold',
      subClass: 'text-xs',
    },
    lg: {
      emblem: 64,
      titleClass: 'text-2xl font-extrabold',
      subClass: 'text-xs sm:text-sm',
    },
    hero: {
      emblem: 88,
      titleClass: 'text-2xl sm:text-3xl font-extrabold',
      subClass: 'text-xs sm:text-sm font-medium',
    },
  };

  const current = sizeMap[size];

  return (
    <div
      className={`select-none inline-flex ${
        orientation === 'horizontal' ? 'flex-row items-center gap-2.5' : 'flex-col items-center justify-center text-center'
      } ${className}`}
    >
      {/* Visual Logo Mark */}
      <div className="relative flex items-center justify-center flex-shrink-0">
        {glow && (
          <div className="absolute inset-0 bg-emerald-500/25 blur-xl rounded-2xl scale-125 pointer-events-none" />
        )}

        <svg
          width={current.emblem}
          height={current.emblem}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative drop-shadow-sm transition-transform duration-200 hover:scale-105"
        >
          <defs>
            {/* Background container gradient */}
            <linearGradient id="gsBgGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>

            {/* Inner rim glow */}
            <linearGradient id="gsRimGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#6EE7B7" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#047857" stopOpacity="0.2" />
            </linearGradient>

            {/* Left Leaf Gradient */}
            <linearGradient id="gsLeftLeaf" x1="26" y1="26" x2="52" y2="76" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#A7F3D0" />
              <stop offset="100%" stopColor="#34D399" />
            </linearGradient>

            {/* Right Leaf Gradient */}
            <linearGradient id="gsRightLeaf" x1="74" y1="26" x2="48" y2="76" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#6EE7B7" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>

            {/* Center Leaf Gradient */}
            <linearGradient id="gsCenterLeaf" x1="50" y1="12" x2="50" y2="78" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#ECFDF5" />
              <stop offset="100%" stopColor="#A7F3D0" />
            </linearGradient>
          </defs>

          {/* Rounded squircle tile */}
          <rect
            x="4"
            y="4"
            width="92"
            height="92"
            rx="24"
            fill="url(#gsBgGrad)"
          />

          {/* Inner subtle rim stroke */}
          <rect
            x="6"
            y="6"
            width="88"
            height="88"
            rx="22"
            stroke="url(#gsRimGrad)"
            strokeWidth="1.5"
          />

          {/* Stepping Foundation Base (Ascending 'Step' symbol) */}
          <path
            d="M 28 81 C 28 77 34 75 42 75 L 58 75 C 66 75 72 77 72 81 Z"
            fill="#064E3B"
            opacity="0.6"
          />

          {/* Left Wing Leaf */}
          <path
            d="M 50 72 C 34 62 24 50 25 34 C 33 30 46 38 50 72 Z"
            fill="url(#gsLeftLeaf)"
          />

          {/* Right Wing Leaf */}
          <path
            d="M 50 72 C 66 62 76 50 75 34 C 67 30 54 38 50 72 Z"
            fill="url(#gsRightLeaf)"
          />

          {/* Center Main Leaf */}
          <path
            d="M 50 76 C 45 52 35 34 38 18 C 44 14 56 14 62 18 C 65 34 55 52 50 76 Z"
            fill="url(#gsCenterLeaf)"
          />

          {/* Center Stem Line */}
          <path
            d="M 50 24 L 50 74"
            stroke="#047857"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.65"
          />

          {/* Spark of Innovation */}
          <circle cx="50" cy="16" r="2.5" fill="#FEF08A" />
        </svg>
      </div>

      {/* Brand Typography with perfect optical alignment */}
      <div
        className={`flex flex-col ${
          orientation === 'horizontal' ? 'items-start text-left' : 'items-center text-center mt-2'
        }`}
      >
        <div className={`tracking-tight flex items-baseline leading-none ${current.titleClass}`}>
          <span className="text-slate-900 font-extrabold">Green</span>
          <span className="text-emerald-600 font-extrabold ml-1">Step</span>
          <span className="text-[0.6em] font-bold text-emerald-700 ml-1">AI</span>
        </div>
        {showSubtitle && (
          <p className={`text-slate-400 font-medium tracking-wide mt-1 leading-none ${current.subClass}`}>
            Small Steps • Big Change
          </p>
        )}
      </div>
    </div>
  );
};
