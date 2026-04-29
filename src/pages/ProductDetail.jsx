import React from "react"
import { useParams } from "react-router-dom"
import { useContext } from "react"
import { CartContext } from "../CartContext"

const ProductDetail = ({ books }) => {
	const { id } = useParams()
	const { addToCart } = useContext(CartContext)
	const book = books.find((p) => String(p.isbn) === String(id))

	return (
		<div className="container mt-5">
			<div className="row">
				{/* Product Image Section */}
				<div className="col-md-6 mb-4">
					<div className="image-gallery">
						<img src={book.image} alt={book.name} className="img-fluid rounded" />
					</div>
				</div>

				{/* Product Info Section */}
				<div className="col-md-6">
					<div className="card h-100 shadow-sm">
						<div className="card-body">
							<h1 className="card-title">{book.name}</h1>
							<h5 className="card-subtitle mb-2 text-muted">{book.author}</h5>
							<h6 className="card-subtitle mb-2 text-muted">{book.publisher}</h6>
							<h6 className="card-subtitle mb-2 text-muted">{book.genre}</h6>
							<p className="card-text text-muted">₺{book.price}</p>
							<p className="card-text">{book.description}</p>
							<p className="card-text">Stock: {book.stock}</p>
							<p className="card-text">Isbn: {book.isbn}</p>
							<button className="btn btn-primary w-100" onClick={() => addToCart(book)}>
								Add to Cart
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ProductDetail
