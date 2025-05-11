import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Импортируем провайдер аутентификации
import { AuthProvider } from '@/hooks/useAuth';

// Рендерим корневой компонент внутри AuthProvider
createRoot(document.getElementById('root')!).render(
    <AuthProvider>
        <App />
    </AuthProvider>
);
