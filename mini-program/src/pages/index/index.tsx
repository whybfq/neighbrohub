import { Component } from 'react';
import { View, Text, Image, Input, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useUserStore } from '../../store';
import { productApi } from '../../services/api';
import { mockCategories, mockFlashSales, mockBanners } from '../../services/mockData';
import { navigateTo, formatPrice, PAGE_PATH } from '../../utils';
import ProductCard from '../../components/product-card/index';
import './index.scss';

interface State {
  categories: any[];
  flashSales: any[];
  banners: any[];
  products: any[];
  loading: boolean;
  searchKeyword: string;
  currentBanner: number;
}

export default class IndexPage extends Component<{}, State> {
  state: State = {
    categories: mockCategories,
    flashSales: mockFlashSales,
    banners: mockBanners,
    products: [],
    loading: false,
    searchKeyword: '',
    currentBanner: 0
  };

  componentDidMount() {
    this.loadData();
  }

  onShow() {
    // 每次显示页面时刷新数据
    this.loadData();
  }

  loadData = async () => {
    this.setState({ loading: true });
    try {
      // 实际项目中调用API
      const products = await productApi.getProducts({ page: 1, pageSize: 10 });
      this.setState({ products });
    } catch (err) {
      console.error('加载数据失败:', err);
    } finally {
      this.setState({ loading: false });
    }
  };

  // 搜索
  handleSearch = () => {
    const { searchKeyword } = this.state;
    if (searchKeyword.trim()) {
      // 跳转到搜索结果页
      Taro.navigateTo({
        url: `/pages/search/index?keyword=${encodeURIComponent(searchKeyword.trim())}`
      });
    }
  };

  // 跳转商品详情
  goToDetail = (productId: string) => {
    navigateTo(PAGE_PATH.DETAIL, { id: productId });
  };

  // 跳转分类
  goToCategory = (categoryId: number) => {
    // navigateTo('/pages/category/index', { id: String(categoryId) });
    Taro.showToast({ title: '分类页面开发中', icon: 'none' });
  };

  // 跳转秒杀
  goToFlashSale = () => {
    Taro.showToast({ title: '秒杀页面开发中', icon: 'none' });
  };

  // Banner 切换
  onBannerChange = (e: any) => {
    this.setState({ currentBanner: e.detail.current });
  };

  // 分享配置
  onShareAppMessage() {
    const store = useUserStore.getState();
    const distributorCode = store.userInfo?.distributorCode || '';
    return {
      title: '邻选社区 - 小区好物，团长直供',
      path: `${PAGE_PATH.INDEX}?from=${distributorCode}`,
      imageUrl: ''
    };
  }

  render() {
    const { categories, flashSales, banners, products, searchKeyword, currentBanner, loading } = this.state;

    return (
      <View className='index-page'>
        {/* 顶部定位栏 */}
        <View className='header-bar'>
          <View className='location-info'>
            <Text className='location-icon'>📍</Text>
            <Text className='location-name'>阳光花园小区</Text>
            <Text className='location-arrow'>▾</Text>
          </View>
          <View className='header-right'>
            <Text className='notify-icon'>🔔</Text>
          </View>
        </View>

        {/* 搜索栏 */}
        <View className='search-wrap'>
          <View className='search-bar'>
            <Text className='search-icon'>🔍</Text>
            <Input
              className='search-input'
              type='text'
              placeholder='搜索小区好物...'
              value={searchKeyword}
              onInput={(e: any) => this.setState({ searchKeyword: e.detail.value })}
              onConfirm={this.handleSearch}
            />
          </View>
        </View>

        <ScrollView className='page-content' scrollY>
          {/* Banner轮播 */}
          <View className='banner-wrap'>
            <View className='banner-swiper'>
              {banners.map((banner, index) => (
                <View
                  key={banner.id}
                  className={`banner-item ${currentBanner === index ? 'active' : ''}`}
                  style={{ background: banner.bgColor }}
                >
                  <View className='banner-content'>
                    <Text className='banner-icon'>{banner.icon}</Text>
                    <Text className='banner-title'>{banner.title}</Text>
                  </View>
                  <View className='banner-decoration' />
                </View>
              ))}
            </View>
            <View className='banner-dots'>
              {banners.map((_, index) => (
                <View
                  key={index}
                  className={`dot ${currentBanner === index ? 'active' : ''}`}
                  onClick={() => this.setState({ currentBanner: index })}
                />
              ))}
            </View>
          </View>

          {/* 分类导航 */}
          <View className='category-section'>
            <ScrollView className='category-scroll' scrollX>
              <View className='category-list'>
                {categories.map(cat => (
                  <View
                    key={cat.id}
                    className='category-item'
                    onClick={() => this.goToCategory(cat.id)}
                  >
                    <View className='category-icon' style={{ background: cat.color }}>
                      <Text className='icon-text'>{cat.icon}</Text>
                    </View>
                    <Text className='category-name'>{cat.name}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* 楼长推荐 */}
          <View className='leader-recommend'>
            <View className='recommend-header'>
              <Text className='recommend-icon'>🏅</Text>
              <Text className='recommend-title'>本楼楼长推荐</Text>
              <Text className='recommend-tag'>3栋-李明</Text>
            </View>
            <View className='recommend-tip'>
              <Text className='tip-text'>💡 通过楼长分享链接下单，享额外优惠和佣金奖励</Text>
            </View>
          </View>

          {/* 限时秒杀 */}
          {flashSales.length > 0 && (
            <View className='flash-sale-section'>
              <View className='section-header'>
                <View className='section-title-wrap'>
                  <Text className='section-icon'>⚡</Text>
                  <Text className='section-title'>限时秒杀</Text>
                  <View className='countdown'>
                    <Text className='countdown-block'>02</Text>
                    <Text className='countdown-sep'>:</Text>
                    <Text className='countdown-block'>35</Text>
                    <Text className='countdown-sep'>:</Text>
                    <Text className='countdown-block'>18</Text>
                  </View>
                </View>
                <Text className='section-more' onClick={this.goToFlashSale}>
                  更多 ›
                </Text>
              </View>
              <ScrollView className='flash-scroll' scrollX>
                <View className='flash-list'>
                  {flashSales.map(item => (
                    <View
                      key={item.productId}
                      className='flash-item'
                      onClick={() => this.goToDetail(item.productId)}
                    >
                      <View className='flash-img'>
                        <Text className='flash-img-icon'>{item.icon}</Text>
                      </View>
                      <Text className='flash-name'>{item.name}</Text>
                      <View className='flash-price-row'>
                        <Text className='flash-price'>¥{formatPrice(item.flashPrice)}</Text>
                        <Text className='flash-original'>¥{formatPrice(item.originalPrice)}</Text>
                      </View>
                      <View className='flash-progress'>
                        <View
                          className='progress-bar'
                          style={{ width: `${(item.sold / (item.sold + item.stock)) * 100}%` }}
                        />
                      </View>
                      <Text className='flash-sold'>已抢{item.sold}件</Text>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
          )}

          {/* 社区推荐商品 */}
          <View className='products-section'>
            <View className='section-header'>
              <View className='section-title-wrap'>
                <View className='title-bar' />
                <Text className='section-title'>社区推荐</Text>
              </View>
              <Text className='section-more'>查看更多 ›</Text>
            </View>

            <View className='product-grid'>
              {products.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => this.goToDetail(product.id)}
                />
              ))}
            </View>

            {loading && (
              <View className='loading-more'>
                <Text>加载中...</Text>
              </View>
            )}
          </View>

          {/* 底部安全区域 */}
          <View className='safe-bottom' />
        </ScrollView>
      </View>
    );
  }
}
