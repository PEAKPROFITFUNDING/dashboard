import { ReactNode } from "react";

interface CustomButtonProps {
  children: ReactNode; // Button text or content
  size?: "sm" | "md"; // Button size
  variant?: "primary" | "outline"; // Button variant
  color?: "green" | "red" | "blue" | "gray"; // Custom color variants
  startIcon?: ReactNode; // Icon before the text
  endIcon?: ReactNode; // Icon after the text
  onClick?: () => void; // Click handler
  disabled?: boolean; // Disabled state
  className?: string; // Additional classes
}

const CustomButton: React.FC<CustomButtonProps> = ({
  children,
  size = "md",
  variant = "primary",
  color = "blue",
  startIcon,
  endIcon,
  onClick,
  className = "",
  disabled = false,
}) => {
  // Size Classes
  const sizeClasses = {
    sm: "px-4 py-2 text-sm font-medium",
    md: "px-5 py-3.5 text-sm font-medium",
  };

  // Color Classes for Primary variant
  const primaryColorClasses = {
    green: "bg-green-500 text-white hover:bg-green-600 disabled:bg-green-300",
    red: "bg-red-500 text-white hover:bg-red-600 disabled:bg-red-300",
    blue: "bg-brand-500 text-white hover:bg-brand-600 disabled:bg-brand-300",
    gray: "bg-gray-500 text-white hover:bg-gray-600 disabled:bg-gray-300",
  };

  // Color Classes for Outline variant
  const outlineColorClasses = {
    green:
      "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800",
    red: "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800",
    blue: "bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800",
    gray: "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800",
  };

  // Variant Classes
  const getVariantClasses = () => {
    if (variant === "outline") {
      return outlineColorClasses[color];
    }
    return primaryColorClasses[color];
  };

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg transition ${className} ${
        sizeClasses[size]
      } ${getVariantClasses()} ${
        disabled ? "cursor-not-allowed opacity-50" : ""
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {startIcon && <span className="flex items-center">{startIcon}</span>}
      {children}
      {endIcon && <span className="flex items-center">{endIcon}</span>}
    </button>
  );
};

export default CustomButton;
