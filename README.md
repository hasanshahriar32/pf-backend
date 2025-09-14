# Express TypeScript Backend Template

A modular Express.js backend template built with TypeScript, Prisma ORM, MongoDB, Zod validation, and JWT authentication.

## Features

- ✅ **TypeScript** - Full type safety
- ✅ **Express.js** - Fast, unopinionated web framework
- ✅ **Prisma ORM** - Modern database toolkit
- ✅ **MongoDB** - NoSQL database support
- ✅ **Zod** - Schema validation
- ✅ **JWT Authentication** - Secure token-based auth with role system
- ✅ **Bcrypt** - Password hashing
- ✅ **Extension System** - 3rd party service integration
- ✅ **Modular Architecture** - Clean separation of concerns
- ✅ **Error Handling** - Centralized error handling
- ✅ **CORS & Security** - Built-in security middleware

## Project Structure

```
src/
├── config/          # Database and app configuration
├── controllers/     # Request handlers
├── middleware/      # Custom middleware functions
├── routes/         # API route definitions
├── services/       # Business logic layer
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
├── validations/    # Zod validation schemas
└── index.ts        # Application entry point
```

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pf-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   NODE_ENV=development
   PORT=3000
   DATABASE_URL="mongodb://localhost:27017/express-backend"
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d
   EXTENSION_SECRET=your-super-secret-extension-key-change-this-in-production
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push the schema to your database
   npm run db:push
   ```

5. **Build the project**
   ```bash
   npm run build
   ```

## Development

Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:3000`

## 📚 API Documentation

This project includes comprehensive, interactive API documentation powered by **Scalar**.

### Access Documentation
- **Interactive API Docs**: `http://localhost:3000/api-docs`
- **OpenAPI Spec**: `http://localhost:3000/openapi.json`
- **Health Check**: `http://localhost:3000/health`

### Features
- 🎨 Beautiful, modern UI with purple theme
- 🔐 Built-in JWT authentication testing
- 📊 Interactive request/response examples
- 📋 Complete endpoint coverage
- 🚀 Test API calls directly from the documentation

For detailed documentation information, see [API_DOCS.md](./API_DOCS.md).

## API Endpoints

### Authentication
- `POST /api/v1/users/register` - Register a new user
- `POST /api/v1/users/login` - Login user

### User Management (Protected)
- `GET /api/v1/users/profile` - Get current user profile
- `PUT /api/v1/users/profile` - Update current user profile
- `DELETE /api/v1/users/profile` - Delete current user account
- `PUT /api/v1/users/change-password` - Change password

### Admin Routes (Protected)
- `GET /api/v1/users` - Get all users (paginated)
- `GET /api/v1/users/:id` - Get user by ID
- `PUT /api/v1/users/:id` - Update user by ID
- `DELETE /api/v1/users/:id` - Delete user by ID

### Extension Management
- `POST /api/v1/extensions` - Create extension (3rd party only, requires secret)
- `GET /api/v1/extensions` - Get all extensions (public)
- `GET /api/v1/extensions/latest` - Get latest extension (public)
- `GET /api/v1/extensions/build/:buildNumber` - Get extension by build number (public)
- `GET /api/v1/extensions/:id` - Get extension by ID (public)

### Health Check
- `GET /health` - Server health check
- `GET /api/v1/` - API information

## Request/Response Examples

### Register User
```bash
POST /api/v1/users/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "securepassword123",
  "firstName": "John",
  "lastName": "Doe"
}
```

Response:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "64f8a1b2c3d4e5f6g7h8i9j0",
      "email": "user@example.com",
      "username": "johndoe",
      "firstName": "John",
      "lastName": "Doe"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Login
```bash
POST /api/v1/users/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

### Authenticated Requests
Include the JWT token in the Authorization header:
```bash
GET /api/v1/users/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Create Extension (3rd Party Service)
```bash
POST /api/v1/extensions
Content-Type: application/json

{
  "buildNumber": "v1.2.3",
  "buildDescription": "Fixed login issues and improved performance",
  "author": "John Doe",
  "commitId": "a1b2c3d4e5f6789",
  "packedExtensionUrl": "https://storage.example.com/extensions/v1.2.3/packed.zip",
  "unpackedExtensionUrl": "https://storage.example.com/extensions/v1.2.3/unpacked.zip",
  "secret": "your-extension-secret-key"
}
```

Response:
```json
{
  "success": true,
  "message": "Extension created successfully",
  "data": {
    "id": "64f8a1b2c3d4e5f6g7h8i9j0",
    "buildNumber": "v1.2.3",
    "buildDescription": "Fixed login issues and improved performance",
    "author": "John Doe",
    "commitId": "a1b2c3d4e5f6789",
    "packedExtensionUrl": "https://storage.example.com/extensions/v1.2.3/packed.zip",
    "unpackedExtensionUrl": "https://storage.example.com/extensions/v1.2.3/unpacked.zip",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

## Database Schema

### User Model
```prisma
model User {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  email     String   @unique
  username  String   @unique
  password  String
  firstName String?
  lastName  String?
  role      UserRole @default(USER)
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum UserRole {
  USER
  ADMIN
}
```

### Extension Model
```prisma
model Extension {
  id                   String   @id @default(auto()) @map("_id") @db.ObjectId
  buildNumber          String   @unique
  buildDescription     String
  author               String
  commitId             String
  packedExtensionUrl   String
  unpackedExtensionUrl String
  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt
}
```

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the TypeScript code
- `npm start` - Start production server
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Prisma Studio

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `3000` |
| `DATABASE_URL` | MongoDB connection string | Required |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRES_IN` | JWT expiration time | `7d` |
| `EXTENSION_SECRET` | Secret for 3rd party extension services | Required |

## Security Features

- Password hashing with bcrypt (12 salt rounds)
- JWT token-based authentication
- Request validation with Zod
- CORS protection
- Helmet for security headers
- Input sanitization

## Error Handling

The application includes comprehensive error handling:
- Validation errors (400)
- Authentication errors (401)
- Not found errors (404)
- Conflict errors (409)
- Internal server errors (500)
- Prisma-specific error handling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
