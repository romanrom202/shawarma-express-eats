import React from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';
import { User } from 'lucide-react';

const UserProfilePage: React.FC = () => {
    // This would be connected to Firebase Auth in a real app
    const user = {
        name: 'Іван Петренко',
        email: 'ivan@example.com',
        phone: '+380991234567',
        address: 'вул. Центральна, 123, м. Київ'
    };

    return (
        <MainLayout>
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-3xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-3xl font-bold">Особистий кабінет</h1>
                        <Link to="/order-history">
                            <Button variant="outline" className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                <span>Історія замовлень</span>
                            </Button>
                        </Link>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <h2 className="text-xl font-semibold mb-6">Особисті дані</h2>

                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Ім'я</Label>
                                    <Input id="name" defaultValue={user.name} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" defaultValue={user.email} disabled />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Телефон</Label>
                                    <Input id="phone" defaultValue={user.phone} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">Пароль</Label>
                                    <Input id="password" type="password" value="••••••••" disabled />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address">Адреса доставки</Label>
                                <Input id="address" defaultValue={user.address} />
                            </div>

                            <div className="flex justify-end space-x-4">
                                <Button variant="outline">Скасувати</Button>
                                <Button className="bg-primary hover:bg-primary-dark">Зберегти зміни</Button>
                            </div>
                        </form>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-6">Безпека</h2>

                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="font-medium">Зміна паролю</h3>
                                    <p className="text-sm text-text-muted">Змініть пароль для вашого облікового запису</p>
                                </div>
                                <Link to="/auth/forgot-password">
                                    <Button variant="outline">Змінити пароль</Button>
                                </Link>
                            </div>

                            <div className="border-t border-gray-200 pt-6">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="font-medium text-red-600">Видалення акаунта</h3>
                                        <p className="text-sm text-text-muted">Видаліть ваш обліковий запис і всі пов'язані з ним дані</p>
                                    </div>
                                    <Button variant="destructive">Видалити акаунт</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default UserProfilePage;