import React from 'react';
import './Button.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'contained' | 'outlined' | 'text';
  size?: 'small' | 'medium' | 'large';
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'contained',
  size = 'medium',
  startIcon,
  endIcon,
  className = '',
  ...props
}) => {
  return (
    <button
      className={`button button-${variant} button-${size} ${className}`}
      {...props}
    >
      {startIcon && <span className="button-icon start">{startIcon}</span>}
      {children}
      {endIcon && <span className="button-icon end">{endIcon}</span>}
    </button>
  );
};

export default Button; 