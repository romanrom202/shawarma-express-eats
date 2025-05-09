
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ShoppingCart, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartItems } = useCart();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const cartItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="bg-white shadow-md py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center mr-2">
              <span className="text-white font-bold text-lg">ТМ</span>
            </div>
            <span className="font-heading font-bold text-xl md:text-2xl text-text">Шаурма ТиМаРо</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="font-medium text-text-muted hover:text-primary transition-colors">Головна</Link>
            <Link to="/menu" className="font-medium text-text-muted hover:text-primary transition-colors">Меню</Link>
            <Link to="/about" className="font-medium text-text-muted hover:text-primary transition-colors">Про нас</Link>
            <Link to="/contacts" className="font-medium text-text-muted hover:text-primary transition-colors">Контакти</Link>
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </Button>
            </Link>
            <Link to="/auth/login">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/auth/login">
              <Button variant="outline" size="sm">
                Увійти
              </Button>
            </Link>
            <Link to="/auth/register">
              <Button className="bg-primary hover:bg-primary-light" size="sm">
                Реєстрація
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden space-x-4">
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </Button>
            </Link>
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="mt-4 md:hidden animate-fade-in">
            <div className="flex flex-col space-y-4 pb-4">
              <Link to="/" className="px-4 py-2 font-medium text-text-muted hover:text-primary hover:bg-accent rounded-md">
                Головна
              </Link>
              <Link to="/menu" className="px-4 py-2 font-medium text-text-muted hover:text-primary hover:bg-accent rounded-md">
                Меню
              </Link>
              <Link to="/about" className="px-4 py-2 font-medium text-text-muted hover:text-primary hover:bg-accent rounded-md">
                Про нас
              </Link>
              <Link to="/contacts" className="px-4 py-2 font-medium text-text-muted hover:text-primary hover:bg-accent rounded-md">
                Контакти
              </Link>
              <hr className="border-t border-gray-200" />
              <Link to="/auth/login" className="px-4 py-2 font-medium text-primary hover:bg-accent rounded-md">
                Увійти
              </Link>
              <Link to="/auth/register" className="px-4 py-2 bg-primary text-white font-medium rounded-md text-center">
                Реєстрація
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
