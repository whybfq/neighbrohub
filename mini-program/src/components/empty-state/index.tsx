import { Component } from 'react';
import { View, Text } from '@tarojs/components';
import AppIcon from '../app-icon';
import AppButton from '../app-button';
import { UiIconName } from '../../assets/icons/icons';
import './index.scss';

interface EmptyStateProps {
  icon?: string;
  iconName?: UiIconName;
  text?: string;
  subText?: string;
  actionText?: string;
  onAction?: () => void;
}

export default class EmptyState extends Component<EmptyStateProps> {
  render() {
    const {
      icon,
      iconName = 'empty',
      text = '暂无数据',
      subText,
      actionText,
      onAction,
    } = this.props;

    return (
      <View className='empty-state'>
        {iconName ? (
          <AppIcon name={iconName} size={120} className='empty-icon-img' />
        ) : (
          <Text className='empty-icon'>{icon || '📭'}</Text>
        )}
        <Text className='empty-text'>{text}</Text>
        {subText && <Text className='empty-sub'>{subText}</Text>}
        {actionText && onAction && (
          <AppButton type='primary' size='md' onClick={onAction}>
            {actionText}
          </AppButton>
        )}
      </View>
    );
  }
}
