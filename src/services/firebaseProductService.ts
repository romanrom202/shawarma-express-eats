
import { db, storage } from "@/lib/firebase";
import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, where, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { Product } from "@/components/ui/ProductCard";

const PRODUCTS_COLLECTION = "products";

// Get all products
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
    const products = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: parseInt(doc.id) || doc.id, // Handle both numeric and string IDs
        name: data.name,
        description: data.description,
        price: data.price,
        imageUrl: data.imageUrl,
        category: data.category
      } as Product;
    });
    
    console.log("Products loaded from Firebase:", products);
    
    // Save to localStorage for offline access
    localStorage.setItem("shawarma_timaro_products", JSON.stringify(products));
    
    return products;
  } catch (error) {
    console.error("Error getting products:", error);
    // Fallback to local storage if Firebase fails
    const savedProducts = localStorage.getItem("shawarma_timaro_products");
    if (savedProducts) {
      return JSON.parse(savedProducts);
    }
    return [];
  }
};

// Get product by ID
export const getProductById = async (productId: number): Promise<Product | null> => {
  try {
    const productDoc = await getDoc(doc(db, PRODUCTS_COLLECTION, productId.toString()));
    
    if (productDoc.exists()) {
      return {
        id: parseInt(productDoc.id),
        ...productDoc.data()
      } as Product;
    }
    return null;
  } catch (error) {
    console.error("Error getting product:", error);
    return null;
  }
};

// Add new product
export const addProduct = async (product: Omit<Product, 'id'>, imageFile?: File): Promise<Product> => {
  try {
    console.log("Adding product:", product);
    
    // If there's an image file, upload it first
    let imageUrl = product.imageUrl;
    
    if (imageFile) {
      const storageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
      await uploadBytes(storageRef, imageFile);
      imageUrl = await getDownloadURL(storageRef);
    }
    
    // Generate a numeric ID for the new product
    const productsSnapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
    const existingIds = productsSnapshot.docs
      .map(doc => parseInt(doc.id))
      .filter(id => !isNaN(id));
    
    const newId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;
    
    // Add the product to Firestore with explicit ID
    const productWithImage = { 
      ...product, 
      imageUrl 
    };
    
    // Use setDoc with explicit ID instead of addDoc
    await setDoc(doc(db, PRODUCTS_COLLECTION, newId.toString()), productWithImage);
    
    // Return the created product with id
    const newProduct = {
      id: newId,
      ...productWithImage
    } as Product;
    
    // Also update localStorage for offline access
    const savedProducts = localStorage.getItem("shawarma_timaro_products");
    if (savedProducts) {
      const products = JSON.parse(savedProducts) as Product[];
      products.push(newProduct);
      localStorage.setItem("shawarma_timaro_products", JSON.stringify(products));
    } else {
      localStorage.setItem("shawarma_timaro_products", JSON.stringify([newProduct]));
    }
    
    console.log("Product added successfully:", newProduct);
    
    return newProduct;
  } catch (error) {
    console.error("Error adding product:", error);
    throw new Error("Failed to add product");
  }
};

// Update product
export const updateProduct = async (productId: number, product: Partial<Product>, imageFile?: File): Promise<Product> => {
  try {
    console.log("Updating product:", productId, product);
    const productRef = doc(db, PRODUCTS_COLLECTION, productId.toString());
    let updateData = { ...product };
    
    // If there's a new image file, upload it
    if (imageFile) {
      try {
        // Upload new image
        const storageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        const newImageUrl = await getDownloadURL(storageRef);
        updateData.imageUrl = newImageUrl;
      } catch (e) {
        console.error("Error uploading new image:", e);
        // Continue without changing the image
      }
    }
    
    // Update Firestore
    await updateDoc(productRef, updateData);
    
    // Get the updated product
    const updatedProductDoc = await getDoc(productRef);
    const updatedProduct = {
      id: productId,
      ...updatedProductDoc.data()
    } as Product;
    
    // Also update localStorage for offline access
    const savedProducts = localStorage.getItem("shawarma_timaro_products");
    if (savedProducts) {
      const products = JSON.parse(savedProducts) as Product[];
      const index = products.findIndex(p => p.id === productId);
      if (index !== -1) {
        products[index] = updatedProduct;
        localStorage.setItem("shawarma_timaro_products", JSON.stringify(products));
      }
    }
    
    console.log("Product updated successfully:", updatedProduct);
    
    return updatedProduct;
  } catch (error) {
    console.error("Error updating product:", error);
    throw new Error("Failed to update product");
  }
};

// Delete product
export const deleteProduct = async (productId: number): Promise<void> => {
  try {
    // Delete the product document
    await deleteDoc(doc(db, PRODUCTS_COLLECTION, productId.toString()));
    
    // Also update localStorage for offline access
    const savedProducts = localStorage.getItem("shawarma_timaro_products");
    if (savedProducts) {
      const products = JSON.parse(savedProducts) as Product[];
      const updatedProducts = products.filter(p => p.id !== productId);
      localStorage.setItem("shawarma_timaro_products", JSON.stringify(updatedProducts));
    }
    
    console.log("Product deleted successfully:", productId);
  } catch (error) {
    console.error("Error deleting product:", error);
    throw new Error("Failed to delete product");
  }
};

// Initialize Firebase products from localStorage if collection is empty
export const initializeProducts = async (): Promise<void> => {
  try {
    // Check if products collection is empty
    const querySnapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
    if (querySnapshot.empty) {
      // Get products from localStorage
      const savedProducts = localStorage.getItem("shawarma_timaro_products");
      if (savedProducts) {
        const products = JSON.parse(savedProducts) as Product[];
        
        // Add all products to Firestore with their IDs preserved
        for (const product of products) {
          const { id, ...productWithoutId } = product;
          await setDoc(doc(db, PRODUCTS_COLLECTION, id.toString()), productWithoutId);
        }
        console.log("Products initialized from localStorage");
      }
    } else {
      console.log("Products collection already exists in Firestore");
    }
  } catch (error) {
    console.error("Error initializing products:", error);
  }
};
