# Book Shop Frontend

A modern, responsive e-commerce web application built with React and Vite. This frontend application integrates with a Spring Boot backend to provide a complete book shopping experience, featuring user authentication, cart management, order processing, and a full admin panel for inventory and order management.

## Features

### Public Features
- **Browse Books:** View all available books with details like price, author, genre, and stock.
- **Product Details:** View specific details for individual books.

### User Features
- **Authentication:** Secure signup and signin using HTTP-only cookies.
- **Shopping Cart:** Add, remove, and update book quantities in the cart.
- **Checkout:** Seamless order placement from the cart.
- **Order History:** View past orders and their current status (Pending, Approved, Cancelled).
- **Profile Management:** Update account credentials (email, username, password).

### Admin Features
- **Inventory Management:** Add new books, update existing book details, and delete books from the inventory.
- **Order Management:** View all customer orders and manage their fulfillment status (Approve or Cancel).

## Technology Stack

- **Framework:** [React 19](https://react.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Routing:** [React Router v7](https://reactrouter.com/)
- **Styling:** Vanilla CSS & [Bootstrap 5](https://getbootstrap.com/)
- **HTTP Client:** [Axios](https://axios-http.com/) (configured for cross-origin cookies)

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn
- The accompanying Spring Boot backend running locally or deployed.

### Installation

1. Clone the repository (or download the source):
   ```bash
   git clone <repository-url>
   cd book-shop-frontend
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to the URL provided by Vite (usually `http://localhost:5173`).

### Configuration

The backend API URL is configured in `src/App.jsx`. By default, it points to `http://localhost:8080`. If your backend is hosted elsewhere, update the `api` constant accordingly:
```javascript
const api = "http://localhost:8080" // Update to your backend URL
```

## Available Scripts

- `npm run dev`: Starts the development server with hot-module replacement.
- `npm run build`: Bundles the app into static files for production.
- `npm run preview`: Bootstraps a local web server to preview the production build.
- `npm run lint`: Runs ESLint to check for code quality and syntax issues.

## Project Structure

```text
src/
├── assets/         # Static assets like images and icons
├── components/     # Reusable UI components (Navbar, etc.)
├── pages/          # Full page components representing distinct routes
│   ├── AdminPanel.jsx
│   ├── Cart.jsx
│   ├── Checkout.jsx
│   ├── Login.jsx
│   ├── Orders.jsx
│   ├── ProductDetail.jsx
│   ├── ProductListing.jsx
│   └── Profile.jsx
├── App.jsx         # Main application component and routing setup
├── CartContext.jsx # Global state management for the shopping cart
├── main.jsx        # Entry point for React and global configurations
└── index.css       # Global styles
```

## Security & Authentication

This application uses **HTTP-only cookies** for authentication. Instead of storing JWTs in `localStorage`, the frontend relies on the browser to automatically include the secure authentication cookie in API requests to the backend. Axios is globally configured with `withCredentials: true` in `main.jsx` to facilitate this process. Session validation is done on application load by calling the `/api/auth/me` endpoint.

## License

This project is open-source and available under the [MIT License](LICENSE).
