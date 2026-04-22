import axios from "axios"
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"

const Profile = ({ setIsLoggedIn, setRole, api }) => {
	const navigate = useNavigate()

	const [formData, setFormData] = useState({
		email: "",
		password: ""
	})

	const [message, setMessage] = useState("")

	const handleChange = (e) => {
		const { name, value } = e.target
		setFormData((prev) => ({ ...prev, [name]: value }))
	}

	const handleSubmit = async (e) => {
		e.preventDefault()

		console.log("Form Data:", formData)

		if (!formData.email || !formData.password) {
			setMessage("Both email and password are required.")
			return
		}

		try {
			const response = await axios.put(`${api}/user/update-profile`, formData, {
				headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
			})

			if (response.status === 200) {
				const loginResponse = await axios.post(`${api}/auth/login`, {
					email: formData.email,
					password: formData.password
				})

				if (loginResponse.status === 200) {
					localStorage.setItem("token", loginResponse.data.token)
					setIsLoggedIn(true)
					setRole(loginResponse.data.role)
				}
				setFormData({ email: "", password: "" })
				setMessage("Credentials updated successfully!")
			} else {
				const error = await response.json()
				setMessage(error.message || "Something went wrong.")
			}
		} catch (err) {
			setMessage("Server error. Try again later.")
		}
	}

	const handleLogout = () => {
		localStorage.removeItem("token")
		setIsLoggedIn(false)
		setRole("")
		navigate("/login")
	}

	return (
		<div className="container mt-5">
			<div className="card mx-auto" style={{ maxWidth: "500px" }}>
				<div className="card-body">
					<h3 className="card-title text-center mb-4">Update Your Info</h3>
					<form onSubmit={handleSubmit}>
						<div className="mb-3">
							<label htmlFor="email" className="form-label">
								New Email
							</label>
							<input
								type="email"
								className="form-control"
								id="email"
								name="email"
								value={formData.email}
								onChange={handleChange}
								placeholder="Enter new email"
							/>
						</div>
						<div className="mb-4">
							<label htmlFor="password" className="form-label">
								New Password
							</label>
							<input
								type="password"
								className="form-control"
								id="password"
								name="password"
								value={formData.password}
								onChange={handleChange}
								placeholder="Enter new password"
							/>
						</div>
						<button type="submit" className="btn btn-primary w-100 mb-2">
							Update Credentials
						</button>
					</form>
					<button onClick={handleLogout} className="btn btn-danger w-100">
						Log Out
					</button>
					{message && (
						<div className="alert alert-info text-center mt-3" role="alert">
							{message}
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default Profile
