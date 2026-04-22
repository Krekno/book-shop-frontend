import React from "react"
import axios from "axios"
import { createContext, useState } from "react"

export const CartContext = createContext()

export const CartProvider = ({ children, isLoggedIn, cartItems, setCartItems, api }) => {
	const addToCart = async (product) => {
		if (isLoggedIn === false) {
			alert("Please log in to add items to the cart")
			return
		}

		try {
			await axios.post(
				`${api}/cart/add?isbn=${product.isbn}&quantity=${1}`,
				{},
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`
					}
				}
			)
		} catch (error) {
			alert("Error adding to cart")
			console.error("Error adding to cart:", error)
		}

		if (cartItems.some((item) => item.isbn === product.isbn)) {
			setCartItems(cartItems.map((item) => (item.isbn === product.isbn ? { ...item, quantity: item.quantity + 1 } : item)))
			return
		}

		setCartItems([...cartItems, { ...product, quantity: 1 }])
	}

	const removeFromCart = async (isbn) => {
		try {
			await axios.post(
				`${api}/cart/remove?isbn=${isbn}`,
				{},
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`
					}
				}
			)
			setCartItems(
				cartItems.map((item) => (item.isbn === isbn ? { ...item, quantity: item.quantity - 1 } : item)).filter((item) => item.quantity > 0)
			)
		} catch (error) {
			alert("Error removing from cart")
			console.error("Error removing from cart:", error)
		}
	}

	return <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>{children}</CartContext.Provider>
}
