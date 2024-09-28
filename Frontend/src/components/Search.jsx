import React, { useState, useContext, useEffect } from 'react';
import '../styles/SearchPage.css';
import { StoreContext } from '../context/StoreContext';
import FoodItem from './FoodItem';
import { assets } from '../assets/frontend_assets/assets';
import { motion } from 'framer-motion'; // Optional for animations

const Search = ({ setShowSearch }) => {
    const { food_list } = useContext(StoreContext);
    const [searchInput, setSearchInput] = useState("");
    const [filteredFood, setFilteredFood] = useState(food_list);

    useEffect(() => {
        if (searchInput) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [searchInput]);

    const handleInputChange = (e) => {
        setSearchInput(e.target.value);
    };

    const clearSearch = () => {
        setSearchInput("");
        setShowSearch(false);
    };

    useEffect(() => {
        const lowercasedInput = searchInput.toLowerCase().replace(/\s+/g, '');
        const filtered = food_list.filter((item) => 
            item.name.toLowerCase().replace(/\s+/g, '').includes(lowercasedInput) || 
            item.category.toLowerCase().includes(lowercasedInput)
        );
        setFilteredFood(filtered);
    }, [searchInput, food_list]);

    // Handle click on food item
    const handleFoodItemClick = (item) => {
        // Handle the item click logic here, like navigating or showing item details
        console.log("Item clicked:", item);
        setShowSearch(false); // Close search when item is clicked
    };

    return (
        <div className='search'>
            <div className='search-container'>
                <div className="search-title">
                    <h2>Search Food</h2>
                    <img 
                        onClick={clearSearch} 
                        src={assets.cross_icon} 
                        alt='Clear' 
                        className='clear-icon'
                    />
                </div>

                <input
                    type='text'
                    value={searchInput}
                    onChange={handleInputChange}
                    placeholder='Search food...'
                    className='search-input'
                />

                <div className='food-display'>
                    {filteredFood.length > 0 ? (
                        <div className='food-list'>
                            {filteredFood.map((item) => (
                                    <FoodItem 
                                        id={item._id}
                                        name={item.name}
                                        description={item.description}
                                        price={item.price}
                                        image={item.image}
                                    />
                            ))}
                        </div>
                    ) : (
                        <p>No food items found matching your search.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Search;
