import { View, Text } from '@tarojs/components';
import AppIcon from '../app-icon';
import { UiIconName } from '../../assets/icons/icons';
import './index.scss';

type ButtonType = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface AppButtonProps {
  type?: ButtonType;
  size?: ButtonSize;
  icon?: UiIconName;
  disabled?: boolean;
  block?: boolean;
  className?: string;
  onClick?: () => void;
  children: string;
}

export default function AppButton({
  type = 'primary',
  size = 'md',
  icon,
  disabled = false,
  block = false,
  className = '',
  onClick,
  children,
}: AppButtonProps) {
  const iconSize = size === 'sm' ? 28 : size === 'lg' ? 36 : 32;

  return (
    <View
      className={[
        'app-btn',
        `app-btn--${type}`,
        `app-btn--${size}`,
        block ? 'app-btn--block' : '',
        disabled ? 'app-btn--disabled' : '',
        className,
      ].filter(Boolean).join(' ')}
      hoverClass={disabled ? '' : 'app-btn--pressed'}
      hoverStayTime={70}
      onClick={disabled ? undefined : onClick}
    >
      {icon && <AppIcon name={icon} size={iconSize} className='app-btn__icon' />}
      <Text className='app-btn__text'>{children}</Text>
    </View>
  );
}
