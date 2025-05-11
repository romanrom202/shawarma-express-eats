import React, { useState, useMemo } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import ProductCard, { Product } from '@/components/ui/ProductCard';
import CategoryFilter from '@/components/ui/CategoryFilter';
import ProductSearch from '@/components/ui/ProductSearch';
import { products, categories } from '@/data/products';

const MenuPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

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
  }, [selectedCategory, searchTerm]);

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