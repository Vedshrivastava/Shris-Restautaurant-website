import React, { useState, useEffect } from 'react';
import '../styles/list-categories.css'; // Ensure this is the updated CSS file
import axios from 'axios';
import { toast } from 'react-toastify';
import '../index.css';

const ListCategory = ({ url }) => {
    const [categories, setCategories] = useState([]);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${url}/api/category/get-categories`);
            if (response.data.success) {
                setCategories(response.data.categories);
            } else {
                toast.error(response.data.message || 'Failed to fetch categories.');
            }
        } catch (error) {
            toast.error('An error occurred while fetching categories.');
        }
    };

    const removeCategory = async (categoryId) => {
        try {
            const response = await axios.delete(`${url}/api/category/remove`, {
                data: { _id: categoryId }
            });
            if (response.data.success) {
                await fetchCategories();
                toast.success('Category removed successfully.');
            } else {
                toast.error(response.data.message || 'Failed to remove category.');
            }
        } catch (error) {
            toast.error('An error occurred while removing the category.');
        }
    };

    useEffect(() => {
        fetchCategories();
    }, [url]);

    return (
        <div className='list add flex-col'>
            <p>All Categories</p>
            <div className="category-list-table">
                <div className="category-list-table-format title">
                    <b>Image</b>
                    <b>Name</b>
                    <b>Action</b>
                </div>
                {categories.map((category) => (
                    <div key={category._id} className="category-list-table-format">
                        <img src={category.image} alt={category.name} />
                        <p>{category.name}</p>
                        <p onClick={() => removeCategory(category._id)} className='cursor'>X</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ListCategory;
