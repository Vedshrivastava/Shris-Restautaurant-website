import React, { useContext, useEffect, useState } from "react";
import "../styles/PlaceOrder.css";
import { StoreContext } from "../context/StoreContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const PlaceOrder = () => {
  const { getTotalCartAmount, token, user, food_list, cartItems, url } =
    useContext(StoreContext);
  const navigate = useNavigate();

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "Nagod",
    state: "Madhya Pradesh",
    zipcode: "485446",
    country: "India",
    phone: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    console.log(`Field changed: ${name} = ${value}`); // Log field change
    setData((data) => ({ ...data, [name]: value }));
  };

  const placeOrderPhonepe = async (event) => {
    event.preventDefault();
    console.log("Placing order with PhonePe...");

    const orderItems = food_list
      .filter((item) => cartItems[item._id] > 0)
      .map((item) => ({
        ...item,
        quantity: cartItems[item._id],
      }));
    console.log("PhonePe order items:", orderItems);

    let orderDataPhonepe = {
      userId: localStorage.getItem("userId"),
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() ? getTotalCartAmount() + 20 : 0,
      MID: 'MID' + Date.now(),
      transactionId: 'T' + Date.now(),
      customer: {
        name: `${data.firstName} ${data.lastName}`,
        address: {
          line1: data.street,
          city: data.city,
          postal_code: 452003,
          state: data.state,
          country: 'IN',
        },
      },
    };

    console.log("PhonePe order data:", orderDataPhonepe);

    try {
      let responsePhonepe = await axios.post(url + "/api/order/order", orderDataPhonepe, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("PhonePe order response:", responsePhonepe.data);

      if (responsePhonepe.data.success) {
        window.location.href = responsePhonepe.data.data.instrumentResponse.redirectInfo.url;
      } else {
        alert("Error placing order.");
        console.log("PhonePe error message:", responsePhonepe.data.message);
      }
    } catch (error) {
      console.error("Error placing PhonePe order:", error);
      alert("An error occurred. Please try again.");
    }
  };

  useEffect(() => {
    console.log("Checking user token and cart amount...");
    if (!token) {
      navigate("/cart");
      toast.error("User Not SignedIn");
    } else if (getTotalCartAmount() === 0) {
      navigate("/cart");
      toast.error("Cart Is Empty");
    }
  }, [token]);

  return (
    <form onSubmit={placeOrderPhonepe} className="place-order">
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
          placeholder="Phone"
        />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Total</h2>
        </div>
        <div className="cart-total-details">
          <p>Subtotal</p>
          <p>₹{getTotalCartAmount()}</p>
        </div>
        <hr />
        <div className="cart-total-details">
          <p>Delivery Fee</p>
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
