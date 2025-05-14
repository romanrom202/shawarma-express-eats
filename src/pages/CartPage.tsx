
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/hooks/useCart';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { createOrder } from '@/services/orderService';
import { OrderStatus } from '@/models/Order';
import { useAuth } from '@/hooks/useAuth';

const DELIVERY_FEE = 60; // Delivery fee in UAH
const PROFILE_STORAGE_KEY = "shawarma_timaro_user_profile";

const CartPage: React.FC = () => {
  const { cartItems, updateQuantity, removeFromCart, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [changeAmount, setChangeAmount] = useState('');
  const [needChange, setNeedChange] = useState(false);
  const [changeAmountError, setChangeAmountError] = useState('');
  
  // Calculate final price with delivery
  const finalPrice = totalPrice + DELIVERY_FEE;

  // Load saved address from user profile
  useEffect(() => {
    if (isCheckingOut) {
      const savedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (savedProfile) {
        try {
          const parsedProfile = JSON.parse(savedProfile);
          if (parsedProfile.address) {
            setDeliveryAddress(parsedProfile.address);
          }
        } catch (error) {
          console.error('Error loading profile data:', error);
        }
      }
    }
  }, [isCheckingOut]);

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

  const handleChangeAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setChangeAmount(value);
    
    // Validate that change amount is not less than order total
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue < finalPrice) {
      setChangeAmountError(`Сума має бути не менше суми замовлення з доставкою (${finalPrice} ₴)`);
    } else {
      setChangeAmountError('');
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!deliveryAddress) {
      toast({
        title: "Введіть адресу",
        description: "Будь ласка, вкажіть адресу доставки",
        variant: "destructive",
      });
      return;
    }

    if (paymentMethod === 'cash' && needChange) {
      if (!changeAmount) {
        toast({
          title: "Введіть суму",
          description: "Будь ласка, вкажіть суму для решти",
          variant: "destructive",
        });
        return;
      }
      
      const numChangeAmount = parseFloat(changeAmount);
      if (isNaN(numChangeAmount) || numChangeAmount < finalPrice) {
        toast({
          title: "Некоректна сума",
          description: `Сума для решти має бути не менше суми замовлення з доставкою (${finalPrice} ₴)`,
          variant: "destructive",
        });
        return;
      }
    }
    
    try {
      // Create order object
      const orderData = {
        items: cartItems,
        total: finalPrice, // Include delivery fee in total
        status: OrderStatus.ACCEPTED, // Change to ACCEPTED by default
        userId: user?.uid || null,
        userEmail: user?.email || null,
        userName: user?.displayName || null,
        address: deliveryAddress,
        paymentMethod: paymentMethod as "cash" | "card" | "online",
        changeAmount: needChange ? changeAmount : undefined,
        deliveryFee: DELIVERY_FEE
      };
      
      // Save order in localStorage
      const newOrder = await createOrder(orderData);
      
      // Show success message
      toast({
        title: "Замовлення прийнято!",
        description: "Ваше замовлення успішно оформлено та передано в обробку.",
      });
      
      // Clear cart
      clearCart();
      
      // Navigate to success page
      navigate('/order-success', { state: { order: newOrder } });
    } catch (error) {
      console.error('Помилка при створенні замовлення:', error);
      toast({
        title: "Помилка",
        description: "Не вдалося створити замовлення. Спробуйте ще раз.",
        variant: "destructive",
      });
    }
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
                            <label htmlFor="cash">Готівкою кур'єру</label>
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
                            <label htmlFor="card">Карткою кур'єру</label>
                          </div>
                        </div>
                      </div>

                      {paymentMethod === 'cash' && (
                        <div className="pl-5 mt-2">
                          <div className="flex items-center mb-2">
                            <input 
                              type="checkbox" 
                              id="needChange" 
                              checked={needChange}
                              onChange={() => setNeedChange(!needChange)}
                              className="mr-2"
                            />
                            <label htmlFor="needChange" className="text-sm">Потрібна решта</label>
                          </div>
                          
                          {needChange && (
                            <div className="mt-2">
                              <label className="block text-sm font-medium mb-1">З якої суми?</label>
                              <Input 
                                type="text" 
                                placeholder={`Мінімум ${finalPrice} ₴`}
                                value={changeAmount}
                                onChange={handleChangeAmountChange}
                                className={changeAmountError ? "border-red-500" : ""}
                              />
                              {changeAmountError && (
                                <p className="text-red-500 text-sm mt-1">{changeAmountError}</p>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      <div className="border-t border-gray-200 pt-4 mt-4">
                        <div className="flex justify-between mb-2">
                          <span>Сума замовлення:</span>
                          <span>{totalPrice} ₴</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span>Вартість доставки:</span>
                          <span>{DELIVERY_FEE} ₴</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg">
                          <span>Разом:</span>
                          <span>{finalPrice} ₴</span>
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
                        <span>{DELIVERY_FEE} ₴</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg">
                        <span>Разом:</span>
                        <span>{finalPrice} ₴</span>
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
