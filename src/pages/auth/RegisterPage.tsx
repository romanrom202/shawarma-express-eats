
import React from 'react';
import RegisterForm from '@/components/auth/RegisterForm';
import { Link } from 'react-router-dom';

const RegisterPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left side - Image */}
      <div className="lg:w-1/2 bg-primary relative hidden lg:block">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-light opacity-90"></div>
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-white z-10 max-w-md">
            <Link to="/" className="flex items-center mb-8">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mr-3">
                <span className="text-primary font-bold text-xl">ШТ</span>
              </div>
              <span className="font-heading font-bold text-2xl">ШаурмаТиМаРо</span>
            </Link>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Приєднуйтесь до нас!</h2>
            <p className="text-lg mb-6">
              Створіть акаунт, щоб отримати знижку на перше замовлення та насолоджуватися всіма перевагами.
            </p>
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <h3 className="text-xl font-bold mb-3">Чому варто зареєструватися:</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <svg className="h-6 w-6 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="12" fill="white" fillOpacity="0.2" />
                    <path d="M8 12l3 3 6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Знижка 20% на перше замовлення</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="12" fill="white" fillOpacity="0.2" />
                    <path d="M8 12l3 3 6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Участь у програмі лояльності</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="12" fill="white" fillOpacity="0.2" />
                    <path d="M8 12l3 3 6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Збереження адрес доставки</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="12" fill="white" fillOpacity="0.2" />
                    <path d="M8 12l3 3 6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Ексклюзивні акції для зареєстрованих користувачів</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side - Form */}
      <div className="lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Link to="/" className="flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center mr-2">
                <span className="text-white font-bold text-lg">ШТ</span>
              </div>
              <span className="font-heading font-bold text-xl">ШаурмаТиМаРо</span>
            </Link>
          </div>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
