
import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layouts/MainLayout';
import { Button } from '@/components/ui/button';

const OrderSuccessPage: React.FC = () => {
  const orderNumber = Math.floor(10000 + Math.random() * 90000);
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Спасибо за заказ!</h1>
          
          <p className="text-xl mb-3">Ваш заказ #{orderNumber} успешно оформлен</p>
          
          <p className="text-text-light mb-8">
            Мы отправили подтверждение заказа на ваш email. 
            Вы можете следить за статусом заказа в разделе "История заказов" в вашем личном кабинете.
          </p>
          
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8 text-left">
            <h2 className="text-xl font-semibold mb-4">Информация о заказе:</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-text-light">Номер заказа:</span>
                <span className="font-medium">#{orderNumber}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-text-light">Статус:</span>
                <span className="font-medium text-green-600">Принят</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-text-light">Примерное время доставки:</span>
                <span className="font-medium">30-45 минут</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-text-light">Способ оплаты:</span>
                <span className="font-medium">При получении</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/menu">
              <Button variant="outline">
                Вернуться в меню
              </Button>
            </Link>
            <Link to="/order-history">
              <Button className="bg-primary hover:bg-primary-dark">
                История заказов
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default OrderSuccessPage;
