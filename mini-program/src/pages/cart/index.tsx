import { Component } from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useCartStore } from '../../store';
import { formatPrice, navigateTo, showToast, PAGE_PATH } from '../../utils';
import EmptyState from '../../components/empty-state/index';
import './index.scss';

export default class CartPage extends Component {
  componentDidMount() {
    // 实际项目加载购物车数据
  }

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

  // 删除商品
  handleDelete = (id: string) => {
    Taro.showModal({
      title: '提示',
      content: '确定要删除该商品吗？',
      success: (res) => {
        if (res.confirm) {
          const cartStore = useCartStore.getState();
          cartStore.removeItem(id);
          showToast('已删除');
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
    const allChecked = items.length > 0 && items.every(item => item.checked);
    const totalAmount = items.filter(i => i.checked).reduce((sum, i) => sum + i.price * i.quantity, 0);
    const checkedCount = items.filter(i => i.checked).reduce((sum, i) => sum + i.quantity, 0);

    return (
      <View className='cart-page'>
        {/* 头部 */}
        <View className='cart-header'>
          <Text className='cart-title'>购物车</Text>
          <Text className='cart-manage'>管理</Text>
        </View>

        {items.length === 0 ? (
          <EmptyState
            icon='🛒'
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
                <View key={item.id} className='cart-item'>
                  {/* 选择框 */}
                  <View
                    className={`cart-check ${item.checked ? 'checked' : ''}`}
                    onClick={() => this.handleToggleCheck(item.id)}
                  >
                    {item.checked && <Text className='check-icon'>✓</Text>}
                  </View>

                  {/* 商品图 */}
                  <View className='cart-item-img'>
                    <Text className='img-placeholder'>{item.productIcon}</Text>
                  </View>

                  {/* 商品信息 */}
                  <View className='cart-item-info'>
                    <Text className='item-name'>{item.productName}</Text>
                    <Text className='item-sku'>规格：{item.skuName}</Text>
                    <View className='item-bottom'>
                      <Text className='item-price'>¥{formatPrice(item.price)}</Text>
                      <View className='qty-control'>
                        <View
                          className='qty-btn'
                          onClick={() => this.handleQuantityChange(item.id, 'sub')}
                        >
                          <Text>−</Text>
                        </View>
                        <Text className='qty-num'>{item.quantity}</Text>
                        <View
                          className='qty-btn'
                          onClick={() => this.handleQuantityChange(item.id, 'add')}
                        >
                          <Text>+</Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* 删除按钮 */}
                  <View className='delete-btn' onClick={() => this.handleDelete(item.id)}>
                    <Text>🗑️</Text>
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
                <View className='total-info'>
                  <Text className='total-label'>合计：</Text>
                  <Text className='total-price'>¥{formatPrice(totalAmount)}</Text>
                </View>
                <View className='checkout-btn' onClick={this.handleCheckout}>
                  <Text>结算({checkedCount})</Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </View>
    );
  }
}
