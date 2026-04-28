# API Endpoints Documentation

Here is a comprehensive list of all the API endpoints defined in the backend, grouped by their respective controllers, along with what they expect and what they return:

## 1. Authentication (`/api/auth`)

_Handles user registration, login, session management, and profile updates._

- **`POST /api/auth/signup`**
    - **Expects:** JSON body (`SignupRequest` with `username`, `email`, `password`).
    - **Returns:** `200 OK` with string `"User registered successfully!"`
- **`POST /api/auth/signin`**
    - **Expects:** JSON body (`LoginRequest` with `email`, `password`).
    - **Returns:** `200 OK` with string `"User signed in successfully!"` and a `Set-Cookie` header containing the authentication JWT.
- **`PATCH /api/auth/update`**
    - **Expects:** JSON body (`SignupRequest`) with updated user fields.
    - **Returns:** `200 OK` with string `"User updated successfully!"` and a `Set-Cookie` header with a newly generated JWT.
- **`POST /api/auth/refresh`**
    - **Expects:** Existing valid refresh token/cookie.
    - **Returns:** `200 OK` with string `"Token is refreshed successfully!"` and a new `Set-Cookie` JWT header.
- **`POST /api/auth/signout`**
    - **Expects:** Nothing.
    - **Returns:** `200 OK` with string `"You've been signed out!"` and a `Set-Cookie` header instructing the browser to delete the JWT.
- **`GET /api/auth/me`**
    - **Expects:** Valid authentication cookie.
    - **Returns:** `200 OK` with a JSON object containing the current user's details (id, username, email, role). Returns `401 Unauthorized` if not logged in.

---

## 2. Books (`/api/books`)

_Handles the inventory of books. Write operations are protected for Admin use._

- **`GET /api/books/all`**
    - **Expects:** Nothing (Public).
    - **Returns:** `200 OK` with a JSON list of `Book` objects that are currently _in stock_.
- **`GET /api/books/all/admin`**
    - **Expects:** Admin authentication.
    - **Returns:** `200 OK` with a JSON list of _all_ `Book` objects, including out-of-stock items.
- **`POST /api/books/saveBook`**
    - **Expects:** JSON body (`BookRequestDto`). Admin only.
    - **Returns:** `200 OK` with the newly created `Book` JSON object.
- **`PATCH /api/books/update/{id}`**
    - **Expects:** Book ID in the URL path, JSON body (`BookRequestDto`). Admin only.
    - **Returns:** `200 OK` with string `"Book updated successfully!"`
- **`DELETE /api/books/{id}`**
    - **Expects:** Book ID in the URL path. Admin only.
    - **Returns:** `200 OK` with string `"Book deleted successfully!"`

---

## 3. Shopping Cart (`/api/cart`)

_Handles adding/removing items from the user's active shopping cart._

- **`GET /api/cart/getCart`**
    - **Expects:** Authenticated user.
    - **Returns:** `200 OK` with a JSON list of `CartItem` objects. Returns `404 Not Found` if the cart is empty.
- **`POST /api/cart/add/{bookId}`**
    - **Expects:** Book ID in the URL path. Authenticated user.
    - **Returns:** `200 OK` with string `"Added to cart"`
- **`PUT /api/cart/remove/{bookId}`**
    - **Expects:** Book ID in the URL path. Authenticated user.
    - **Returns:** `200 OK` with string `"Removed from cart"`

---

## 4. Orders (`/api/order`)

_Handles checkout and order management._

- **`POST /api/order/place`**
    - **Expects:** Authenticated user (processes the current user's cart).
    - **Returns:** `200 OK` (empty response body).
- **`GET /api/order/getOrders`**
    - **Expects:** Authenticated user.
    - **Returns:** `200 OK` with a JSON list of `Order` objects belonging to the current user.
- **`GET /api/order/admin/getOrders`**
    - **Expects:** Admin authentication.
    - **Returns:** `200 OK` with a JSON list of _all_ `Order` objects in the database.
- **`PATCH /api/order/admin/approve/{id}`**
    - **Expects:** Order ID in the URL path. Admin only.
    - **Returns:** `200 OK` (empty response body) after updating the order status to `APPROVED`.
- **`PATCH /api/order/admin/cancel/{id}`**
    - **Expects:** Order ID in the URL path. Admin only.
    - **Returns:** `200 OK` (empty response body) after updating the order status to `CANCELLED`.

@Data
public class BookRequestDto {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Author is required")
    private String author;

    private String genre;
    private String description;
    private String image;
    private String isbn;
    private String publisher;
    private String language;
    private Date year;

    @Positive(message = "Pages must be a positive number")
    private int pages;

    @Positive(message = "Price must be a positive number")
    private float price;

    @PositiveOrZero(message = "Stock cannot be negative")
    private int stock;

}

@Data
public class SignupRequest {

    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    private String username;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

}

@Data
public class LoginRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

}
