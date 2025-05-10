
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/hooks/useCart';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const CartPage: React.FC = () => {
  const { cartItems, updateQuantity, removeFromCart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast({
        title: "Помилка",
        description: "Кошик порожній. Додайте товари для оформлення замовлення.",
        variant: "destructive",
      });
      return;
    }
    
    setIsCheckingOut(true);
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!deliveryAddress) {
      toast({
        title: "Введіть адресу",
        description: "Будь ласка, вкажіть адресу доставки",
        variant: "destructive",
      });
      return;
    }
    
    // Here we would send the order to the backend
    // For now, just display success message
    toast({
      title: "Замовлення прийнято!",
      description: "Ваше замовлення успішно оформлено та передано в обробку.",
      variant: "default",
    });
    
    // Clear cart after successful order
    clearCart();
    
    // Redirect to order confirmation page
    navigate('/order-success');
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Кошик</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <svg
              className="mx-auto h-16 w-16 text-text-light mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <h2 className="text-2xl font-medium mb-4">Ваш кошик порожній</h2>
            <p className="text-text-light mb-8">
              Схоже, ви ще не додали жодного товару до кошика
            </p>
            <Link to="/menu">
              <Button className="bg-primary hover:bg-primary-dark">
                Перейти до меню
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Cart Items */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Товари в кошику</h2>

                  <div className="divide-y divide-gray-200">
                    {cartItems.map((item) => (
                      <div key={item.id} className="py-4 flex flex-wrap sm:flex-nowrap items-center">
                        <div className="sm:w-20 w-full mb-4 sm:mb-0">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded"
                          />
                        </div>
                        <div className="flex-grow sm:pl-6">
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-primary font-bold mt-1">{item.price} ₴</p>
                        </div>
                        <div className="flex items-center gap-2 mt-4 sm:mt-0">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="font-bold ml-4 text-right w-20">
                          {item.price * item.quantity} ₴
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">
                  {isCheckingOut ? 'Оформлення замовлення' : 'Сума замовлення'}
                </h2>

                {isCheckingOut ? (
                  <form onSubmit={handlePlaceOrder}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Адреса доставки</label>
                        <Input 
                          type="text" 
                          placeholder="вул. Хрещатик, буд. 1, кв. 1" 
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Спосіб оплати</label>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <input 
                              type="radio" 
                              id="cash" 
                              name="payment" 
                              value="cash"
                              checked={paymentMethod === 'cash'} 
                              onChange={() => setPaymentMethod('cash')} 
                              className="mr-2"
                            />
                            <label htmlFor="cash">Готівкою при отриманні</label>
                          </div>
                          <div className="flex items-center">
                            <input 
                              type="radio" 
                              id="card" 
                              name="payment" 
                              value="card"
                              checked={paymentMethod === 'card'} 
                              onChange={() => setPaymentMethod('card')} 
                              className="mr-2"
                            />
                            <label htmlFor="card">Карткою онлайн</label>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 pt-4 mt-4">
                        <div className="flex justify-between mb-2">
                          <span>Сума замовлення:</span>
                          <span>{totalPrice} ₴</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span>Вартість доставки:</span>
                          <span>0 ₴</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg">
                          <span>Разом:</span>
                          <span>{totalPrice} ₴</span>
                        </div>
                      </div>

                      <div className="pt-4">
                        <Button className="w-full bg-primary hover:bg-primary-dark" type="submit">
                          Оформити замовлення
                        </Button>
                        <Button 
                          className="w-full mt-2" 
                          variant="outline"
                          onClick={() => setIsCheckingOut(false)}
                        >
                          Повернутися до кошика
                        </Button>
                      </div>
                    </div>
                  </form>
                ) : (
                  <div>
                    <div className="border-t border-gray-200 pt-4 mb-4">
                      <div className="flex justify-between mb-2">
                        <span>Сума замовлення:</span>
                        <span>{totalPrice} ₴</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span>Вартість доставки:</span>
                        <span>0 ₴</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg">
                        <span>Разом:</span>
                        <span>{totalPrice} ₴</span>
                      </div>
                    </div>

                    <Button 
                      className="w-full bg-primary hover:bg-primary-dark" 
                      onClick={handleCheckout}
                    >
                      Оформити замовлення
                    </Button>
                    <div className="mt-4 text-center">
                      <Link to="/menu" className="text-primary hover:underline">
                        Продовжити покупки
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default CartPage;
