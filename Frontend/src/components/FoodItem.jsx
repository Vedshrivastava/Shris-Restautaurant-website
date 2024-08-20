import React, { useContext } from 'react';
import '../styles/FoodItem.css';
import { assets } from '../assets/frontend_assets/assets';
import { StoreContext } from '../context/StoreContext';
import { useNavigate } from 'react-router-dom';

// Helper function to truncate description
const truncateDescription = (description, maxWords) => {
    const words = description.split(' ');
    if (words.length <= maxWords) return description;
    return words.slice(0, maxWords).join(' ') + '...';
};

const FoodItem = ({ id, name, price, description, image }) => {
    const { cartItems, addToCart, url, handleDecrement, handleIncrement } = useContext(StoreContext);
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/item/${id}`, {
            state: {
                id,
                name,
                price,
                description,
                image
            }
        });
    }

    return (
        <div onClick={handleClick} className='food-item'>
            <div className="food-item-img-container">
                <img className='food-item-image' src={image} alt={name} />
                {
                    !cartItems[id] ?
                        <img className='add' onClick={() => addToCart(id)} src={assets.add_icon_white} />
                        : <div className='food-item-counter'>
                            <img onClick={() => handleDecrement(id)} src={assets.remove_icon_red} />
                            <p>{cartItems[id]}</p>
                            <img onClick={() => handleIncrement(id)} src={assets.add_icon_green} />
                        </div>
                }
            </div>
            <div className='food-item-info'>
                <div className='food-item-name-rating'>
                    <p>{name}</p>
                    <img src={assets.rating_starts} alt="Rating stars" />
                </div>
                <p className='food-item-desc'>{truncateDescription(description, 12)}</p>
                <p className='food-item-price'>₹{price}</p>
            </div>
        </div>
    )
}

export default FoodItem;
