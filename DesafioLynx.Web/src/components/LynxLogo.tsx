import React from "react";

interface LynxLogoProps {
  className?: string;
  size?: number;
}

const LynxLogo: React.FC<LynxLogoProps> = ({ className, size = 32 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="lynxGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4F46E5" />
          <stop offset="50%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
      </defs>

      {/* Lynx pentagon shape with overlapping effect */}
      <g transform="translate(50,50)">
        {/* Pentagon pieces */}
        <path
          d="M-15,-20 L15,-20 L25,0 L10,18 L-10,18 L-25,0 Z"
          fill="url(#lynxGradient)"
          opacity="0.9"
          transform="rotate(0)"
        />
        <path
          d="M-15,-20 L15,-20 L25,0 L10,18 L-10,18 L-25,0 Z"
          fill="url(#lynxGradient)"
          opacity="0.7"
          transform="rotate(72)"
        />
        <path
          d="M-15,-20 L15,-20 L25,0 L10,18 L-10,18 L-25,0 Z"
          fill="url(#lynxGradient)"
          opacity="0.5"
          transform="rotate(144)"
        />
        <path
          d="M-15,-20 L15,-20 L25,0 L10,18 L-10,18 L-25,0 Z"
          fill="url(#lynxGradient)"
          opacity="0.3"
          transform="rotate(216)"
        />
        <path
          d="M-15,-20 L15,-20 L25,0 L10,18 L-10,18 L-25,0 Z"
          fill="url(#lynxGradient)"
          opacity="0.6"
          transform="rotate(288)"
        />

        {/* Center white pentagon */}
        <path d="M-8,-10 L8,-10 L12,0 L5,9 L-5,9 L-12,0 Z" fill="white" />
      </g>
    </svg>
  );
};

export default LynxLogo;
