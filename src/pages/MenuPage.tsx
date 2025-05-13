
import React, { useState, useMemo, useEffect } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import ProductCard, { Product } from '@/components/ui/ProductCard';
import CategoryFilter from '@/components/ui/CategoryFilter';
import ProductSearch from '@/components/ui/ProductSearch';
import { products as initialProducts, categories as initialCategories } from '@/data/products';

// Key for storing products in localStorage (same as in AdminProductsPage)
const PRODUCTS_STORAGE_KEY = "shawarma_timaro_products";

const MenuPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  // Load products from localStorage or use initial ones
  useEffect(() => {
    const savedProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (savedProducts) {
      try {
        const parsedProducts = JSON.parse(savedProducts) as Product[];
        setProducts(parsedProducts);
        // Extract unique categories from products
        const uniqueCategories = [...new Set(parsedProducts.map(product => product.category))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Помилка при завантаженні товарів:', error);
        setProducts(initialProducts);
        setCategories(initialCategories);
      }
    } else {
      setProducts(initialProducts);
      setCategories(initialCategories);
    }
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const categoryMatch = selectedCategory
          ? product.category === selectedCategory
          : true;
      const searchMatch =
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description
              .toLowerCase()
              .includes(searchTerm.toLowerCase());
      return categoryMatch && searchMatch;
    });
  }, [selectedCategory, searchTerm, products]);

  return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Наше меню</h1>
            <p className="text-text-light max-w-2xl mx-auto">
              Оберіть з широкого асортименту наших шаурм, закусок та напоїв.
              Усі страви готуються зі свіжих інгредієнтів прямо при вас.
            </p>
          </div>

          <div className="mb-8">
            <ProductSearch
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
            />
            <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
            />
          </div>

          {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
                {filteredProducts.map((product: Product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
              </div>
          ) : (
              <div className="text-center py-16">
                <h3 className="text-xl font-medium mb-2">Нічого не знайдено</h3>
                <p className="text-text-light">
                  Спробуйте змінити параметри пошуку або обрати іншу категорію
                </p>
              </div>
          )}
        </div>
      </MainLayout>
  );
};

export default MenuPage;
