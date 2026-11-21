import React from 'react';

export const LogoIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      {/* Abstract Person Figure raising arm */}
      <path 
        d="M50 78c-12 0-25 8-25 22h14c0-6 5-10 11-10s11 4 11 10h14c0-14-13-22-25-22z" 
        fill="currentColor" 
      />
      
      {/* Arm extended to dot */}
      <path 
        d="M60 80 Q 75 75 80 50" 
        stroke="currentColor" 
        strokeWidth="6" 
        strokeLinecap="round" 
        fill="none" 
      />

      {/* Head */}
      <circle cx="50" cy="60" r="10" fill="currentColor" />

      {/* Graduation Cap */}
      <path 
        d="M20 40L50 25L80 40L50 55L20 40Z" 
        fill="currentColor" 
      />
      <rect x="40" y="47" width="20" height="8" fill="currentColor" />

      {/* Tassel */}
      <path 
        d="M30 45 V60" 
        stroke="currentColor" 
        strokeWidth="3" 
        strokeLinecap="round" 
      />
      
      {/* Dot */}
      <circle cx="85" cy="45" r="8" fill="#4ADE80" />
    </svg>
  );
};
