
import { db } from "@/lib/firebase";
import { collection, doc, addDoc, updateDoc, getDocs, getDoc, query, where, orderBy } from "firebase/firestore";
import { Order, OrderItem, OrderStatus } from "@/models/Order";

const ORDERS_COLLECTION = "orders";

// Create a new order
export const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt'>): Promise<Order> => {
  try {
    // Add createdAt field
    const orderWithTimestamp = {
      ...orderData,
      createdAt: new Date().toISOString()
    };
    
    // Add to Firestore
    const docRef = await addDoc(collection(db, ORDERS_COLLECTION), orderWithTimestamp);
    
    // Return the created order with the Firestore ID
    const newOrder: Order = {
      ...orderWithTimestamp,
      id: docRef.id
    };
    
    // Also save to localStorage for offline access
    saveOrderToLocalStorage(newOrder);
    
    return newOrder;
  } catch (error) {
    console.error("Error creating order:", error);
    
    // Fallback to localStorage only
    return createOrderLocally(orderData);
  }
};

// Get all orders
export const getAllOrders = async (): Promise<Order[]> => {
  try {
    const q = query(
      collection(db, ORDERS_COLLECTION),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Order));
  } catch (error) {
    console.error("Error getting all orders:", error);
    
    // Fallback to localStorage
    return getOrdersFromLocalStorage();
  }
};

// Get orders for a specific user
export const getUserOrders = async (userId: string): Promise<Order[]> => {
  try {
    const q = query(
      collection(db, ORDERS_COLLECTION),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Order));
  } catch (error) {
    console.error("Error getting user orders:", error);
    
    // Fallback to localStorage
    const allOrders = getOrdersFromLocalStorage();
    return allOrders.filter(order => order.userId === userId);
  }
};

// Get order by ID
export const getOrderById = async (orderId: string): Promise<Order | null> => {
  try {
    const orderDoc = await getDoc(doc(db, ORDERS_COLLECTION, orderId));
    
    if (orderDoc.exists()) {
      return {
        id: orderDoc.id,
        ...orderDoc.data()
      } as Order;
    }
    return null;
  } catch (error) {
    console.error("Error getting order by ID:", error);
    
    // Fallback to localStorage
    const allOrders = getOrdersFromLocalStorage();
    return allOrders.find(order => order.id === orderId) || null;
  }
};

// Update order status
export const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<Order> => {
  try {
    const orderRef = doc(db, ORDERS_COLLECTION, orderId);
    await updateDoc(orderRef, { status });
    
    // Get updated order
    const updatedDoc = await getDoc(orderRef);
    const updatedOrder = {
      id: orderId,
      ...updatedDoc.data()
    } as Order;
    
    // Update in localStorage too
    updateOrderInLocalStorage(updatedOrder);
    
    return updatedOrder;
  } catch (error) {
    console.error("Error updating order status:", error);
    
    // Fallback to localStorage only
    return updateOrderStatusLocally(orderId, status);
  }
};

// Helper functions for localStorage operations

// Create order in localStorage
function createOrderLocally(orderData: Omit<Order, 'id' | 'createdAt'>): Order {
  const newOrder: Order = {
    ...orderData,
    id: "ORD-" + Math.floor(10000 + Math.random() * 90000),
    createdAt: new Date().toISOString()
  };
  
  saveOrderToLocalStorage(newOrder);
  
  return newOrder;
}

// Update order status in localStorage
function updateOrderStatusLocally(orderId: string, status: OrderStatus): Order {
  const orders = getOrdersFromLocalStorage();
  const orderIndex = orders.findIndex(order => order.id === orderId);
  
  if (orderIndex === -1) {
    throw new Error(`Order with ID ${orderId} not found`);
  }
  
  orders[orderIndex] = {
    ...orders[orderIndex],
    status
  };
  
  localStorage.setItem("shawarma_timaro_orders", JSON.stringify(orders));
  
  return orders[orderIndex];
}

// Save order to localStorage
function saveOrderToLocalStorage(order: Order): void {
  const orders = getOrdersFromLocalStorage();
  orders.push(order);
  localStorage.setItem("shawarma_timaro_orders", JSON.stringify(orders));
}

// Update order in localStorage
function updateOrderInLocalStorage(updatedOrder: Order): void {
  const orders = getOrdersFromLocalStorage();
  const orderIndex = orders.findIndex(order => order.id === updatedOrder.id);
  
  if (orderIndex !== -1) {
    orders[orderIndex] = updatedOrder;
    localStorage.setItem("shawarma_timaro_orders", JSON.stringify(orders));
  }
}

// Get all orders from localStorage
function getOrdersFromLocalStorage(): Order[] {
  const storedOrders = localStorage.getItem("shawarma_timaro_orders");
  if (storedOrders) {
    try {
      return JSON.parse(storedOrders);
    } catch (error) {
      console.error("Failed to parse stored orders:", error);
    }
  }
  return [];
}

// Initialize Firebase orders collection from localStorage
export const initializeOrders = async (): Promise<void> => {
  try {
    // Check if orders collection is empty
    const querySnapshot = await getDocs(collection(db, ORDERS_COLLECTION));
    if (querySnapshot.empty) {
      // Get orders from localStorage
      const orders = getOrdersFromLocalStorage();
      
      // Add all orders to Firestore
      for (const order of orders) {
        const { id, ...orderWithoutId } = order;
        await addDoc(collection(db, ORDERS_COLLECTION), orderWithoutId);
      }
      console.log("Orders initialized from localStorage");
    }
  } catch (error) {
    console.error("Error initializing orders:", error);
  }
};
