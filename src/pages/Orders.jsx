import React, { useEffect, useState } from "react"
import axios from "axios"

export default function Orders({ role, api }) {
	const [orders, setOrders] = useState([])

	const endpoint =
		role === "ROLE_ADMIN"
			? `${api}/api/order/admin/getOrders`
			: `${api}/api/order/getOrders`

	useEffect(() => {
		const getOrders = async () => {
			try {
				const response = await axios.get(endpoint)
				if (response.status === 200) {
					setOrders(response.data)
					console.log("Orders fetched successfully:", response.data)
				}
			} catch (error) {
				console.error("Error fetching orders:", error)
			}
		}

		getOrders()
	}, [endpoint, role])

	const handleApprove = async (id) => {
		try {
			await axios.patch(
				`${api}/api/order/admin/approve/${id}`
			)
			setOrders((prevOrders) => prevOrders.map((order) => (order.id === id ? { ...order, status: "APPROVED" } : order)))
		} catch (error) {
			console.error(`Error updating status for order ${id}:`, error)
		}
	}

	const handleReject = async (id) => {
		try {
			await axios.patch(
				`${api}/api/order/admin/cancel/${id}`
			)
			setOrders((prevOrders) => prevOrders.map((order) => (order.id === id ? { ...order, status: "CANCELLED" } : order)))
		} catch (error) {
			console.error(`Error updating status for order ${id}:`, error)
		}
	}

	return (
		<div className="container py-5">
			<h1 className="mb-4 fw-bold">📚 Your Orders</h1>

			{orders.length === 0 ? (
				<div className="alert alert-info">No orders found.</div>
			) : (
				<div className="row g-4">
					{[...orders]
						.sort((a, b) => (a.status === "PENDING" ? -1 : b.status === "PENDING" ? 1 : 0))
						.map((order) => (
							<div className="col-md-6" key={order.id}>
								<div className="card h-100">
									<div className="card-body">
										<div className="d-flex justify-content-between mb-2">
											<div>
												<h5 className="card-title">Order #{order.id}</h5>
												<p className="text-muted small mb-1">Date: {new Date(order.date).toLocaleString()}</p>
											</div>
											<span className="badge bg-secondary align-self-start">{order.status}</span>
										</div>

										<h6 className="mt-3">Items:</h6>
										<ul className="list-group list-group-flush mb-3">
											{order.orderItems.map((item) => (
												<li key={item.id} className="list-group-item px-0 py-1">
													{item.book.name} - {item.quantity} x ₺{item.price} = ₺{(item.quantity * item.price).toFixed(2)}
												</li>
											))}
										</ul>
										<p className="fw-bold text-end mb-3">Total: ₺{order.price.toFixed(2)}</p>

										{/* Admin Buttons */}
										{role === "ROLE_ADMIN" && order.status === "PENDING" && (
											<div className="d-flex justify-content-end gap-2">
												<button className="btn btn-success btn-sm" onClick={() => handleApprove(order.id)}>
													✅ Approve
												</button>
												<button className="btn btn-danger btn-sm" onClick={() => handleReject(order.id)}>
													❌ Reject
												</button>
											</div>
										)}
									</div>
								</div>
							</div>
						))}
				</div>
			)}
		</div>
	)
}
