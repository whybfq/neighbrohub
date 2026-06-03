import { Component } from 'react';
import { View, Text, Image, ScrollView, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useUserStore, useCartStore } from '../../store';
import { productApi, cartApi } from '../../services/api';
import { mockProducts } from '../../services/mockData';
import { formatPrice, showToast, navigateTo, PAGE_PATH } from '../../utils';
import { COMMISSION_RATE, DELIVERY_TYPE } from '../../config/constants';
import './index.scss';

interface State {
  product: any;
  selectedSku: any;
  quantity: number;
  showSkuPanel: boolean;
  actionType: 'cart' | 'buy';
  currentImageIndex: number;
  loading: boolean;
}

export default class DetailPage extends Component<{}, State> {
  state: State = {
    product: null,
    selectedSku: null,
    quantity: 1,
    showSkuPanel: false,
    actionType: 'cart',
    currentImageIndex: 0,
    loading: true
  };

  componentDidMount() {
    this.loadProduct();
  }

  loadProduct = async () => {
    // 获取路由参数中的商品ID
    const params = Taro.getCurrentInstance().router?.params;
    const productId = params?.id || 'P001';

    try {
      const product = await productApi.getProductDetail(productId);
      this.setState({
        product,
        selectedSku: product.skus?.[0] || null,
        loading: false
      });
    } catch (err) {
      // 使用模拟数据
      const product = mockProducts.find(p => p.id === productId) || mockProducts[0];
      this.setState({
        product,
        selectedSku: product.skus?.[0] || null,
        loading: false
      });
    }
  };

  // 选择规格
  handleSelectSku = (sku: any) => {
    this.setState({ selectedSku: sku });
  };

  // 数量加减
  handleQuantityChange = (type: 'add' | 'sub') => {
    const { quantity, selectedSku } = this.state;
    const maxStock = selectedSku?.stock || 99;
    if (type === 'add' && quantity < maxStock) {
      this.setState({ quantity: quantity + 1 });
    } else if (type === 'sub' && quantity > 1) {
      this.setState({ quantity: quantity - 1 });
    }
  };

  // 加入购物车
  handleAddToCart = () => {
    this.setState({ showSkuPanel: true, actionType: 'cart' });
  };

  // 立即购买
  handleBuyNow = () => {
    this.setState({ showSkuPanel: true, actionType: 'buy' });
  };

  // 确认操作
  handleConfirm = async () => {
    const { product, selectedSku, quantity, actionType } = this.state;

    if (!selectedSku) {
      showToast('请选择规格');
      return;
    }

    if (actionType === 'cart') {
      // 加入购物车
      const cartStore = useCartStore.getState();
      cartStore.addItem({
        id: `CART_${Date.now()}`,
        productId: product.id,
        skuId: selectedSku.id,
        productName: product.name,
        productIcon: product.coverImage,
        skuName: selectedSku.name,
        price: selectedSku.price,
        quantity,
        stock: selectedSku.stock,
        checked: true
      });
      showToast('已加入购物车', 'success');
    } else {
      // 立即购买 - 跳转到订单确认页
      const orderItems = [{
        productId: product.id,
        skuId: selectedSku.id,
        quantity,
        productName: product.name,
        productIcon: product.coverImage,
        skuName: selectedSku.name,
        price: selectedSku.price
      }];

      // 存储临时订单数据
      Taro.setStorageSync('temp_order', {
        items: orderItems,
        fromDetail: true
      });

      setTimeout(() => {
        navigateTo(PAGE_PATH.ORDER);
      }, 500);
    }

    this.setState({ showSkuPanel: false });
  };

  // 预览图片
  handlePreviewImage = (index: number) => {
    this.setState({ currentImageIndex: index });
  };

  // 分享
  onShareAppMessage() {
    const { product } = this.state;
    const store = useUserStore.getState();
    const distributorCode = store.userInfo?.distributorCode || '';
    return {
      title: `【邻选社区】${product?.name || '好物推荐'} - ¥${formatPrice(product?.price || 0)}`,
      path: `${PAGE_PATH.DETAIL}?id=${product?.id}&from=${distributorCode}`,
      imageUrl: ''
    };
  }

  render() {
    const { product, selectedSku, quantity, showSkuPanel, currentImageIndex, loading } = this.state;

    if (loading || !product) {
      return (
        <View className='detail-page'>
          <View className='loading-wrap'>
            <Text>加载中...</Text>
          </View>
        </View>
      );
    }

    const currentPrice = selectedSku?.price || product.price;
    const totalPrice = currentPrice * quantity;
    const commission = {
      buildingLeader: totalPrice * COMMISSION_RATE.BUILDING_LEADER,
      communityLeader: totalPrice * COMMISSION_RATE.COMMUNITY_LEADER
    };

    return (
      <View className='detail-page'>
        {/* 商品图片轮播 */}
        <View className='image-swiper'>
          <View className='image-list'>
            {product.images?.map((img: string, index: number) => (
              <View
                key={index}
                className={`image-item ${currentImageIndex === index ? 'active' : ''}`}
                onClick={() => this.handlePreviewImage(index)}
              >
                <Text className='image-text'>{img}</Text>
              </View>
            ))}
          </View>
          <View className='image-dots'>
            {product.images?.map((_: any, index: number) => (
              <View
                key={index}
                className={`dot ${currentImageIndex === index ? 'active' : ''}`}
              />
            ))}
          </View>
          {/* 返回按钮 */}
          <View className='back-btn' onClick={() => Taro.navigateBack()}>
            <Text>‹</Text>
          </View>
        </View>

        <ScrollView className='detail-content' scrollY>
          {/* 价格信息 */}
          <View className='price-section'>
            <Text className='product-name'>{product.name}</Text>
            <View className='price-row'>
              <View className='current-price'>
                <Text className='symbol'>¥</Text>
                <Text className='value'>{formatPrice(currentPrice)}</Text>
              </View>
              {product.marketPrice > currentPrice && (
                <View className='market-info'>
                  <Text className='market-price'>¥{formatPrice(product.marketPrice)}</Text>
                  <Text className='discount-tag'>
                    {Math.round((1 - currentPrice / product.marketPrice) * 100)}折
                  </Text>
                </View>
              )}
            </View>
            <View className='sales-info'>
              <Text>已售 {product.sales} | 评分 ⭐{product.rating}</Text>
            </View>
          </View>

          {/* 配送与楼长信息 */}
          <View className='delivery-section'>
            <View className='delivery-row'>
              <Text className='label'>配送方式</Text>
              <Text className='value'>🏪 团长自提点 / 🚀 送货上门</Text>
            </View>
            <View className='delivery-row'>
              <Text className='label'>楼长</Text>
              <View className='value-wrap'>
                <Text className='value'>👤 李明 (3栋2单元)</Text>
                <Text className='commission-tip'>
                  通过楼长下单，楼长得¥{formatPrice(commission.buildingLeader)}
                </Text>
              </View>
            </View>
            <View className='delivery-row'>
              <Text className='label'>团长</Text>
              <Text className='value'>👤 王阿姨 (阳光花园) ›</Text>
            </View>
          </View>

          {/* 规格选择 */}
          <View className='sku-section'>
            <View className='section-title'>选择规格</View>
            <View className='sku-list'>
              {product.skus?.map((sku: any) => (
                <View
                  key={sku.id}
                  className={`sku-item ${selectedSku?.id === sku.id ? 'active' : ''} ${sku.stock <= 0 ? 'disabled' : ''}`}
                  onClick={() => sku.stock > 0 && this.handleSelectSku(sku)}
                >
                  <Text>{sku.name}</Text>
                  <Text className='sku-price'>¥{formatPrice(sku.price)}</Text>
                  {sku.stock <= 0 && <Text className='sold-out'>售罄</Text>}
                </View>
              ))}
            </View>
          </View>

          {/* 数量选择 */}
          <View className='quantity-section'>
            <Text className='section-title'>购买数量</Text>
            <View className='qty-control'>
              <View className='qty-btn' onClick={() => this.handleQuantityChange('sub')}>
                <Text>−</Text>
              </View>
              <Text className='qty-num'>{quantity}</Text>
              <View className='qty-btn' onClick={() => this.handleQuantityChange('add')}>
                <Text>+</Text>
              </View>
            </View>
            <Text className='stock-info'>库存 {selectedSku?.stock || 0} 件</Text>
          </View>

          {/* 佣金展示 */}
          <View className='commission-section'>
            <View className='commission-header'>
              <Text className='commission-icon'>💰</Text>
              <Text className='commission-title'>楼长分销收益预览</Text>
            </View>
            <View className='commission-detail'>
              <View className='commission-item'>
                <Text className='role'>楼长佣金 (5%)</Text>
                <Text className='amount'>¥{formatPrice(commission.buildingLeader)}</Text>
              </View>
              <View className='commission-item'>
                <Text className='role'>团长佣金 (3%)</Text>
                <Text className='amount'>¥{formatPrice(commission.communityLeader)}</Text>
              </View>
            </View>
            <Text className='commission-tip-text'>
              💡 成为楼长即可享受分销佣金，分享商品给邻居赚取收益
            </Text>
          </View>

          {/* 商品详情 */}
          <View className='desc-section'>
            <View className='section-title'>商品详情</View>
            <Text className='desc-text'>{product.description}</Text>
            <View className='desc-placeholder'>
              <Text className='placeholder-icon'>📦</Text>
              <Text className='placeholder-text'>详细图文介绍（实际项目展示富文本）</Text>
            </View>
          </View>

          {/* 邻里评价 */}
          <View className='reviews-section'>
            <View className='section-title-wrap'>
              <Text className='section-title'>💬 邻里评价</Text>
              <Text className='review-count'>({product.reviews || 0}条)</Text>
            </View>
            <View className='review-card'>
              <View className='review-header'>
                <Text className='reviewer-avatar'>👩</Text>
                <View className='reviewer-info'>
                  <Text className='reviewer-name'>3栋-李女士</Text>
                  <Text className='review-stars'>★★★★★</Text>
                </View>
                <Text className='review-time'>2天前</Text>
              </View>
              <Text className='review-content'>
                菜很新鲜，王阿姨推荐的果然不错！楼长李明送货也很快~
              </Text>
            </View>
            <View className='review-card'>
              <View className='review-header'>
                <Text className='reviewer-avatar'>👨</Text>
                <View className='reviewer-info'>
                  <Text className='reviewer-name'>5栋-张先生</Text>
                  <Text className='review-stars'>★★★★★</Text>
                </View>
                <Text className='review-time'>3天前</Text>
              </View>
              <Text className='review-content'>
                送货上门很快，半小时就到了。通过楼长链接下单还便宜了~
              </Text>
            </View>
          </View>

          <View className='safe-bottom' />
        </ScrollView>

        {/* 底部操作栏 */}
        <View className='bottom-bar'>
          <View className='action-icons'>
            <View className='action-item' onClick={() => showToast('已收藏', 'success')}>
              <Text className='action-icon'>⭐</Text>
              <Text className='action-text'>收藏</Text>
            </View>
            <View className='action-item' onClick={() => Taro.switchTab({ url: PAGE_PATH.CART })}>
              <Text className='action-icon'>🛒</Text>
              <Text className='action-text'>购物车</Text>
            </View>
          </View>
          <View className='action-buttons'>
            <View className='btn-cart' onClick={this.handleAddToCart}>
              <Text>加入购物车</Text>
            </View>
            <View className='btn-buy' onClick={this.handleBuyNow}>
              <Text>立即购买</Text>
            </View>
          </View>
        </View>

        {/* SKU选择面板 */}
        {showSkuPanel && (
          <View className='sku-panel-mask' onClick={() => this.setState({ showSkuPanel: false })}>
            <View className='sku-panel' onClick={(e: any) => e.stopPropagation()}>
              <View className='panel-header'>
                <View className='panel-product'>
                  <View className='panel-img'>
                    <Text>{product.coverImage}</Text>
                  </View>
                  <View className='panel-info'>
                    <Text className='panel-price'>¥{formatPrice(currentPrice)}</Text>
                    <Text className='panel-stock'>库存 {selectedSku?.stock || 0} 件</Text>
                    <Text className='panel-selected'>
                      已选: {selectedSku?.name || '请选择'} × {quantity}
                    </Text>
                  </View>
                </View>
                <View className='panel-close' onClick={() => this.setState({ showSkuPanel: false })}>
                  <Text>✕</Text>
                </View>
              </View>

              <View className='panel-body'>
                <Text className='panel-label'>规格</Text>
                <View className='panel-sku-list'>
                  {product.skus?.map((sku: any) => (
                    <View
                      key={sku.id}
                      className={`panel-sku-item ${selectedSku?.id === sku.id ? 'active' : ''} ${sku.stock <= 0 ? 'disabled' : ''}`}
                      onClick={() => sku.stock > 0 && this.handleSelectSku(sku)}
                    >
                      <Text>{sku.name}</Text>
                    </View>
                  ))}
                </View>

                <View className='panel-qty-row'>
                  <Text className='panel-label'>数量</Text>
                  <View className='qty-control'>
                    <View className='qty-btn' onClick={() => this.handleQuantityChange('sub')}>
                      <Text>−</Text>
                    </View>
                    <Text className='qty-num'>{quantity}</Text>
                    <View className='qty-btn' onClick={() => this.handleQuantityChange('add')}>
                      <Text>+</Text>
                    </View>
                  </View>
                </View>
              </View>

              <View className='panel-footer'>
                <View className='panel-confirm-btn' onClick={this.handleConfirm}>
                  <Text>
                    {this.state.actionType === 'cart'
                      ? `加入购物车 ¥${formatPrice(totalPrice)}`
                      : `立即购买 ¥${formatPrice(totalPrice)}`
                    }
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </View>
    );
  }
}
