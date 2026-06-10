import { Image } from '@tarojs/components';
import { UI_ICONS, UiIconName } from '../../assets/icons/icons';
import './index.scss';

interface AppIconProps {
  name: UiIconName;
  size?: number;
  className?: string;
}

export default function AppIcon({ name, size = 40, className = '' }: AppIconProps) {
  const src = UI_ICONS[name];
  if (!src) return null;

  return (
    <Image
      className={`app-icon ${className}`.trim()}
      src={src}
      style={{ width: `${size}rpx`, height: `${size}rpx` }}
      mode='aspectFit'
    />
  );
}
