// src/components/Button.tsx
"use client";

import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "blue" | "white-black" | "white-blue"; // Warna/variant
  size?: "sm" | "md" | "lg";
  className?: string;
};

export default function Button({
  children,
  onClick,
  variant = "blue",
  size = "md",
  className = "",
}: ButtonProps) {
  const variantClasses = {
    "blue": "bg-blue-600 hover:bg-blue-700 text-white",
    "white-black": "bg-white hover:bg-gray-100 text-black border border-gray-300",
    "white-blue": "bg-white hover:bg-blue-50 text-blue-600 border border-blue-600",
  };

  const sizeClasses = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      onClick={onClick}
      className={`rounded-[10px] ${variantClasses[variant]} ${sizeClasses[size]} ${className} transition-colors duration-200`}
    >
      {children}
    </button>
  );
}
