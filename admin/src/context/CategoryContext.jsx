import React, { createContext, useContext, useState, useEffect } from 'react';
import { categoriesAPI } from '../api/categoryAPI';

const CategoryContext = createContext();

export const useCategories = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategories must be used within a CategoryProvider');
  }
  return context;
};

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoriesAPI.getAllCategories();
      setCategories(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch categories');
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add a new category
  const addCategory = async (categoryData) => {
    try {
      const response = await categoriesAPI.createCategory(categoryData);
      setCategories([...categories, response.data]);
      return response.data;
    } catch (err) {
      setError('Failed to add category');
      console.error('Error adding category:', err);
      throw err;
    }
  };

  // Update an existing category
  const updateCategory = async (updatedCategory) => {
    try {
      const response = await categoriesAPI.updateCategory(updatedCategory._id, updatedCategory);
      setCategories(categories.map(category => 
        category._id === updatedCategory._id ? response.data : category
      ));
      return response.data;
    } catch (err) {
      setError('Failed to update category');
      console.error('Error updating category:', err);
      throw err;
    }
  };

  // Delete a category
  const deleteCategory = async (categoryId) => {
    try {
      await categoriesAPI.deleteCategory(categoryId);
      setCategories(categories.filter(category => category._id !== categoryId));
    } catch (err) {
      setError('Failed to delete category');
      console.error('Error deleting category:', err);
      throw err;
    }
  };

  // Refresh categories
  const refreshCategories = () => {
    fetchCategories();
  };

  // Load categories on initial render
  useEffect(() => {
    fetchCategories();
  }, []);

  const value = {
    categories,
    loading,
    error,
    addCategory,
    updateCategory,
    deleteCategory,
    refreshCategories
  };

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
};