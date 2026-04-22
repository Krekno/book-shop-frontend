import React, { useEffect, useState } from "react"
import "bootstrap/dist/css/bootstrap.min.css"
import axios from "axios"
import { useNavigate } from "react-router-dom"

function AuthPage({ setIsLoggedIn, setRole, api }) {
	const [activeTab, setActiveTab] = useState("login")
	const [loginData, setLoginData] = useState({ email: "", password: "" })
	const [registerData, setRegisterData] = useState({ username: "", email: "", password: "", confirmPassword: "" })
	const [error, setError] = useState("")
	const navigate = useNavigate()

	const handleLogin = async (e) => {
		e.preventDefault()
		if (!loginData.email || !loginData.password) {
			setError("Please fill in all login fields!")
			return
		}

		try {
			const response = await axios.post(
				`${api}/auth/login`,
				{
					email: loginData.email,
					password: loginData.password
				},
				{}
			)
			if (response.status === 200) {
				const data = response.data
				localStorage.setItem("token", data.token)
				setIsLoggedIn(true)
				const token = JSON.parse(atob(data.token.split(".")[1]))
				setRole(token.role)
				navigate("/")
			}
		} catch (err) {
			console.error(err)
			setError(err.response?.data?.message || "Login failed!")
		}
	}

	const handleRegister = async (e) => {
		e.preventDefault()
		if (!registerData.email || !registerData.password || !registerData.confirmPassword) {
			setError("Please fill in all register fields!")
			return
		}
		if (registerData.password !== registerData.confirmPassword) {
			setError("Passwords do not match!")
			return
		}

		try {
			const response = await axios.post(`${api}/auth/register`, {
				username: registerData.username,
				email: registerData.email,
				password: registerData.password
			})

			if (response.status === 200) {
				const data = response.data
				localStorage.setItem("token", data.token)
				setIsLoggedIn(true)
				const token = JSON.parse(atob(data.token.split(".")[1]))
				setRole(token.role)
				navigate("/")
			}
		} catch (err) {
			console.error(err)
			setError(err.response?.data?.message || "Registration failed!")
		}
	}

	return (
		<div className="container mt-5">
			<div className="row justify-content-center">
				<div className="col-md-6">
					<div className="card shadow">
						<div className="card-body">
							<ul className="nav nav-tabs mb-3">
								<li className="nav-item">
									<button
										className={`nav-link ${activeTab === "login" ? "active" : ""}`}
										onClick={() => {
											setActiveTab("login")
											setError("")
										}}>
										Login
									</button>
								</li>
								<li className="nav-item">
									<button
										className={`nav-link ${activeTab === "register" ? "active" : ""}`}
										onClick={() => {
											setActiveTab("register")
											setError("")
										}}>
										Register
									</button>
								</li>
							</ul>

							{error && <div className="alert alert-danger">{error}</div>}

							{activeTab === "login" ? (
								<form onSubmit={handleLogin}>
									<div className="mb-3">
										<label className="form-label">Email</label>
										<input
											type="email"
											className="form-control"
											value={loginData.email}
											onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
										/>
									</div>
									<div className="mb-3">
										<label className="form-label">Password</label>
										<input
											type="password"
											className="form-control"
											value={loginData.password}
											onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
										/>
									</div>
									<button type="submit" className="btn btn-primary w-100">
										Login
									</button>
								</form>
							) : (
								<form onSubmit={handleRegister}>
									<div className="mb-3">
										<label className="form-label">Username</label>
										<input
											type="username"
											className="form-control"
											value={registerData.username}
											onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
										/>
									</div>
									<div className="mb-3">
										<label className="form-label">Email</label>
										<input
											type="email"
											className="form-control"
											value={registerData.email}
											onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
										/>
									</div>
									<div className="mb-3">
										<label className="form-label">Password</label>
										<input
											type="password"
											className="form-control"
											value={registerData.password}
											onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
										/>
									</div>
									<div className="mb-3">
										<label className="form-label">Confirm Password</label>
										<input
											type="password"
											className="form-control"
											value={registerData.confirmPassword}
											onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
										/>
									</div>
									<button type="submit" className="btn btn-success w-100">
										Register
									</button>
								</form>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default AuthPage
