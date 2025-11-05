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

### Notes

- Ensure the server is running and the base URL is correct (e.g., `http://localhost:4000`).
- `email` field is unique at the database level; duplicate emails may result in a server error unless handled by custom logic.
- Passwords are hashed before being stored.
