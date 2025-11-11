"use client";

import { cn } from "@/lib/utils";
import React, { useState } from "react";

export const MagicCard = ({
  children,
  className,
  gradientSize = 200,
  gradientColor = "#262626",
  gradientOpacity = 0.8,
}: {
  children: React.ReactNode;
  className?: string;
  gradientSize?: number;
  gradientColor?: string;
  gradientOpacity?: number;
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });
  };

  return (
    <div
      className={cn("group relative rounded-3xl", className)}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 rounded-3xl"
        style={{
          background: `radial-gradient(${gradientSize}px circle at ${mousePosition.x}px ${mousePosition.y}px, ${gradientColor}, transparent 40%)`,
          opacity: isHovering ? gradientOpacity : 0,
        }}
      />
      {children}
    </div>
  );
};

