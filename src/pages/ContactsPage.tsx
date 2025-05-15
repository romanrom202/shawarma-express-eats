
import React from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import { Separator } from "@/components/ui/separator";

const ContactsPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-text text-center">Контакти</h1>
          <Separator className="my-6" />
          
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-8 text-text text-center">Зв'яжіться з нами</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="flex items-start bg-white p-6 rounded-lg shadow-sm">
                <div className="mr-4 mt-1 w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold mb-2">Телефон</h3>
                  <p className="text-text-light">+380 (99) 123-45-67</p>
                  <p className="text-text-light">+380 (97) 987-65-43</p>
                </div>
              </div>
              
              <div className="flex items-start bg-white p-6 rounded-lg shadow-sm">
                <div className="mr-4 mt-1 w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold mb-2">Email</h3>
                  <p className="text-text-light">info@timaro.com.ua</p>
                  <p className="text-text-light">support@timaro.com.ua</p>
                </div>
              </div>
              
              <div className="flex items-start bg-white p-6 rounded-lg shadow-sm">
                <div className="mr-4 mt-1 w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold mb-2">Адреса</h3>
                  <p className="text-text-light">вул. Хрещатик, 22</p>
                  <p className="text-text-light">м. Київ, 01001</p>
                </div>
              </div>
              
              <div className="flex items-start bg-white p-6 rounded-lg shadow-sm">
                <div className="mr-4 mt-1 w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold mb-2">Години роботи</h3>
                  <p className="text-text-light">Пн-Пт: 10:00 - 22:00</p>
                  <p className="text-text-light">Сб-Нд: 11:00 - 23:00</p>
                </div>
              </div>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold mb-6 text-text text-center">Наші заклади</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold mb-3 text-lg">Хрещатик</h3>
              <p className="text-text-light mb-2">вул. Хрещатик, 22</p>
              <p className="text-text-light mb-2">м. Київ, 01001</p>
              <p className="text-text-light">+380 (99) 123-45-67</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold mb-3 text-lg">ТРЦ Ocean Plaza</h3>
              <p className="text-text-light mb-2">вул. Антоновича, 176</p>
              <p className="text-text-light mb-2">м. Київ, 03150</p>
              <p className="text-text-light">+380 (97) 987-65-43</p>
            </div>
          </div>
          
          <div className="mt-12 bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-4 text-text text-center">Зворотний зв'язок</h2>
            <p className="text-text-light text-center mb-6">
              Якщо у вас є питання або пропозиції, ми завжди раді почути від вас!
            </p>
            <div className="flex justify-center">
              <a href="mailto:info@timaro.com.ua" className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded transition-colors">
                Написати нам
              </a>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ContactsPage;
