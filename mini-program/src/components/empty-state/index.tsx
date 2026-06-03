import { Component } from 'react';
import { View, Text } from '@tarojs/components';
import './index.scss';

interface EmptyStateProps {
  icon?: string;
  text?: string;
  subText?: string;
  actionText?: string;
  onAction?: () => void;
}

export default class EmptyState extends Component<EmptyStateProps> {
  render() {
    const { icon = '📭', text = '暂无数据', subText, actionText, onAction } = this.props;

    return (
      <View className='empty-state'>
        <Text className='empty-icon'>{icon}</Text>
        <Text className='empty-text'>{text}</Text>
        {subText && <Text className='empty-sub'>{subText}</Text>}
        {actionText && onAction && (
          <View className='empty-action' onClick={onAction}>
            <Text>{actionText}</Text>
          </View>
        )}
      </View>
    );
  }
}
