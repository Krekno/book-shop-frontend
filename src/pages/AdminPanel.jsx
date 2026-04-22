import React, { useState } from "react"
import axios from "axios"

export default function AdminPanel({ api }) {
	const [book, setBook] = useState({
		isbn: "",
		title: "",
		author: "",
		category: "",
		quantity: "",
		description: "",
		publisher: "",
		price: "",
		image: ""
	})

	const [currentIsbn, setCurrentIsbn] = useState("")

	const handleChange = (e) => {
		const { name, value } = e.target

		if (name === "current_isbn") {
			setCurrentIsbn(value)
		} else {
			setBook((prevBook) => ({
				...prevBook,
				[name]: value
			}))
		}
	}

	const handleAddSubmit = async (e) => {
		e.preventDefault()
		if (!book.isbn || !book.title || !book.author || !book.category || !book.quantity || !book.description || !book.publisher || !book.price) {
			alert("Please fill in all fields.")
			return
		}
		if (isNaN(book.isbn) || isNaN(book.quantity) || isNaN(book.price)) {
			alert("ISBN, Quantity, and Price must be numbers.")
			return
		}
		if (book.isbn.length !== 13) {
			alert("ISBN must be 13 digits long.")
			return
		}
		try {
			const response = await axios.post(`${api}/book/save-book`, book, {
				headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
			})

			if (response.status === 200) {
				setBook({
					isbn: "",
					title: "",
					author: "",
					category: "",
					quantity: "",
					description: "",
					publisher: "",
					price: "",
					image: ""
				})
			}
		} catch (error) {
			console.error("Error submitting book:", error)
			alert("Failed to submit book. Please try again.")
			return
		}
		console.log("Book submitted:", book)
		alert("Book submitted successfully!")
	}

	const handleUpdateSubmit = async (e) => {
		e.preventDefault()
		if (isNaN(book.isbn) || book.isbn.length !== 13) {
			alert("ISBN must be a 13-digit number.")
			return
		}
		try {
			const response = await axios.patch(`${api}/book/update-book/${currentIsbn}`, book, {
				headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
			})

			if (response.status === 200) {
				alert("Book updated successfully!")
			}
		} catch (error) {
			console.error("Error updating book:", error)
			alert("Failed to update book. Please try again.")
		}
	}

	const handleDeleteSubmit = async (e) => {
		e.preventDefault()
		if (!currentIsbn || isNaN(currentIsbn) || currentIsbn.length !== 13) {
			alert("Please enter a valid 13-digit ISBN.")
			return
		}
		try {
			const response = await axios.put(
				`${api}/book/delete-book/${currentIsbn}`,
				{},
				{
					headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
				}
			)
			if (response.status === 200) {
				alert("Book deleted successfully!")
				setCurrentIsbn("")
			}
		} catch (error) {
			console.error("Error deleting book:", error)
			alert("Failed to delete book. Please try again.")
		}
	}

	return (
		<div className="container mt-5">
			<div className="accordion" id="bookFormAccordion">
				{/* Add Book Accordion */}
				<div className="accordion-item">
					<h2 className="accordion-header" id="headingForm">
						<button
							className="accordion-button collapsed"
							type="button"
							data-bs-toggle="collapse"
							data-bs-target="#collapseForm"
							aria-expanded="false"
							aria-controls="collapseForm">
							➕ Add New Book
						</button>
					</h2>
					<div id="collapseForm" className="accordion-collapse collapse" aria-labelledby="headingForm" data-bs-parent="#bookFormAccordion">
						<div className="accordion-body">
							<div className="card shadow">
								<div className="card-header bg-primary text-white">
									<h3 className="mb-0">📘 Book Details</h3>
								</div>
								<div className="card-body">
									<form onSubmit={handleAddSubmit}>
										{[
											{ name: "isbn", label: "ISBN", type: "number" },
											{ name: "title", label: "Title" },
											{ name: "author", label: "Author" },
											{ name: "category", label: "Category" },
											{ name: "quantity", label: "Quantity", type: "number" },
											{ name: "description", label: "Description", type: "textarea" },
											{ name: "publisher", label: "Publisher" },
											{ name: "price", label: "Price", type: "number", step: "0.01" },
											{ name: "image", label: "Image URL" }
										].map(({ name, label, type = "text", step }) => (
											<div className="mb-3" key={name}>
												<label className="form-label">{label}</label>
												{type === "textarea" ? (
													<textarea
														name={name}
														value={book[name]}
														onChange={handleChange}
														className="form-control"
														rows={3}
													/>
												) : (
													<input
														type={type}
														name={name}
														step={step}
														value={book[name]}
														onChange={handleChange}
														className="form-control"
													/>
												)}
											</div>
										))}
										<button type="submit" className="btn btn-success w-100">
											➕ Add Book
										</button>
									</form>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Update Book Accordion */}
				<div className="accordion-item">
					<h2 className="accordion-header" id="headingUpdate">
						<button
							className="accordion-button collapsed"
							type="button"
							data-bs-toggle="collapse"
							data-bs-target="#collapseUpdate"
							aria-expanded="false"
							aria-controls="collapseUpdate">
							🛠️ Update Book
						</button>
					</h2>
					<div
						id="collapseUpdate"
						className="accordion-collapse collapse"
						aria-labelledby="headingUpdate"
						data-bs-parent="#bookFormAccordion">
						<div className="accordion-body">
							<div className="card shadow">
								<div className="card-header bg-warning text-dark">
									<h3 className="mb-0">✏️ Update Book Details</h3>
								</div>
								<div className="card-body">
									<form onSubmit={handleUpdateSubmit}>
										{[
											{ name: "current_isbn", label: "Current ISBN", type: "number" },
											{ name: "isbn", label: "ISBN", type: "number" },
											{ name: "title", label: "Title" },
											{ name: "author", label: "Author" },
											{ name: "category", label: "Category" },
											{ name: "quantity", label: "Quantity", type: "number" },
											{ name: "description", label: "Description", type: "textarea" },
											{ name: "publisher", label: "Publisher" },
											{ name: "price", label: "Price", type: "number", step: "0.01" },
											{ name: "image", label: "Image URL" }
										].map(({ name, label, type = "text", step }) => (
											<div className="mb-3" key={name}>
												<label className="form-label">{label}</label>
												{type === "textarea" ? (
													<textarea
														name={name}
														value={book[name]}
														onChange={handleChange}
														className="form-control"
														rows={3}
													/>
												) : (
													<input
														type={type}
														name={name}
														step={step}
														value={book[name]}
														onChange={handleChange}
														className="form-control"
													/>
												)}
											</div>
										))}
										<button type="submit" className="btn btn-warning w-100">
											🛠️ Update Book
										</button>
									</form>
								</div>
							</div>
						</div>
					</div>
				</div>
				{/* Delete Book Accordion */}
				<div className="accordion-item">
					<h2 className="accordion-header" id="headingDelete">
						<button
							className="accordion-button collapsed"
							type="button"
							data-bs-toggle="collapse"
							data-bs-target="#collapseDelete"
							aria-expanded="false"
							aria-controls="collapseDelete">
							🗑️ Delete Book
						</button>
					</h2>
					<div
						id="collapseDelete"
						className="accordion-collapse collapse"
						aria-labelledby="headingDelete"
						data-bs-parent="#bookFormAccordion">
						<div className="accordion-body">
							<div className="card shadow">
								<div className="card-header bg-danger text-white">
									<h3 className="mb-0">⚠️ Delete Book</h3>
								</div>
								<div className="card-body">
									<form onSubmit={handleDeleteSubmit}>
										<div className="mb-3">
											<label className="form-label">Enter ISBN to Delete</label>
											<input
												type="number"
												name="current_isbn"
												value={currentIsbn}
												onChange={handleChange}
												className="form-control"
											/>
										</div>
										<button type="submit" className="btn btn-danger w-100">
											🗑️ Delete Book
										</button>
									</form>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
