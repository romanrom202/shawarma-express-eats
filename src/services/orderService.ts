
import { Order, OrderStatus } from "@/models/Order";

// This would be replaced with actual Firebase/API calls
const STORAGE_KEY = "shawarma_timaro_orders";

// Get all orders
export const getAllOrders = async (): Promise<Order[]> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    const orders = getOrdersFromStorage();
    return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

// Get orders for a specific user
export const getUserOrders = async (userId: string): Promise<Order[]> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    const orders = getOrdersFromStorage();
    return orders
        .filter(order => order.userId === userId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

// Get order by ID
export const getOrderById = async (orderId: string): Promise<Order | null> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    const orders = getOrdersFromStorage();
    return orders.find(order => order.id === orderId) || null;
};

// Create a new order
export const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt'>): Promise<Order> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));

    const orders = getOrdersFromStorage();
    const newOrder: Order = {
        ...orderData,
        id: "ORD-" + Math.floor(10000 + Math.random() * 90000),
        createdAt: new Date().toISOString(),
    };

    orders.push(newOrder);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));

    return newOrder;
};

// Update order status
export const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<Order> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 600));

    const orders = getOrdersFromStorage();
    const orderIndex = orders.findIndex(order => order.id === orderId);

    if (orderIndex === -1) {
        throw new Error(`Order with ID ${orderId} not found`);
    }

    orders[orderIndex] = {
        ...orders[orderIndex],
        status
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));

    return orders[orderIndex];
};

// Delete order by ID
export const deleteOrder = async (orderId: string): Promise<void> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    const orders = getOrdersFromStorage();
    const updatedOrders = orders.filter(order => order.id !== orderId);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedOrders));
};

// Helper function to get orders from localStorage
const getOrdersFromStorage = (): Order[] => {
    const storedOrders = localStorage.getItem(STORAGE_KEY);
    if (storedOrders) {
        try {
            return JSON.parse(storedOrders);
        } catch (error) {
            console.error("Failed to parse stored orders:", error);
        }
    }
    
    // Повертаємо пустий масив, якщо немає збережених замовлень
    return [];
};
