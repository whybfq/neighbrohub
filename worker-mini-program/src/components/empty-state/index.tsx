import { View, Text } from '@tarojs/components';
import AppIcon from '../app-icon';
import { UiIconName } from '../../assets/icons/icons';
import './index.scss';

interface EmptyStateProps {
  iconName?: UiIconName;
  text?: string;
  subText?: string;
}

export default function EmptyState({
  iconName = 'empty',
  text = '暂无数据',
  subText,
}: EmptyStateProps) {
  return (
    <View className='empty-state'>
      <AppIcon name={iconName} size={120} className='empty-icon' />
      <Text className='empty-text'>{text}</Text>
      {subText && <Text className='empty-sub'>{subText}</Text>}
    </View>
  );
}
