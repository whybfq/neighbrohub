import { Component } from 'react';
import { View, Text, Image } from '@tarojs/components';
import { formatPrice } from '../../utils';
import './index.scss';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    coverImage: string;
    price: number;
    marketPrice?: number;
    sales?: number;
    tags?: string[];
    isFlashSale?: boolean;
    flashPrice?: number;
    rating?: number;
  };
  onClick?: () => void;
}

export default class ProductCard extends Component<ProductCardProps> {
  render() {
    const { product, onClick } = this.props;
    const { name, coverImage, price, marketPrice, sales, tags, isFlashSale, flashPrice, rating } = product;

    return (
      <View className='product-card' onClick={onClick}>
        {/* 商品图片 */}
        <View className='card-image'>
          <Text className='image-placeholder'>{coverImage}</Text>
          {isFlashSale && (
            <View className='flash-badge'>
              <Text>秒杀</Text>
            </View>
          )}
          {tags && tags.length > 0 && (
            <View className='tag-list'>
              {tags.slice(0, 2).map((tag, index) => (
                <View key={index} className='tag-item'>
                  <Text>{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* 商品信息 */}
        <View className='card-info'>
          <Text className='card-name'>{name}</Text>

          {/* 评分 */}
          {rating && (
            <View className='card-rating'>
              <Text className='star'>⭐</Text>
              <Text className='rating-num'>{rating}</Text>
            </View>
          )}

          {/* 价格 */}
          <View className='card-price-row'>
            <View className='price-wrap'>
              <Text className='price-symbol'>¥</Text>
              <Text className='price-value'>
                {isFlashSale && flashPrice ? formatPrice(flashPrice) : formatPrice(price)}
              </Text>
              {marketPrice && marketPrice > price && (
                <Text className='market-price'>¥{formatPrice(marketPrice)}</Text>
              )}
            </View>
            {sales !== undefined && (
              <Text className='sales-count'>已售{sales}</Text>
            )}
          </View>
        </View>
      </View>
    );
  }
}
