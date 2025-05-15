
import { db, storage } from "@/lib/firebase";
import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, where } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { Product } from "@/components/ui/ProductCard";

const PRODUCTS_COLLECTION = "products";

// Get all products
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
    return querySnapshot.docs.map(doc => ({
      id: parseInt(doc.id),
      ...doc.data()
    } as Product));
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
    // If there's an image file, upload it first
    let imageUrl = product.imageUrl;
    
    if (imageFile) {
      const storageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
      await uploadBytes(storageRef, imageFile);
      imageUrl = await getDownloadURL(storageRef);
    }
    
    // Add the product to Firestore
    const productWithImage = { ...product, imageUrl };
    const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), productWithImage);
    
    // Return the created product with id
    const newProduct = {
      id: parseInt(docRef.id),
      ...productWithImage
    } as Product;
    
    // Also update localStorage for offline access
    const savedProducts = localStorage.getItem("shawarma_timaro_products");
    if (savedProducts) {
      const products = JSON.parse(savedProducts) as Product[];
      products.push(newProduct);
      localStorage.setItem("shawarma_timaro_products", JSON.stringify(products));
    }
    
    return newProduct;
  } catch (error) {
    console.error("Error adding product:", error);
    throw new Error("Failed to add product");
  }
};

// Update product
export const updateProduct = async (productId: number, product: Partial<Product>, imageFile?: File): Promise<Product> => {
  try {
    const productRef = doc(db, PRODUCTS_COLLECTION, productId.toString());
    let updateData = { ...product };
    
    // If there's a new image file, upload it and update the URL
    if (imageFile) {
      // Delete old image if it exists and is from Storage (contains Firebase URL pattern)
      if (product.imageUrl && product.imageUrl.includes("firebasestorage")) {
        try {
          const oldImageRef = ref(storage, product.imageUrl);
          await deleteObject(oldImageRef);
        } catch (e) {
          console.log("No previous image to delete or error deleting");
        }
      }
      
      // Upload new image
      const storageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
      await uploadBytes(storageRef, imageFile);
      const newImageUrl = await getDownloadURL(storageRef);
      updateData.imageUrl = newImageUrl;
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
    
    return updatedProduct;
  } catch (error) {
    console.error("Error updating product:", error);
    throw new Error("Failed to update product");
  }
};

// Delete product
export const deleteProduct = async (productId: number): Promise<void> => {
  try {
    // Get the product to check if we need to delete an image
    const productDoc = await getDoc(doc(db, PRODUCTS_COLLECTION, productId.toString()));
    
    if (productDoc.exists()) {
      const product = productDoc.data();
      
      // Delete the image if it's from Firebase Storage
      if (product.imageUrl && product.imageUrl.includes("firebasestorage")) {
        try {
          const imageRef = ref(storage, product.imageUrl);
          await deleteObject(imageRef);
        } catch (e) {
          console.log("Error deleting image or image not found");
        }
      }
    }
    
    // Delete the product document
    await deleteDoc(doc(db, PRODUCTS_COLLECTION, productId.toString()));
    
    // Also update localStorage for offline access
    const savedProducts = localStorage.getItem("shawarma_timaro_products");
    if (savedProducts) {
      const products = JSON.parse(savedProducts) as Product[];
      const updatedProducts = products.filter(p => p.id !== productId);
      localStorage.setItem("shawarma_timaro_products", JSON.stringify(updatedProducts));
    }
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
        
        // Add all products to Firestore
        for (const product of products) {
          const { id, ...productWithoutId } = product;
          await addDoc(collection(db, PRODUCTS_COLLECTION), productWithoutId);
        }
        console.log("Products initialized from localStorage");
      }
    }
  } catch (error) {
    console.error("Error initializing products:", error);
  }
};
