import React from 'react';
import { LucideIcon } from 'lucide-react';

interface IconProps {
  icon: LucideIcon;
  size?: number | string;
  className?: string;
  color?: string;
}

export const Icon: React.FC<IconProps> = ({
  icon: LucideIcon,
  size = 24,
  className = '',
  color = 'currentColor',
}) => {
  return (
    <LucideIcon
      size={size}
      className={className}
      color={color}
      aria-hidden="true"
    />
  );
};