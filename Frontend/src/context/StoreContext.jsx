import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const url = "http://localhost:4000";

  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCartItems = localStorage.getItem("cartItems");
      return savedCartItems ? JSON.parse(savedCartItems) : {};
    } catch (error) {
      console.error("Error parsing cart items from localStorage:", error);
      return {};
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [food_list, setFood_List] = useState([]);
  const [userId, setUserId] = useState(
    () => localStorage.getItem("userId") || ""
  );

  const addToCart = async (itemId) => {
    setCartItems((prev) => {
      const newCartItems = { ...prev };
      if (!newCartItems[itemId]) {
        newCartItems[itemId] = 1;
      } else {
        newCartItems[itemId] += 1;
      }
      localStorage.setItem("cartItems", JSON.stringify(newCartItems));
      return newCartItems;
    });

    if (token) {
      await axios.post(
        url + "/api/cart/add",
        { itemId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }
  };

  const handleIncrement = (id) => {
    updateCartItemQuantity(id, cartItems[id] + 1);
  };

  const handleDecrement = (id) => {
    if (cartItems[id] > 1) {
      updateCartItemQuantity(id, cartItems[id] - 1);
    } else {
      updateCartItemQuantity(id, cartItems[id] - 1);
      removeFromCart(id);
    }
  };

  const updateCartItemQuantity = async (id, quantity) => {
    setCartItems((prevItems) => {
      const updatedItems = { ...prevItems, [id]: quantity };
      localStorage.setItem("cartItems", JSON.stringify(updatedItems));
      return updatedItems;
    });

    await axios.post(
      `${url}/api/cart/update`,
      { itemId: id, quantity },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => {
      const newCartItems = { ...prev };
      delete newCartItems[itemId];
      localStorage.setItem("cartItems", JSON.stringify(newCartItems));
      return newCartItems;
    });

    if (token) {
      await axios.delete(url + "/api/cart/remove", {
        data: { itemId },
        headers: { Authorization: `Bearer ${token}` },
      });
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        const itemInfo = food_list.find((product) => product._id === item);
        if (itemInfo) {
          totalAmount += itemInfo.price * cartItems[item];
        }
      }
    }
    return totalAmount;
  };

  const fetchFoodList = async () => {
    const response = await axios.get(url + "/api/food/list");
    setFood_List(response.data.data);
  };

  const loadCartData = async (token) => {
    try {
      const response = await axios.get(url + "/api/cart/get", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        const cartData = response.data.cartData;

        if (cartData) {
          setCartItems(cartData);
          localStorage.setItem("cartItems", JSON.stringify(cartData));
        } else {
          throw new Error("Cart data is empty");
        }
      } else {
        throw new Error(`Error: Received status code ${response.status}`);
      }
    } catch (error) {
      console.error("Error loading cart data:", error.message);

      if (error.response && error.response.status === 401) {
        alert("Your session has expired. Please log in again.");
      }
    }
  };

  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      const savedToken = localStorage.getItem("token");
      const savedUserId = localStorage.getItem("userId");
      if (savedToken) {
        setToken(savedToken);
        await loadCartData(savedToken);
      }
      if (savedUserId) {
        setUserId(savedUserId);
      }
    }
    loadData();
  }, []);

  const contextValue = {
    food_list,
    cartItems,
    url,
    token,
    userId,
    setToken,
    setUserId,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    updateCartItemQuantity,
    handleDecrement,
    handleIncrement,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;