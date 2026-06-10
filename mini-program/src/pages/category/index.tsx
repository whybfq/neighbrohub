import { Component } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro, { getCurrentInstance } from '@tarojs/taro';
import { productApi } from '../../services/api';
import { mockCategories } from '../../services/mockData';
import { navigateTo, PAGE_PATH } from '../../utils';
import ProductCard from '../../components/product-card/index';
import EmptyState from '../../components/empty-state/index';
import './index.scss';

interface State {
  categories: any[];
  products: any[];
  activeCategoryId: number;
  loading: boolean;
}

export default class CategoryPage extends Component<{}, State> {
  state: State = {
    categories: mockCategories,
    products: [],
    activeCategoryId: 1,
    loading: true,
  };

  componentDidMount() {
    const params = getCurrentInstance().router?.params || {};
    const id = Number(params.id) || 1;
    this.setState({ activeCategoryId: id }, () => {
      this.loadCategories();
      this.loadProducts(id);
    });
  }

  onPullDownRefresh() {
    Promise.all([
      this.loadCategories(),
      this.loadProducts(this.state.activeCategoryId),
    ]).finally(() => Taro.stopPullDownRefresh());
  }

  loadCategories = async () => {
    try {
      const categories = await productApi.getCategories();
      this.setState({ categories });
    } catch {
      // mock
    }
  };

  loadProducts = async (categoryId: number) => {
    this.setState({ loading: true });
    try {
      const products = await productApi.getProducts({ categoryId, page: 1, pageSize: 50 });
      this.setState({ products, loading: false });
    } catch {
      this.setState({ loading: false });
    }
  };

  handleSelectCategory = (categoryId: number) => {
    if (categoryId === this.state.activeCategoryId) return;
    this.setState({ activeCategoryId: categoryId });
    this.loadProducts(categoryId);
  };

  getActiveCategory = () => {
    return this.state.categories.find((c) => c.id === this.state.activeCategoryId);
  };

  render() {
    const { categories, products, activeCategoryId, loading } = this.state;
    const active = this.getActiveCategory();

    return (
      <View className='category-page'>
        <View className='category-header'>
          <Text className='header-title'>{active?.icon} {active?.name || '全部分类'}</Text>
          <Text className='header-desc'>邻选·优选社区 · 地下仓直配 · 2小时达</Text>
        </View>

        <View className='category-body'>
          <ScrollView className='category-nav' scrollY>
            {categories.map((cat) => (
              <View
                key={cat.id}
                className={`nav-item ${activeCategoryId === cat.id ? 'active' : ''}`}
                onClick={() => this.handleSelectCategory(cat.id)}
              >
                <Text>{cat.name}</Text>
              </View>
            ))}
          </ScrollView>

          <ScrollView className='product-panel' scrollY>
            {loading ? (
              <View className='loading-wrap'>
                <Text>加载中...</Text>
              </View>
            ) : products.length === 0 ? (
              <EmptyState
                iconName='empty'
                text='该分类暂无商品'
                subText='试试其他分类或稍后再来'
                actionText='回首页逛逛'
                onAction={() => Taro.switchTab({ url: PAGE_PATH.INDEX })}
              />
            ) : (
              <View className='product-grid'>
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onClick={() => navigateTo(PAGE_PATH.DETAIL, { id: product.id })}
                  />
                ))}
              </View>
            )}
            <View className='safe-bottom' />
          </ScrollView>
        </View>
      </View>
    );
  }
}
