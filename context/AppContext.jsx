'use client'
import axios from "axios";
import { productsDummyData } from "@/assets/assets";
import { useUser, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

console.log('Axios:', axios);

export const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppContextProvider = ({ children }) => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY;
    const router = useRouter();

    const { user } = useUser();
    const { getToken } = useAuth(); // ✅ correct

    const [products, setProducts] = useState([]);
    const [userData, setUserData] = useState(null);
    const [isSeller, setIsSeller] = useState(false);
    const [cartItems, setCartItems] = useState({});

    // Fetch products (dummy data)
    const fetchProductData = async () => {
        setProducts(productsDummyData);
    }

    // Fetch real user data from your API using Clerk token
    const fetchUserData = async () => {
        try {
            if (!user) return; // Wait until user is loaded

            if (user?.publicMetadata?.role === 'seller') {
                setIsSeller(true);
            }

            const token = await getToken(); // ✅ get token from useAuth

            const { data } = await axios.get('/api/user/data', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data.success) {
                setUserData(data.user);
                setCartItems(data.user.cartItems || {});
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.message || "Failed to fetch user data");
        }
    }

    const addToCart = (itemId) => {
        let cartData = structuredClone(cartItems);
        cartData[itemId] = (cartData[itemId] || 0) + 1;
        setCartItems(cartData);
    }

    const updateCartQuantity = (itemId, quantity) => {
        let cartData = structuredClone(cartItems);
        if (quantity === 0) {
            delete cartData[itemId];
        } else {
            cartData[itemId] = quantity;
        }
        setCartItems(cartData);
    }

    const getCartCount = () => Object.values(cartItems).reduce((sum, qty) => sum + qty, 0);

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const itemId in cartItems) {
            const itemInfo = products.find(p => p._id === itemId);
            if (itemInfo) totalAmount += itemInfo.offerPrice * cartItems[itemId];
        }
        return Math.floor(totalAmount * 100) / 100;
    }

    // Load products once
    useEffect(() => {
        fetchProductData();
    }, []);

    // Load user data whenever user changes
    useEffect(() => {
        fetchUserData();
    }, [user]);

    const value = {
        user, getToken,
        currency, router,
        isSeller, setIsSeller,
        userData, fetchUserData,
        products, fetchProductData,
        cartItems,setCartItems,
        addToCart, updateCartQuantity,
        getCartCount, getCartAmount
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}
