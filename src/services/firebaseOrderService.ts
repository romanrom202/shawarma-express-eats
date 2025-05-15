import { db } from "@/lib/firebase";
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  runTransaction,
  setDoc as firestoreSetDoc 
} from "firebase/firestore";
import { Order, OrderItem, OrderStatus } from "@/models/Order";

const ORDERS_COLLECTION = "orders";
const COUNTERS_COLLECTION = "counters";
const ORDER_COUNTER_ID = "orderCounter";

// Create a new order with sequential ID
export const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt'>): Promise<Order> => {
  try {
    // Generate sequential order number
    const orderNumber = await getNextOrderNumber();
    
    // Format order ID
    const orderId = `ORD-${orderNumber}`;
    
    // Add createdAt field
    const orderWithTimestamp = {
      ...orderData,
      id: orderId,
      createdAt: new Date().toISOString()
    };
    
    // Add to Firestore - use setDoc with merge option to ensure doc ID is preserved
    await firestoreSetDoc(doc(db, ORDERS_COLLECTION, orderId), orderWithTimestamp);
    
    console.log("Order created successfully:", orderId);
    
    // Return the created order with the sequential ID
    const newOrder: Order = {
      ...orderWithTimestamp,
      id: orderId
    };
    
    // Also save to localStorage for offline access
    saveOrderToLocalStorage(newOrder);
    
    return newOrder;
  } catch (error) {
    console.error("Error creating order:", error);
    
    // Fallback to localStorage only with sequential ID
    return createOrderLocally(orderData);
  }
};

// Get next order number from counter collection
const getNextOrderNumber = async (): Promise<number> => {
  const counterRef = doc(db, COUNTERS_COLLECTION, ORDER_COUNTER_ID);
  
  try {
    // Use transaction to ensure sequential numbering
    const orderNumber = await runTransaction(db, async (transaction) => {
      const counterDoc = await transaction.get(counterRef);
      
      if (!counterDoc.exists()) {
        // Initialize counter if it doesn't exist
        transaction.set(counterRef, { value: 32801 });
        return 32801;
      }
      
      const newValue = counterDoc.data().value + 1;
      transaction.update(counterRef, { value: newValue });
      return newValue;
    });
    
    return orderNumber;
  } catch (error) {
    console.error("Failed to get next order number:", error);
    // Fallback to timestamp-based number
    return Math.floor(32800 + Date.now() % 10000);
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
      ...doc.data(),
      id: doc.id
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
      ...doc.data(),
      id: doc.id
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
        ...orderDoc.data(),
        id: orderDoc.id
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
      ...updatedDoc.data(),
      id: orderId
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

// Helper function for creating/updating documents
const setDoc = async (docRef: any, data: any) => {
  try {
    // Use Firestore setDoc with merge option
    await firestoreSetDoc(docRef, data, { merge: true });
  } catch (error) {
    console.error("Error in setDoc:", error);
    throw error;
  }
};

// Helper functions for localStorage operations

// Create order in localStorage with sequential ID
async function createOrderLocally(orderData: Omit<Order, 'id' | 'createdAt'>): Promise<Order> {
  // Try to get the latest order number from localStorage
  const orders = getOrdersFromLocalStorage();
  let nextNumber = 32801;
  
  if (orders.length > 0) {
    // Extract numbers from order IDs
    const orderNumbers = orders
      .map(order => {
        const match = order.id.match(/ORD-(\d+)/);
        return match ? parseInt(match[1]) : 0;
      })
      .filter(num => !isNaN(num));
    
    if (orderNumbers.length > 0) {
      nextNumber = Math.max(...orderNumbers) + 1;
    }
  }
  
  const newOrder: Order = {
    ...orderData,
    id: `ORD-${nextNumber}`,
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
  // Check if the order already exists
  const existingOrderIndex = orders.findIndex(o => o.id === order.id);
  
  if (existingOrderIndex !== -1) {
    orders[existingOrderIndex] = order;
  } else {
    orders.push(order);
  }
  
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
      
      if (orders.length > 0) {
        console.log(`Found ${orders.length} orders in localStorage, uploading to Firestore...`);
        
        // Add all orders to Firestore
        for (const order of orders) {
          // Use the existing order ID
          await firestoreSetDoc(doc(db, ORDERS_COLLECTION, order.id), order);
        }
        console.log("Orders initialized from localStorage");
        
        // Initialize order counter
        const orderNumbers = orders
          .map(order => {
            const match = order.id.match(/ORD-(\d+)/);
            return match ? parseInt(match[1]) : 0;
          })
          .filter(num => !isNaN(num));
        
        if (orderNumbers.length > 0) {
          const maxNumber = Math.max(...orderNumbers);
          await firestoreSetDoc(doc(db, COUNTERS_COLLECTION, ORDER_COUNTER_ID), { value: maxNumber });
        }
      }
    }
  } catch (error) {
    console.error("Error initializing orders:", error);
  }
};
