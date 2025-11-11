"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";

interface ParticlesProps {
  className?: string;
  quantity?: number;
  staticity?: number;
  ease?: number;
  size?: number;
  refresh?: boolean;
  color?: string;
  vx?: number;
  vy?: number;
  shape?: "circle" | "square";
}

export const Particles = ({
  className,
  quantity = 30,
  staticity = 50,
  ease = 50,
  size = 0.4,
  refresh = false,
  color = "#ffffff",
  vx = 0,
  vy = 0,
  shape = "circle",
}: ParticlesProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const context = useRef<CanvasRenderingContext2D | null>(null);
  const circles = useRef<any[]>([]);
  const animationFrame = useRef<number | null>(null);
  const [canvasSize, setCanvasSize] = useState({ w: 0, h: 0 });
  const [dpr, setDpr] = useState(1);

  useEffect(() => {
    if (canvasRef.current) {
      context.current = canvasRef.current.getContext("2d");
    }
    initCanvas();
    animate();
    window.addEventListener("resize", initCanvas);

    return () => {
      window.removeEventListener("resize", initCanvas);
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [color, quantity, ease, staticity, size, vx, vy]);

  useEffect(() => {
    initCanvas();
  }, [refresh]);

  const initCanvas = () => {
    resizeCanvas();
    drawParticles();
  };

  const resizeCanvas = () => {
    if (canvasContainerRef.current && canvasRef.current && context.current) {
      circles.current = [];
      setCanvasSize({
        w: canvasContainerRef.current.offsetWidth,
        h: canvasContainerRef.current.offsetHeight,
      });
      setDpr(window.devicePixelRatio || 1);
    }
  };

  const circleParams = (): any => {
    const x = Math.floor(Math.random() * canvasSize.w);
    const y = Math.floor(Math.random() * canvasSize.h);
    const translateX = vx !== 0 ? vx : 0;
    const translateY = vy !== 0 ? vy : 0;
    return {
      x,
      y,
      translateX,
      translateY,
      size: Math.floor(Math.random() * 2) + size,
      alpha: 0,
      targetAlpha: parseFloat((Math.random() * 0.6 + 0.1).toFixed(1)),
      dx: (Math.random() - 0.5) * 0.1,
      dy: (Math.random() - 0.5) * 0.1,
      magnetism: 0.1 + Math.random() * 4,
    };
  };

  const drawCircle = (circle: any, update = false) => {
    if (context.current) {
      const { x, y, translateX, translateY, size, alpha } = circle;
      context.current.translate(translateX, translateY);
      context.current.beginPath();
      context.current.arc(x, y, size, 0, 2 * Math.PI);
      context.current.fillStyle = color;
      context.current.globalAlpha = alpha;
      if (shape === "square") {
        context.current.fillRect(x - size, y - size, size * 2, size * 2);
      } else {
        context.current.fill();
      }
      context.current.closePath();
      context.current.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (!update) {
        circles.current.push(circle);
      }
    }
  };

  const clearContext = () => {
    if (context.current) {
      context.current.clearRect(0, 0, canvasSize.w, canvasSize.h);
    }
  };

  const drawParticles = () => {
    clearContext();
    const particleCount = quantity;
    for (let i = 0; i < particleCount; i++) {
      const circle = circleParams();
      drawCircle(circle);
    }
  };

  const remapValue = (
    value: number,
    start1: number,
    end1: number,
    start2: number,
    end2: number
  ): number => {
    const remapped =
      ((value - start1) / (end1 - start1)) * (end2 - start2) + start2;
    return remapped > 0 ? remapped : 0;
  };

  const animate = () => {
    clearContext();
    circles.current.forEach((circle: any, i: number) => {
      // Handle circle
      if (circle.alpha < circle.targetAlpha) {
        circle.alpha += 0.01;
      } else if (circle.alpha > circle.targetAlpha) {
        circle.alpha -= 0.01;
      }
      circle.x += circle.dx;
      circle.y += circle.dy;
      circle.translateX +=
        (Math.random() - 0.5) * 0.1 * (1 - staticity / 100);
      circle.translateY +=
        (Math.random() - 0.5) * 0.1 * (1 - staticity / 100);
      // Reset if out of bounds
      if (
        circle.x < 0 ||
        circle.x > canvasSize.w ||
        circle.y < 0 ||
        circle.y > canvasSize.h
      ) {
        circles.current[i] = circleParams();
      }
      drawCircle(circle, true);
    });
    animationFrame.current = requestAnimationFrame(animate);
  };

  return (
    <div className={cn("pointer-events-none", className)} ref={canvasContainerRef} aria-hidden="true">
      <canvas
        ref={canvasRef}
        width={canvasSize.w * dpr}
        height={canvasSize.h * dpr}
        className="h-full w-full"
      />
    </div>
  );
};

