
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-text py-8 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div>
            <h3 className="font-heading text-xl font-bold mb-4 text-secondary">Контакты</h3>
            <p className="mb-2">Телефон: +7 (999) 123-45-67</p>
            <p className="mb-2">Email: info@shawarmaexpress.ru</p>
            <p>Адрес: г. Москва, ул. Шаурменная, д. 42</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading text-xl font-bold mb-4 text-secondary">Информация</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="hover:text-secondary transition-colors">О нас</Link>
              </li>
              <li>
                <Link to="/delivery" className="hover:text-secondary transition-colors">Доставка и оплата</Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-secondary transition-colors">Политика конфиденциальности</Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-secondary transition-colors">Частые вопросы</Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-heading text-xl font-bold mb-4 text-secondary">Следите за новостями</h3>
            <p className="mb-4">Подпишитесь на нашу рассылку, чтобы получать новости и специальные предложения</p>
            <form className="flex">
              <input 
                type="email" 
                placeholder="Ваш email" 
                className="px-4 py-2 rounded-l-md flex-1 text-text focus:outline-none" 
              />
              <button 
                type="submit" 
                className="bg-primary hover:bg-primary-dark transition-colors px-4 py-2 rounded-r-md"
              >
                Подписаться
              </button>
            </form>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-700 text-center">
          <p>&copy; {currentYear} Shawarma Express. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
