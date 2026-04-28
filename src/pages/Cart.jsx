import React from "react"
import { useContext } from "react"
import { CartContext } from "../CartContext"
import { useEffect, useState } from "react"
import axios from "axios"

const Cart = ({ setCartItems, api }) => {
	const { cartItems, removeFromCart } = useContext(CartContext)

	const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)

	const handleOrder = async () => {
		try {
			const response = await axios.post(
				`${api}/api/order/place`
			)
			alert("Order successful! Thank you for your purchase.")
			setCartItems([])
		} catch (error) {
			console.error("Error during order:", error)
			alert("Order failed. Please try again.")
		}
	}

	return (
		<div className="container mt-5">
			<h1 className="mb-4">🛒 Your Cart</h1>

			{cartItems.length === 0 ? (
				<p className="alert alert-info">Your cart is empty.</p>
			) : (
				<>
					<div className="row g-4">
						{cartItems.map((item) => (
							<div key={item.isbn} className="col-md-6">
								<div className="card h-100 shadow-sm">
									<div className="row g-0">
										<div className="col-4">
											<img src={item.image} alt={item.name} className="img-fluid rounded-start" />
										</div>
										<div className="col-8">
											<div className="card-body">
												<h5 className="card-title">{item.name}</h5>
												<p className="card-text">
													₺{item.price} × {item.quantity}
												</p>
												<button className="btn btn-outline-danger btn-sm" onClick={() => removeFromCart(item.isbn)}>
													Remove
												</button>
											</div>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>

					<hr className="my-4" />

					<div className="d-flex justify-content-between align-items-center">
						<h4>Total: ₺{total.toFixed(2)}</h4>
						<button className="btn btn-primary btn-lg" onClick={handleOrder}>
							Order
						</button>
					</div>
				</>
			)}
		</div>
	)
}

export default Cart
