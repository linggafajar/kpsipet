"use client";

import React from "react";

type CardProps = {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  borderColor?: "blue" | "green" | "red" | "yellow";
  iconColor?: "blue" | "green" | "yellow" | "red";
  className?: string;
};

export default function Card({
  title,
  value,
  icon,
  borderColor = "blue",
  iconColor = "blue",
  className = "",
}: CardProps) {
  const borderClasses = {
    blue: "border-blue-500",
    green: "border-green-500",
    red: "border-red-500",
    yellow: "border-yellow-500",
  };

  const iconClasses = {
    blue: "text-blue-500",
    green: "text-green-500",
    red: "text-red-500",
    yellow: "text-yellow-500",
  };

  return (
    <div
      className={`flex flex-col items-center p-4 bg-white rounded-lg shadow border ${borderClasses[borderColor]} ${className}`}
    >
      <p className="text-gray-500 font-semibold">{title}</p>
      <p className="text-2xl font-bold my-2">{value}</p>
      <div className={`text-3xl ${iconClasses[iconColor]}`}>{icon}</div>
    </div>
  );
}
