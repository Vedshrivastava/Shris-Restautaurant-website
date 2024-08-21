import React, { useContext } from 'react';
import '../styles/Cart.css';
import { StoreContext } from '../context/StoreContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cartItems, food_list, removeFromCart, getTotalCartAmount, url, handleDecrement, handleIncrement } = useContext(StoreContext);
  const navigate = useNavigate();

  return (
    <>
      <div className='cart'>
        <div className="cart-items">
          <div className="cart-items-title">
            <p>Items</p>
            <p>Title</p>
            <p>Price</p>
            <p>Quantity</p>
            <p>Total</p>
            <p>Remove</p>
          </div>
          <br />
          <hr />
          {
            food_list.map((item) => {
              if (cartItems[item._id] > 0) {
                return (
                  <div key={item._id} className="cart-items-title cart-items-item"> {/* Added key here */}
                    <img src={item.image} alt="" />
                    <p>{item.name}</p>
                    <p>₹{item.price}</p>
                    <div className="quantity-controls">
                      <button onClick={() => handleDecrement(item._id)}>-</button>
                      <p>{cartItems[item._id]}</p>
                      <button onClick={() => handleIncrement(item._id)}>+</button>
                    </div>
                    <p className='total'>₹{item.price * cartItems[item._id]}</p>
                    <p onClick={() => removeFromCart(item._id)} className='cross'>x</p>
                    <hr />
                  </div>
                );
              }
              return null; // Ensure you return something if condition is not met
            })
          }
        </div>
      </div>
      <div className="cart-bottom">
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
          <button onClick={() => navigate('/order')}>PROCEED TO CHECKOUT</button>
        </div>
      </div>
    </>
  );
}

export default Cart;
