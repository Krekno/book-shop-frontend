import React from "react"
import { HashRouter as Router, Routes, Route } from "react-router-dom"
import { CartProvider } from "./CartContext"
import { useState, useEffect } from "react"
import axios from "axios"
import Navbar from "./components/Navbar"
import ProductListing from "./pages/ProductListing"
import ProductDetail from "./pages/ProductDetail"
import Cart from "./pages/Cart"
import Checkout from "./pages/Checkout"
import Login from "./pages/Login"
import Profile from "./pages/Profile"
import AdminPanel from "./pages/AdminPanel"
import Orders from "./pages/Orders"

function App() {
	const api = "http://localhost:8080"
	const [isLoggedIn, setIsLoggedIn] = useState(false)
	const [role, setRole] = useState("")
	const [books, setBooks] = useState([])
	const [categories, setCategories] = useState([])
	const [cartItems, setCartItems] = useState([])
	const [roleLoaded, setRoleLoaded] = useState(false)

	useEffect(() => {
		const checkSession = async () => {
			try {
				const response = await axios.get(`${api}/api/auth/me`)
				if (response.status === 200) {
					setIsLoggedIn(true)
					const userRoles = response.data.roles || []
					setRole(userRoles.includes("ROLE_ADMIN") ? "ROLE_ADMIN" : userRoles[0] || "")
				}
			} catch (error) {
				setIsLoggedIn(false)
				setRole("")
			} finally {
				setRoleLoaded(true)
			}
		}
		checkSession()
	}, [])

	useEffect(() => {
		const fetchBooks = async () => {
			try {
				const endpoint =
					role === "ROLE_ADMIN"
						? `${api}/api/books/all/admin`
						: `${api}/api/books/all`

				const response = await axios.get(endpoint)

				const data = response.data
				setBooks(data)

				const uniqueCategories = [...new Set(data.map((book) => book.genre))]
				setCategories(uniqueCategories)
			} catch (error) {
				console.error("Error fetching books:", error)
			}
		}

		if (roleLoaded) {
			fetchBooks()
		}
	}, [role, roleLoaded])

	useEffect(() => {
		const fetchCart = async () => {
			if (!isLoggedIn) {
				setCartItems([])
				return
			}
			try {
				const response = await axios.get(`${api}/api/cart/getCart`)

				const data = response.data
				const books = data.map((item) => ({
					id: item.book.id,
					isbn: item.book.isbn,
					name: item.book.name,
					price: item.book.price,
					image: item.book.image,
					quantity: item.quantity
				}))

				setCartItems(books)
			} catch (error) {
				console.error("Error fetching cart:", error)
			}
		}

		fetchCart()
	}, [isLoggedIn])

	return (
		<CartProvider isLoggedIn={isLoggedIn} cartItems={cartItems} setCartItems={setCartItems} api={api}>
			<Router>
				<Navbar isLoggedIn={isLoggedIn} role={role} cartItems={cartItems} />
				<Routes>
					<Route path="/" element={<ProductListing books={books} categories={categories} />} />
					<Route path="/products/:id" element={<ProductDetail books={books} />} />
					<Route path="/cart" element={<Cart setCartItems={setCartItems} api={api} />} />
					<Route path="/checkout" element={<Checkout />} />
					<Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setRole={setRole} api={api} />} />
					<Route path="/profile" element={<Profile setIsLoggedIn={setIsLoggedIn} setRole={setRole} api={api} />}></Route>
					<Route path="/admin" element={<AdminPanel api={api} />} />
					<Route path="/orders" element={<Orders role={role} api={api} />} />
				</Routes>
			</Router>
		</CartProvider>
	)
}

export default App
