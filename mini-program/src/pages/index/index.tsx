import { Component } from 'react';
import { View, Text, Image, Input, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useUserStore, usePointsStore } from '../../store';
import { productApi, pointsApi } from '../../services/api';
import { mockCategories, mockFlashSales, mockBanners } from '../../services/mockData';
import { navigateTo, formatPrice, PAGE_PATH, showToast, formatEtaText } from '../../utils';
import { MVP_COMMUNITY, MVP_FEATURES, MVP_ZONES } from '../../config/constants';
import ProductCard from '../../components/product-card/index';
import AppIcon from '../../components/app-icon';
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
  displayZoneId: string;
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
    countdownEndTime: Date.now() + (2 * 3600 + 35 * 60 + 18) * 1000,
    displayZoneId: MVP_ZONES[0].id,
  };

  componentDidMount() {
    this.loadData();
    this.startCountdown();
  }

  onShow() {
    const userStore = useUserStore.getState();
    const zoneId = userStore.userInfo?.zone?.id || this.state.displayZoneId || MVP_ZONES[0].id;
    this.setState({ displayZoneId: zoneId });
    this.loadData();
    if (MVP_FEATURES.POINTS) {
      pointsApi.getPointsInfo().then((info: any) => {
        usePointsStore.getState().setPointsInfo(info);
      }).catch(() => {});
    }
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

  loadData = async (keyword?: string) => {
    this.setState({ loading: true });
    try {
      const requests: Promise<any>[] = [
        productApi.getProducts({ page: 1, pageSize: 10 }),
        productApi.getCategories(),
      ];
      if (MVP_FEATURES.FLASH_SALE) {
        requests.push(productApi.getFlashSale());
      }
      const results = await Promise.all(requests);
      const products = results[0];
      const categories = results[1];
      const flashSales = MVP_FEATURES.FLASH_SALE ? (results[2] || []) : [];

      let filtered = products;
      if (keyword) {
        const kw = keyword.toLowerCase();
        filtered = products.filter((p: any) =>
          p.name?.toLowerCase().includes(kw) || p.tags?.some((t: string) => t.includes(keyword))
        );
      }
      this.setState({ products: filtered, categories, flashSales });
    } catch (err) {
      console.error('加载数据失败:', err);
      showToast('加载失败，请确认后端已启动');
    } finally {
      this.setState({ loading: false });
    }
  };

  // 搜索（MVP：首页商品列表内过滤）
  handleSearch = () => {
    const { searchKeyword } = this.state;
    if (!searchKeyword.trim()) return;
    showToast(`搜索「${searchKeyword.trim()}」`);
    this.loadData(searchKeyword.trim());
  };

  // 跳转商品详情
  goToDetail = (productId: string) => {
    navigateTo(PAGE_PATH.DETAIL, { id: productId });
  };

  // 跳转分类页
  goToCategory = (categoryId: number) => {
    navigateTo(PAGE_PATH.CATEGORY, { id: categoryId });
  };

  goToAllCategories = () => {
    navigateTo(PAGE_PATH.CATEGORY, { id: this.state.categories[0]?.id || 1 });
  };

  // 跳转秒杀 → 分类页精选
  goToFlashSale = () => {
    this.goToAllCategories();
  };

  // 通知中心
  handleNotification = () => {
    if (MVP_FEATURES.SECONDARY_MENU) {
      showToast('消息通知即将上线');
      return;
    }
    showToast('订单状态请在「订单」页查看');
  };

  goToProductList = () => {
    this.goToAllCategories();
  };

  handleBannerClick = (banner: any) => {
    if (banner.link) {
      Taro.navigateTo({ url: banner.link });
    } else {
      showToast(banner.title || '活动详情');
    }
  };

  handleBannerChange = (index: number) => {
    this.setState({ currentBanner: index });
  };

  handleLocationTap = () => {
    Taro.showActionSheet({
      itemList: MVP_ZONES.map((z) => z.name),
      success: (res) => {
        const zone = MVP_ZONES[res.tapIndex];
        this.setState({ displayZoneId: zone.id });
        const store = useUserStore.getState();
        store.setUserInfo({
          ...(store.userInfo || {}),
          zone: { id: zone.id, name: zone.name },
        });
        showToast(`已切换至${MVP_COMMUNITY.name}${zone.name}`);
      },
    });
  };

  // 分享配置
  onShareAppMessage() {
    const store = useUserStore.getState();
    const distributorCode = store.userInfo?.distributorCode || '';
    return {
      title: `邻选社区 - 前置仓2小时达，${MVP_COMMUNITY.name}专属`,
      path: `${PAGE_PATH.INDEX}?from=${distributorCode}`,
      imageUrl: ''
    };
  }

  render() {
    const { categories, flashSales, banners, products, searchKeyword, currentBanner, countdown, loading } = this.state;
    const pointsStore = usePointsStore.getState();
    const userStore = useUserStore.getState();
    const zone = MVP_ZONES.find((z) => z.id === this.state.displayZoneId)
      || userStore.userInfo?.zone
      || MVP_ZONES[0];
    const zoneName = zone.name;

    return (
      <View className='index-page'>
        {/* 优选社区品牌区 */}
        <View className='community-brand-bar'>
          <View className='brand-left'>
            <Text className='brand-title'>邻选·优选社区</Text>
            <Text className='brand-badge'>2小时达</Text>
          </View>
          <View className='icon-btn notify-btn' hoverClass='icon-btn--pressed' onClick={this.handleNotification}>
            <AppIcon name='bell' size={40} />
          </View>
        </View>

        {/* 顶部定位栏 */}
        <View className='header-bar'>
          <View className='location-info' hoverClass='icon-btn--pressed' onClick={this.handleLocationTap}>
            <AppIcon name='location' size={36} className='location-icon-img' />
            <Text className='location-name'>{MVP_COMMUNITY.name} · {zoneName}</Text>
            <Text className='location-arrow'>▾</Text>
          </View>
          <Text className='warehouse-tag'>{MVP_COMMUNITY.warehouseName}</Text>
        </View>

        <View className='eta-bar'>
          <View className='eta-left'>
            <AppIcon name='clock' size={32} />
            <Text className='eta-text'>预计 {formatEtaText(MVP_COMMUNITY.etaMinutes)}送达</Text>
          </View>
          <Text className='eta-badge'>营业中</Text>
        </View>

        {/* 搜索栏 */}
        <View className='search-wrap'>
          <View className='search-bar'>
            <View className='search-icon-wrap' hoverClass='icon-btn--pressed' onClick={this.handleSearch}>
              <AppIcon name='search' size={36} />
            </View>
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

          {/* 分类导航 · 8 类常见品类 */}
          <View className='category-section'>
            <View className='section-header compact'>
              <Text className='section-title'>全部分类</Text>
              <Text className='section-more' onClick={this.goToAllCategories}>更多 ›</Text>
            </View>
            <View className='category-grid'>
              {categories.slice(0, 8).map((cat) => (
                <View
                  key={cat.id}
                  className='category-item'
                  hoverClass='btn-pressed'
                  onClick={() => this.goToCategory(cat.id)}
                >
                  <View className='category-icon' style={{ background: cat.color }}>
                    <Text className='icon-text'>{cat.icon}</Text>
                  </View>
                  <Text className='category-name'>{cat.name}</Text>
                </View>
              ))}
            </View>
          </View>

          {MVP_FEATURES.POINTS && (
            <View className='points-entry' hoverClass='btn-pressed' onClick={() => navigateTo(PAGE_PATH.POINTS)}>
              <View className='points-left'>
                <AppIcon name='star-active' size={44} />
                <View className='points-info'>
                  <Text className='points-title'>积分商城</Text>
                  <Text className='points-desc'>消费1元=1积分 · 换保洁/做饭/免物业费</Text>
                </View>
              </View>
              <View className='points-right'>
                <Text className='points-value'>{pointsStore.totalPoints.toLocaleString()}</Text>
                <Text className='points-arrow'>›</Text>
              </View>
            </View>
          )}

          {/* 前置仓特色入口 */}
          <View className='warehouse-entry'>
            <View className='warehouse-header'>
              <Text className='warehouse-icon'>🏗️</Text>
              <View className='warehouse-title-wrap'>
                <Text className='warehouse-title'>{MVP_COMMUNITY.warehouseName}</Text>
                <Text className='warehouse-subtitle'>单仓直配东区·西区 · 下单即拣 · 2小时达</Text>
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

          {MVP_FEATURES.DISTRIBUTION && (
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
          )}

          {MVP_FEATURES.FLASH_SALE && flashSales.length > 0 && (
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
                <Text className='section-title'>优选推荐</Text>
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
