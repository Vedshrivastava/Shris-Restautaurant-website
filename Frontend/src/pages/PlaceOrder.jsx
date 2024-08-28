import React, { useContext, useEffect, useState } from "react";
import "../styles/PlaceOrder.css";
import { StoreContext } from "../context/StoreContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";

const PlaceOrder = () => {
  const { getTotalCartAmount, token,user, food_list, cartItems, url } =
    useContext(StoreContext);
  const navigate = useNavigate();

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "Nagod",
    state: "Madhya Pradesh",
    zipcode: "",
    country: "",
    phone: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const placeOrder = async (event) => {
    event.preventDefault();

    // Initialize Stripe with your public key
    const stripe = await loadStripe(
      import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
    );
    const user = JSON.parse(localStorage.getItem("user"));

    // if (!user) {
    //   alert("User is not logged in");
    //   return;
    // }

    // Create the order items list
    const orderItems = food_list
      .filter((item) => cartItems[item._id] > 0)
      .map((item) => ({
        ...item,
        quantity: cartItems[item._id],
      }));
    console.log(orderItems);

    // Prepare the order data
    let orderData = {
      userId: localStorage.getItem("userId"),
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() ? getTotalCartAmount() + 20 : 0,
      customer: {
        name:"Eklavya Singh Parihar",
        address: {
          line1: data.street,
          city: data.city,
          postal_code: 452003,
          state: data.state,
          country: 'IN',
        },
      },
    };
    try {
      // Send order data to your backend
      let response = await axios.post(url + "/api/order/place", orderData
        // headers: { authorization: token }
      );

      if (response.data.success) {
        // Retrieve the Stripe session ID from the backend response
        const { session_url } = response.data;

        // Redirect to the Stripe checkout page
        const result = await stripe.redirectToCheckout({
          sessionId: session_url,
        });

        if (result.error) {
          // Handle any errors that occurred during redirection
          console.error(result.error.message);
          alert("An error occurred during payment processing.");
        }
      } else {
        // Handle the case where the order placement fails on the backend
        alert("Error placing order.");
        console.log(response.data.message);
      }
    } catch (error) {
      // Handle any errors that occur during the order placement or payment initiation
      console.error("Error placing order:", error);
      alert("An error occurred. Please try again.");
    }
  };
  useEffect(() => {
    if (!token) {
      navigate("/cart");
      toast.error("User Not SignedIn");
    } else if (getTotalCartAmount() === 0) {
      navigate("/cart");
      toast.error("Cart Is Empty");
    }
  }, [token]);

  return (
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <h2>Delivery Information</h2>
        <div className="multi-fields">
          <input
            required
            name="firstName"
            onChange={onChangeHandler}
            value={data.firstName}
            type="text"
            placeholder="First name"
          />
          <input
            required
            name="lastName"
            onChange={onChangeHandler}
            value={data.lastName}
            type="text"
            placeholder="Last name"
          />
        </div>
        <input
          required
          name="email"
          onChange={onChangeHandler}
          value={data.email}
          type="email"
          placeholder="E-mail"
        />
        <input
          required
          name="street"
          onChange={onChangeHandler}
          value={data.street}
          type="text"
          placeholder="Street"
        />
        <div className="multi-fields">
          <input
            required
            name="city"
            onChange={onChangeHandler}
            value={data.city}
            type="text"
            placeholder="City"
            readOnly
          />
          <input
            required
            name="state"
            onChange={onChangeHandler}
            value={data.state}
            type="text"
            placeholder="State"
            readOnly
          />
        </div>
        <input
          required
          name="phone"
          onChange={onChangeHandler}
          value={data.phone}
          type="text"
          placeholder="phone"
        />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Total </h2>
        </div>
        <div className="cart-total-details">
          <p>Subtotal</p>
          <p>₹{getTotalCartAmount()}</p>
        </div>
        <hr />
        <div className="cart-total-details">
          <p>delivery fee</p>
          <p>₹{getTotalCartAmount() ? 20 : 0}</p>
        </div>
        <hr />
        <div className="cart-total-details">
          <b>Total</b>
          <b>₹{getTotalCartAmount() ? getTotalCartAmount() + 20 : 0}</b>
        </div>
        <div className="button-container">
          <button type="submit">PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;