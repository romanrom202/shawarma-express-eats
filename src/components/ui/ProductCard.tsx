
import React from 'react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { ShoppingCart, Plus, Minus } from 'lucide-react';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, removeFromCart, getItemQuantity } = useCart();
  const quantity = getItemQuantity(product.id);

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleRemoveFromCart = () => {
    removeFromCart(product.id);
  };

  return (
    <div className="product-card flex flex-col h-full">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-2 right-2 bg-secondary text-secondary-foreground px-2 py-1 rounded text-sm font-medium">
          {product.category}
        </div>
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="font-heading font-bold text-lg mb-2">{product.name}</h3>
        <p className="text-text-light text-sm mb-4 flex-grow">{product.description}</p>
        <div className="flex items-center justify-between">
          <p className="text-primary font-bold text-lg">{product.price} ₽</p>
          {quantity === 0 ? (
            <Button 
              className="bg-primary hover:bg-primary-light" 
              size="sm"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-4 h-4 mr-1" />
              В корзину
            </Button>
          ) : (
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8"
                onClick={handleRemoveFromCart}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="font-medium">{quantity}</span>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8"
                onClick={handleAddToCart}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
