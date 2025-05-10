
import React from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const ContactsPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-text">Контакти</h1>
          <Separator className="my-6" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
            <div>
              <h2 className="text-2xl font-bold mb-6 text-text">Зв'яжіться з нами</h2>
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <div className="mr-4 mt-1 w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Телефон</h3>
                    <p className="text-text-light">+380 (99) 123-45-67</p>
                    <p className="text-text-light">+380 (97) 987-65-43</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mr-4 mt-1 w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Email</h3>
                    <p className="text-text-light">info@timaro.com.ua</p>
                    <p className="text-text-light">support@timaro.com.ua</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mr-4 mt-1 w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Адреса</h3>
                    <p className="text-text-light">вул. Хрещатик, 22</p>
                    <p className="text-text-light">м. Київ, 01001</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mr-4 mt-1 w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Години роботи</h3>
                    <p className="text-text-light">Пн-Пт: 10:00 - 22:00</p>
                    <p className="text-text-light">Сб-Нд: 11:00 - 23:00</p>
                  </div>
                </div>
              </div>
              
              <h3 className="font-bold mb-4">Слідкуйте за нами</h3>
              <div className="flex space-x-4">
                {['Facebook', 'Instagram', 'Twitter', 'YouTube'].map((social) => (
                  <a key={social} href="#" className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-primary hover:text-white transition-colors">
                    <span className="sr-only">{social}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-6 text-text">Напишіть нам</h2>
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-text-light mb-1">Ім'я</label>
                  <Input id="name" placeholder="Ваше ім'я" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-text-light mb-1">Email</label>
                  <Input id="email" type="email" placeholder="Ваш email" />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-text-light mb-1">Тема</label>
                  <Input id="subject" placeholder="Тема повідомлення" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-text-light mb-1">Повідомлення</label>
                  <Textarea id="message" placeholder="Ваше повідомлення" rows={5} />
                </div>
                <Button className="w-full">Надіслати</Button>
              </form>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold mb-6 text-text text-center">Наші заклади</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[
              { location: "Хрещатик", address: "вул. Хрещатик, 22", phone: "+380 (99) 123-45-67" },
              { location: "Майдан Незалежності", address: "Майдан Незалежності, 1", phone: "+380 (97) 987-65-43" },
              { location: "Осокорки", address: "пр. Григоренка, 15", phone: "+380 (95) 555-66-77" },
              { location: "Оболонь", address: "пр. Оболонський, 35", phone: "+380 (93) 222-33-44" },
              { location: "Позняки", address: "вул. Драгоманова, 44", phone: "+380 (97) 111-22-33" },
              { location: "Лук'янівська", address: "вул. Січових Стрільців, 12", phone: "+380 (66) 444-55-66" }
            ].map((location, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <h3 className="font-bold mb-2">{location.location}</h3>
                <p className="text-text-light text-sm mb-1">{location.address}</p>
                <p className="text-text-light text-sm">{location.phone}</p>
              </div>
            ))}
          </div>
          
          {/* Map placeholder */}
          <div className="w-full h-80 bg-gray-100 rounded-lg flex items-center justify-center mb-8">
            <p className="text-text-light">Карта з розташуванням наших закладів</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ContactsPage;
