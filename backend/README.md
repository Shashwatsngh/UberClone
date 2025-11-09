# Backend API Documentation

## POST /users/register

Create a new user account.

### Description

- Registers a user with name, email, and password.
- Returns a JWT token on success.
- Requires JSON payload (Content-Type: application/json).
- Environment: requires `JWT_SECRET` to be set (used to sign the token).

### Request Body

Provide a JSON object with the following shape:

```
{
  "fullname": {
    "firstname": "string (min 3, required)",
    "lastname": "string (min 3, required)"
  },
  "email": "valid email (required)",
  "password": "string (min 6, required)"
}
```

Validation rules (from the route validators):

- `fullname.firstname`: required, string, minimum length 3
- `fullname.lastname`: required, string, minimum length 3
- `email`: required, must be a valid email
- `password`: required, minimum length 6

Example:

```
POST /users/register
Content-Type: application/json

{
  "fullname": { "firstname": "Alice", "lastname": "Smith" },
  "email": "alice@example.com",
  "password": "supersecret"
}
```

### Example cURL

```
curl -X POST \
  http://localhost:4000/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": { "firstname": "Alice", "lastname": "Smith" },
    "email": "alice@example.com",
    "password": "supersecret"
  }'
```

### Responses

- 201 Created
  - On success, returns a message, the created user document, and a JWT token.
  - Example:

```
{
  "message": "User registered successfully",
  "user": {
    "_id": "<mongo-id>",
    "fullname": { "firstname": "Alice", "lastname": "Smith" },
    "email": "alice@example.com",
    // other user fields...
  },
  "token": "<jwt-token>"
}
```

- 400 Bad Request
  - When request validation fails (from express-validator) or required fields are missing.
  - Example (validation):

```
{
  "errors": [
    {
      "type": "field",
      "msg": "First name must be at least 3 characters long",
      "path": "fullname.firstname",
      "location": "body"
    }
  ]
}
```

- Example (service-level check):

```
{
  "error": "All fields are required"
}
```

- 500 Internal Server Error
  - For unexpected server errors (e.g., database errors, missing `JWT_SECRET`, duplicate key errors not explicitly handled).
  - Example:

```
{
  "error": "Failed to register user"
}
```

## POST /users/login

Authenticate an existing user and receive a JWT token for subsequent authenticated requests.

### Description

- Logs a user in using email and password.
- Returns a JWT token on success which can be used for authenticated routes.
- Requires JSON payload (Content-Type: application/json).
- Validation: `email` must be a valid email, `password` must be provided.

### Request Body

Provide a JSON object with the following shape:

```
{
  "email": "valid email (required)",
  "password": "string (required)"
}
```

Validation rules (from the route validators):

- `email`: required, must be a valid email
- `password`: required, must not be empty

Example:

```
POST /users/login
Content-Type: application/json

{
  "email": "alice@example.com",
  "password": "supersecret"
}
```

### Example cURL

```
curl -X POST \
  http://localhost:4000/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "supersecret"
  }'
```

### Responses

- 200 OK
  - On success, returns a message, the user document (password omitted by default), and a JWT token.
  - Example:

```
{
  "message": "Login successful",
  "user": {
    "_id": "<mongo-id>",
    "fullname": { "firstname": "Alice", "lastname": "Smith" },
    "email": "alice@example.com",
    // other user fields (password is not returned by default)
  },
  "token": "<jwt-token>"
}
```

- 400 Bad Request
  - When request validation fails (from express-validator) or required fields are missing.
  - Example:

```
{
  "errors": [
    {
      "msg": "Invalid email address",
      "param": "email",
      "location": "body"
    }
  ]
}
```

- 401 Unauthorized
  - When credentials are invalid (wrong email or password).
  - Example:

```
{
  "message": "Invalid email or password"
}
```

- 500 Internal Server Error
  - For unexpected server errors (e.g., database errors, missing `JWT_SECRET`).
  - Example:

```
{
  "error": "Failed to login user"
}
```

### Notes

- Ensure the server is running and the base URL is correct (e.g., `http://localhost:4000`).
- `email` field is unique at the database level; duplicate emails may result in a server error unless handled by custom logic.
- Passwords are hashed before being stored.

## GET /users/profile

Fetch the authenticated user's profile.

### Description

- Protected route. Requires a valid JWT.
- Token can be provided via Authorization header or HttpOnly cookie.
- Returns the user document associated with the token.

### Headers

- Authorization: Bearer <jwt-token> (if using header-based auth), or
- Cookie: token=<jwt-token> (if the server set an HttpOnly cookie on login)

### Example Request

```
GET /users/profile
Authorization: Bearer <jwt-token>
```

### Example cURL

```
curl -X GET \
  http://localhost:4000/users/profile \
  -H "Authorization: Bearer <jwt-token>"
```

If you're using the cookie token instead of the header, you can send:

```
curl -X GET \
  http://localhost:4000/users/profile \
  -H "Cookie: token=<jwt-token>"
```

### Responses

- 200 OK
  - On success, returns the authenticated user's profile.

```
{
  "user": {
    "_id": "<mongo-id>",
    "fullname": { "firstname": "Alice", "lastname": "Smith" },
    "email": "alice@example.com"
    // other user fields...
  }
}
```

- 401 Unauthorized
  - When no token is provided, token is invalid/expired, or token is blacklisted.

```
{ "message": "Unauthorized" }
```

- 500 Internal Server Error
  - For unexpected errors while fetching the profile.

```
{ "message": "Server error" }
```

### Notes

- This route uses an authentication middleware that checks the blacklist and verifies the JWT before loading the user.
- If using cookies, make sure your client sends cookies with the request.

## GET /users/logout

Log out the current user by invalidating the current token and clearing the auth cookie.

### Description

- Protected route. Requires a valid JWT (in header or cookie).
- Adds the current token to a blacklist (revocation list) so it can't be used again.
- Clears the `token` cookie if present.

### Headers

- Authorization: Bearer <jwt-token> (or use the `token` cookie if set).

### Example Request

```
GET /users/logout
Authorization: Bearer <jwt-token>
```

### Example cURL

```
curl -X GET \
  http://localhost:4000/users/logout \
  -H "Authorization: Bearer <jwt-token>"
```

If you're using the cookie token instead of the header, you can send:

```
curl -X GET \
  http://localhost:4000/users/logout \
  -H "Cookie: token=<jwt-token>"
```

### Responses

- 200 OK
  - On success, logs the user out and returns a message.

```
{ "message": "Logout successful" }
```

- 401 Unauthorized
  - When no token is provided, token is invalid/expired, or token is already blacklisted.

```
{ "message": "Unauthorized" }
```

- 500 Internal Server Error
  - For unexpected errors during logout.

```
{ "message": "Server error" }
```

### Notes

- Blacklisted tokens are stored with a 24-hour TTL; after that, they auto-expire from the database.
- If you authenticate via Authorization header, make sure to delete the token from your client storage after logout.
APPEND_MARKER

## POST /captains/register

Register a new captain (driver) with vehicle details.

### Description

- Creates a captain account with personal and vehicle information.
- Returns a JWT token on success (used for future authenticated captain routes).
- Requires JSON payload (Content-Type: application/json).
- Environment: requires `JWT_SECRET` set to sign captain tokens.

### Request Body

Provide a JSON object with the following shape:

```
{
  "fullname": {
    "firstname": "string (min 3, required)",
    "lastname": "string (min 3, optional)"
  },
  "email": "valid email (required)",
  "password": "string (min 6, required)",
  "vehicle": {
    "colour": "string (min 3, required)",
    "plate": "string (min 3, required)",
    "capacity": "integer (min 1, required)",
    "vehicleType": "one of: car | bike | auto (required)"
  }
}
```

Validation rules (from the route validators):

- `fullname.firstname`: required, min length 3
- `fullname.lastname`: optional, if provided min length 3
- `email`: must be a valid email format
- `password`: min length 6
- `vehicle.colour`: required, min length 3
- `vehicle.plate`: required, min length 3
- `vehicle.capacity`: required, integer >= 1
- `vehicle.vehicleType`: required, must be one of `car`, `bike`, `auto`

Example:

```
POST /captains/register
Content-Type: application/json

{
  "fullname": { "firstname": "Ravi", "lastname": "Sharma" },
  "email": "ravi.driver@example.com",
  "password": "DriveSecure123",
  "vehicle": {
    "colour": "Red",
    "plate": "MH22ZX9",
    "capacity": 4,
    "vehicleType": "car"
  }
}
```

### Example cURL

```
curl -X POST \
  http://localhost:4000/captains/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": { "firstname": "Ravi", "lastname": "Sharma" },
    "email": "ravi.driver@example.com",
    "password": "DriveSecure123",
    "vehicle": {
      "colour": "Red",
      "plate": "MH22ZX9",
      "capacity": 4,
      "vehicleType": "car"
    }
  }'
```

### Responses

- 201 Created
  - On success, returns the created captain document and a JWT token.
  - Example:

```
{
  "message": "Captain registered successfully",
  "captain": {
    "_id": "<mongo-id>",
    "fullname": { "firstname": "Ravi", "lastname": "Sharma" },
    "email": "ravi.driver@example.com",
    "vehicle": {
      "colour": "Red",
      "plate": "MH22ZX9",
      "capacity": 4,
      "vehicleType": "car"
    }
    // other captain fields...
  },
  "token": "<jwt-token>"
}
```

- 400 Bad Request
  - When validation fails or the email is already registered.
  - Example (validation):

```
{
  "errors": [
    { "msg": "Color must be at least 3 characters long", "param": "vehicle.colour" }
  ]
}
```

  - Example (duplicate email):

```
{ "message": "User already exists" }
```

- 500 Internal Server Error
  - Unexpected server/database error.
  - Example:

```
{ "error": "Failed to register captain" }
```

### Notes

- The captain password is hashed before being stored (bcrypt).
- The `vehicleType` enum helps restrict allowed vehicle categories.
- JWT expiry is 24h; re-login issues a new token.
- Route path is `/captains/register` (mounted at `/captains`).

