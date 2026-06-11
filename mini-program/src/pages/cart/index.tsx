/**
 * 购物车（TabBar）
 * MVP：数据主要在 useCartStore 本地；结算时写入 temp_order 跳转 order 页
 */
import { Component } from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useCartStore } from '../../store';
import { formatPrice, navigateTo, showToast, PAGE_PATH } from '../../utils';
import { BUSINESS_RULES } from '../../config/constants';
import EmptyState from '../../components/empty-state/index';
import AppIcon from '../../components/app-icon';
import './index.scss';

interface State {
  editMode: boolean;
  deletingId: string | null;
}

export default class CartPage extends Component<{}, State> {
  state: State = {
    editMode: false,
    deletingId: null
  };

  componentDidMount() {
    // 实际项目加载购物车数据
  }

  // 切换管理模式
  handleToggleEditMode = () => {
    this.setState({ editMode: !this.state.editMode });
    showToast(this.state.editMode ? '退出管理' : '进入管理模式');
  };

  // 切换选中
  handleToggleCheck = (id: string) => {
    const cartStore = useCartStore.getState();
    cartStore.toggleCheck(id);
  };

  // 全选
  handleCheckAll = () => {
    const cartStore = useCartStore.getState();
    const allChecked = cartStore.items.every(item => item.checked);
    cartStore.checkAll(!allChecked);
  };

  // 数量变化
  handleQuantityChange = (id: string, type: 'add' | 'sub') => {
    const cartStore = useCartStore.getState();
    const item = cartStore.items.find(i => i.id === id);
    if (item) {
      const newQty = type === 'add' ? item.quantity + 1 : item.quantity - 1;
      if (newQty > 0) {
        cartStore.updateQuantity(id, newQty);
      }
    }
  };

  // 删除商品（带动画）
  handleDelete = (id: string) => {
    this.setState({ deletingId: id });
    Taro.showModal({
      title: '提示',
      content: '确定要删除该商品吗？',
      success: (res) => {
        if (res.confirm) {
          setTimeout(() => {
            const cartStore = useCartStore.getState();
            cartStore.removeItem(id);
            this.setState({ deletingId: null });
            showToast('已删除');
          }, 200);
        } else {
          this.setState({ deletingId: null });
        }
      }
    });
  };

  // 批量删除
  handleBatchDelete = () => {
    const cartStore = useCartStore.getState();
    const checkedIds = cartStore.items.filter(i => i.checked).map(i => i.id);
    if (checkedIds.length === 0) {
      showToast('请选择商品');
      return;
    }
    Taro.showModal({
      title: '批量删除',
      content: `确定要删除选中的 ${checkedIds.length} 件商品吗？`,
      success: (res) => {
        if (res.confirm) {
          checkedIds.forEach(id => cartStore.removeItem(id));
          showToast('已批量删除', 'success');
        }
      }
    });
  };

  // 去结算
  handleCheckout = () => {
    const cartStore = useCartStore.getState();
    const checkedItems = cartStore.getCheckedItems();

    if (checkedItems.length === 0) {
      showToast('请选择商品');
      return;
    }

    const totalAmount = checkedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    if (totalAmount < BUSINESS_RULES.minOrderAmount) {
      showToast(`未满起送价 ¥${BUSINESS_RULES.minOrderAmount}，请继续选购`);
      return;
    }

    // 存储结算商品到临时订单
    Taro.setStorageSync('temp_order', {
      items: checkedItems.map(item => ({
        productId: item.productId,
        skuId: item.skuId,
        quantity: item.quantity,
        productName: item.productName,
        productIcon: item.productIcon,
        skuName: item.skuName,
        price: item.price
      })),
      fromCart: true
    });

    navigateTo(PAGE_PATH.ORDER);
  };

  render() {
    const cartStore = useCartStore.getState();
    const { items } = cartStore;
    const { editMode, deletingId } = this.state;
    const allChecked = items.length > 0 && items.every(item => item.checked);
    const totalAmount = items.filter(i => i.checked).reduce((sum, i) => sum + i.price * i.quantity, 0);
    const checkedCount = items.filter(i => i.checked).reduce((sum, i) => sum + i.quantity, 0);

    return (
      <View className='cart-page'>
        {/* 头部 */}
        <View className='cart-header'>
          <Text className='cart-title'>购物车</Text>
          <Text
            className={`cart-manage ${editMode ? 'active' : ''}`}
            onClick={this.handleToggleEditMode}
          >
            {editMode ? '完成' : '管理'}
          </Text>
        </View>

        {items.length === 0 ? (
          <EmptyState
            iconName='cart'
            text='购物车还是空的'
            subText='去逛逛社区好物吧'
            actionText='去首页'
            onAction={() => Taro.switchTab({ url: PAGE_PATH.INDEX })}
          />
        ) : (
          <View className='cart-body'>
            {/* 购物车列表 */}
            <View className='cart-list'>
              {items.map(item => (
                <View
                  key={item.id}
                  className={`cart-item ${deletingId === item.id ? 'deleting' : ''}`}
                >
                  {/* 选择框 */}
                  <View
                    className={`cart-check ${item.checked ? 'checked' : ''}`}
                    onClick={() => this.handleToggleCheck(item.id)}
                  >
                    {item.checked && <Text className='check-icon'>✓</Text>}
                  </View>

                  {/* 商品图 */}
                  <View className='cart-item-img' onClick={() => navigateTo(PAGE_PATH.DETAIL, { id: item.productId })}>
                    <Text className='img-placeholder'>{item.productIcon}</Text>
                  </View>

                  {/* 商品信息 */}
                  <View className='cart-item-info' onClick={() => navigateTo(PAGE_PATH.DETAIL, { id: item.productId })}>
                    <Text className='item-name'>{item.productName}</Text>
                    <Text className='item-sku'>规格：{item.skuName}</Text>
                    <View className='item-bottom'>
                      <Text className='item-price'>¥{formatPrice(item.price)}</Text>
                      <View className='qty-control'>
                        <View
                          className='qty-btn'
                          onClick={(e: any) => { e.stopPropagation(); this.handleQuantityChange(item.id, 'sub'); }}
                        >
                          <Text>−</Text>
                        </View>
                        <Text className='qty-num'>{item.quantity}</Text>
                        <View
                          className='qty-btn'
                          onClick={(e: any) => { e.stopPropagation(); this.handleQuantityChange(item.id, 'add'); }}
                        >
                          <Text>+</Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* 删除按钮 */}
                  <View className='delete-btn' hoverClass='icon-btn--pressed' onClick={() => this.handleDelete(item.id)}>
                    <AppIcon name='trash' size={36} />
                  </View>
                </View>
              ))}
            </View>

            {/* 底部结算栏 */}
            <View className='cart-footer'>
              <View className='footer-left' onClick={this.handleCheckAll}>
                <View className={`footer-check ${allChecked ? 'checked' : ''}`}>
                  {allChecked && <Text className='check-icon'>✓</Text>}
                </View>
                <Text className='check-all-text'>全选</Text>
              </View>
              <View className='footer-right'>
                {editMode ? (
                  <View className='batch-delete-btn' onClick={this.handleBatchDelete}>
                    <Text>删除选中</Text>
                  </View>
                ) : (
                  <>
                    <View className='total-info'>
                      <Text className='total-label'>合计：</Text>
                      <Text className='total-price'>¥{formatPrice(totalAmount)}</Text>
                    </View>
                    <View
                      className={`checkout-btn ${checkedCount === 0 ? 'disabled' : ''}`}
                      hoverClass={checkedCount === 0 ? '' : 'btn-pressed'}
                      onClick={this.handleCheckout}
                    >
                      <Text>结算({checkedCount})</Text>
                    </View>
                  </>
                )}
              </View>
            </View>
          </View>
        )}
      </View>
    );
  }
}
