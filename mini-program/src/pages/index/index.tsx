import { Component } from 'react';
import { View, Text, Image, Input, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useUserStore, usePointsStore } from '../../store';
import { productApi } from '../../services/api';
import { mockCategories, mockFlashSales, mockBanners } from '../../services/mockData';
import { navigateTo, formatPrice, PAGE_PATH, showToast } from '../../utils';
import { POINTS_PER_YUAN } from '../../config/constants';
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
  countdown: { hours: string; minutes: string; seconds: string };
  countdownEndTime: number;
}

export default class IndexPage extends Component<{}, State> {
  countdownTimer: any = null;

  state: State = {
    categories: mockCategories,
    flashSales: mockFlashSales,
    banners: mockBanners,
    products: [],
    loading: false,
    searchKeyword: '',
    currentBanner: 0,
    countdown: { hours: '02', minutes: '35', seconds: '18' },
    countdownEndTime: Date.now() + (2 * 3600 + 35 * 60 + 18) * 1000
  };

  componentDidMount() {
    this.loadData();
    this.startCountdown();
  }

  onShow() {
    this.loadData();
  }

  componentWillUnmount() {
    if (this.countdownTimer) clearInterval(this.countdownTimer);
  }

  startCountdown = () => {
    this.countdownTimer = setInterval(() => {
      const now = Date.now();
      const remain = Math.max(0, this.state.countdownEndTime - now);
      const h = Math.floor(remain / 3600000);
      const m = Math.floor((remain % 3600000) / 60000);
      const s = Math.floor((remain % 60000) / 1000);
      this.setState({
        countdown: {
          hours: String(h).padStart(2, '0'),
          minutes: String(m).padStart(2, '0'),
          seconds: String(s).padStart(2, '0')
        }
      });
    }, 1000);
  };

  loadData = async () => {
    this.setState({ loading: true });
    try {
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
    const cat = mockCategories.find(c => c.id === categoryId);
    showToast(`正在加载「${cat?.name || '分类'}」商品`);
    setTimeout(() => {
      Taro.showToast({ title: '分类页面开发中', icon: 'none' });
    }, 800);
  };

  // 跳转秒杀
  goToFlashSale = () => {
    showToast('秒杀专区加载中...');
    setTimeout(() => {
      Taro.showToast({ title: '秒杀页面开发中', icon: 'none' });
    }, 800);
  };

  // 跳转商品列表
  goToProductList = () => {
    showToast('正在加载更多商品...');
  };

  // Banner 点击
  handleBannerClick = (banner: any) => {
    if (banner.link) {
      Taro.navigateTo({ url: banner.link });
    } else {
      showToast(banner.title || '活动详情');
    }
  };

  // Banner 切换
  handleBannerChange = (index: number) => {
    this.setState({ currentBanner: index });
  };

  // 定位切换
  handleLocationTap = () => {
    Taro.showActionSheet({
      itemList: ['阳光花园小区', '翠竹苑小区', '碧海蓝天小区', '金色家园小区'],
      success: (res) => {
        showToast(`已切换到小区`);
      }
    });
  };

  // 通知中心
  handleNotification = () => {
    showToast('消息通知');
    setTimeout(() => {
      Taro.showToast({ title: '通知页面开发中', icon: 'none' });
    }, 800);
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
    const { categories, flashSales, banners, products, searchKeyword, currentBanner, countdown, loading } = this.state;
    const pointsStore = usePointsStore.getState();

    return (
      <View className='index-page'>
        {/* 顶部定位栏 */}
        <View className='header-bar'>
          <View className='location-info' onClick={this.handleLocationTap}>
            <Text className='location-icon'>📍</Text>
            <Text className='location-name'>阳光花园小区</Text>
            <Text className='location-arrow'>▾</Text>
          </View>
          <View className='header-right'>
            <Text className='notify-icon' onClick={this.handleNotification}>🔔</Text>
          </View>
        </View>

        {/* 搜索栏 */}
        <View className='search-wrap'>
          <View className='search-bar'>
            <Text className='search-icon' onClick={this.handleSearch}>🔍</Text>
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
                  onClick={() => this.handleBannerClick(banner)}
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
                  onClick={() => this.handleBannerChange(index)}
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

          {/* 积分入口 */}
          <View className='points-entry' onClick={() => Taro.navigateTo({ url: '/pages/points/points' })}>
            <View className='points-left'>
              <Text className='points-icon'>⭐</Text>
              <View className='points-info'>
                <Text className='points-title'>我的积分</Text>
                <Text className='points-desc'>消费1元=1积分，永不过期</Text>
              </View>
            </View>
            <View className='points-right'>
              <Text className='points-value'>{pointsStore.totalPoints.toLocaleString()}</Text>
              <Text className='points-arrow'>›</Text>
            </View>
          </View>

          {/* 地下仓储特色入口 */}
          <View className='warehouse-entry'>
            <View className='warehouse-header'>
              <Text className='warehouse-icon'>🏗️</Text>
              <View className='warehouse-title-wrap'>
                <Text className='warehouse-title'>地下仓储直供</Text>
                <Text className='warehouse-subtitle'>1000+恒温仓库，新鲜直达</Text>
              </View>
            </View>
            <View className='warehouse-stats'>
              <View className='warehouse-stat-item'>
                <Text className='stat-icon'>❄️</Text>
                <Text className='stat-label'>冷链仓</Text>
                <Text className='stat-value'>128座</Text>
              </View>
              <View className='warehouse-stat-item'>
                <Text className='stat-icon'>🏭</Text>
                <Text className='stat-label'>常温仓</Text>
                <Text className='stat-value'>652座</Text>
              </View>
              <View className='warehouse-stat-item'>
                <Text className='stat-icon'>☀️</Text>
                <Text className='stat-label'>干燥仓</Text>
                <Text className='stat-value'>320座</Text>
              </View>
            </View>
            <View className='warehouse-tip'>
              <Text className='tip-icon'>💡</Text>
              <Text className='tip-text'>所有商品恒温恒湿储存，每件商品标注最佳赏味期，品质有保障</Text>
            </View>
          </View>

          {/* 楼长推荐 */}
          <View className='leader-recommend' onClick={() => navigateTo(PAGE_PATH.DISTRIBUTION)}>
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
                    <Text className='countdown-block'>{countdown.hours}</Text>
                    <Text className='countdown-sep'>:</Text>
                    <Text className='countdown-block'>{countdown.minutes}</Text>
                    <Text className='countdown-sep'>:</Text>
                    <Text className='countdown-block'>{countdown.seconds}</Text>
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
              <Text className='section-more' onClick={this.goToProductList}>查看更多 ›</Text>
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
