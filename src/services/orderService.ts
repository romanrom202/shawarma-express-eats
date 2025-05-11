import { Order, OrderStatus } from "@/models/Order";

// This would be replaced with actual Firebase/API calls
const STORAGE_KEY = "shawarma_express_orders";

// Mock data for initial orders
const generateMockOrders = (): Order[] => {
    return [
        {
            id: "ORD-" + Math.floor(10000 + Math.random() * 90000),
            items: [
                {
                    id: 1,
                    name: "Класична шаурма",
                    price: 120,
                    quantity: 2,
                    imageUrl: "https://images.unsplash.com/photo-1550547660-d9450f859349?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
                },
                {
                    id: 2,
                    name: "Кола",
                    price: 30,
                    quantity: 1,
                    imageUrl: "https://images.unsplash.com/photo-1581636136183-91f72685e282?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
                }
            ],
            status: OrderStatus.DELIVERED,
            total: 270,
            createdAt: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
            userId: "user123",
            userEmail: "user@example.com",
            userName: "Іван Петренко",
            address: "вул. Центральна, 123",
            phone: "+380991234567",
            paymentMethod: "cash"
        },
        {
            id: "ORD-" + Math.floor(10000 + Math.random() * 90000),
            items: [
                {
                    id: 3,
                    name: "Гостра шаурма",
                    price: 140,
                    quantity: 1,
                    imageUrl: "https://images.unsplash.com/photo-1573225342350-16731dd9bf3d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
                }
            ],
            status: OrderStatus.PREPARING,
            total: 140,
            createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
            userId: "user123",
            userEmail: "user@example.com",
            userName: "Іван Петренко",
            address: "вул. Центральна, 123",
            phone: "+380991234567",
            paymentMethod: "card"
        }
    ];
};

// Initialize orders in localStorage
const initOrders = (): Order[] => {
    const storedOrders = localStorage.getItem(STORAGE_KEY);
    if (storedOrders) {
        try {
            return JSON.parse(storedOrders);
        } catch (error) {
            console.error("Failed to parse stored orders:", error);
        }
    }
    const mockOrders = generateMockOrders();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockOrders));
    return mockOrders;
};

// Get all orders
export const getAllOrders = async (): Promise<Order[]> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    const orders = initOrders();
    return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

// Get orders for a specific user
export const getUserOrders = async (userId: string): Promise<Order[]> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    const orders = initOrders();
    return orders
        .filter(order => order.userId === userId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

// Get order by ID
export const getOrderById = async (orderId: string): Promise<Order | null> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    const orders = initOrders();
    return orders.find(order => order.id === orderId) || null;
};

// Create a new order
export const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt'>): Promise<Order> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));

    const orders = initOrders();
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

    const orders = initOrders();
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