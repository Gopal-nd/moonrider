# Dynamic Dashboard Setup Guide

This guide explains how to set up and use the dynamic dashboard with full CRUD operations for metrics, activities, and products.

## 🚀 Features

- **Dynamic Dashboard Metrics**: Real-time revenue, transactions, likes, and user counts
- **Activity Management**: Create, read, update, and delete weekly activity data
- **Product Management**: Manage top products with percentages and custom colors
- **Real-time Updates**: Automatic data refresh using TanStack Query
- **User Authentication**: Secure endpoints with JWT authentication
- **Responsive UI**: Modern, mobile-friendly interface

## 🛠️ Backend Setup

### 1. Database Setup

First, ensure your PostgreSQL database is running and update your `.env` file:

```bash
# Server .env
DATABASE_URL="postgresql://username:password@localhost:5432/moonrider"
JWT_SECRET="your-secret-key"
FRONTEND_URL="http://localhost:5173"
```

### 2. Run Database Migrations

```bash
cd server
bun run db
```

This will:
- Generate Prisma client
- Push the new schema to your database
- Create tables for User, Metric, Activity, and Product

### 3. Start the Server

```bash
cd server
bun run dev
```

The server will run on `http://localhost:8000`

## 🎯 API Endpoints

### Authentication Required for All Dashboard Endpoints

#### Metrics
- `GET /api/dashboard/metrics` - Get dashboard metrics
- `POST /api/dashboard/metrics` - Create/update metric

#### Activities
- `GET /api/dashboard/activities` - Get all activities
- `POST /api/dashboard/activities` - Create new activity
- `PUT /api/dashboard/activities/:id` - Update activity
- `DELETE /api/dashboard/activities/:id` - Delete activity

#### Products
- `GET /api/dashboard/products` - Get all products
- `POST /api/dashboard/products` - Create new product
- `PUT /api/dashboard/products/:id` - Update product
- `DELETE /api/dashboard/products/:id` - Delete product

## 🎨 Frontend Setup

### 1. Install Dependencies

```bash
cd frontend
bun install
```

### 2. Start Development Server

```bash
cd frontend
bun run dev
```

The frontend will run on `http://localhost:5173`

## 📊 How to Use

### Dashboard Metrics

1. **View Metrics**: Metrics are automatically loaded from the database
2. **Update Metrics**: Use the API endpoint to update metric values
3. **Real-time Updates**: Changes are reflected immediately in the UI

### Managing Activities

1. **Add Activity**: Click "Add Activity" button
2. **Fill Form**: Enter week name, guest count, and user count
3. **Edit Activity**: Click the edit button on any activity
4. **Delete Activity**: Click the delete button (with confirmation)

### Managing Products

1. **Add Product**: Click "Add Product" button
2. **Fill Form**: Enter product name, percentage, and choose color
3. **Edit Product**: Click the edit button on any product
4. **Delete Product**: Click the delete button (with confirmation)

## 🔧 Database Schema

### User Model
```prisma
model User {
  id        String   @id @default(uuid())
  googleId  String?  @unique
  email     String   @unique
  name      String
  opt       String?
  dob       DateTime
  password  String?
  createdAt DateTime @default(now())
  avatar    String?
  notes     Note[]
  metrics   Metric[]
  activities Activity[]
  products  Product[]
}
```

### Metric Model
```prisma
model Metric {
  id        String   @id @default(uuid())
  type      String   // 'revenue', 'transactions', 'likes', 'users'
  value     Float
  change    Float
  date      DateTime @default(now())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
}
```

### Activity Model
```prisma
model Activity {
  id        String   @id @default(uuid())
  week      String
  guest     Int
  userCount Int
  date      DateTime @default(now())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
}
```

### Product Model
```prisma
model Product {
  id         String   @id @default(uuid())
  name       String
  percentage Float
  color      String
  createdAt  DateTime @default(now())
  userId     String
  user       User     @relation(fields: [userId], references: [id])
}
```

## 🚨 Important Notes

1. **Authentication**: All dashboard endpoints require valid JWT authentication
2. **User Isolation**: Data is automatically filtered by the authenticated user
3. **Data Validation**: Forms include client-side validation for data integrity
4. **Error Handling**: Comprehensive error handling with user-friendly messages
5. **Real-time Updates**: TanStack Query ensures data stays fresh

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection**: Ensure PostgreSQL is running and credentials are correct
2. **CORS Issues**: Check that `FRONTEND_URL` in server `.env` matches your frontend URL
3. **Authentication**: Ensure JWT tokens are being sent with requests
4. **Prisma Errors**: Run `bun run db` to regenerate Prisma client

### Reset Database

If you need to reset the database:

```bash
cd server
bun run reset
```

⚠️ **Warning**: This will delete all data!

## 🔄 Data Flow

1. **User Authentication**: JWT token stored in cookies
2. **API Requests**: Frontend makes authenticated requests to backend
3. **Database Queries**: Backend queries database with user ID filter
4. **Data Response**: JSON data returned to frontend
5. **UI Updates**: TanStack Query updates components automatically
6. **Real-time Sync**: Changes are immediately reflected across all components

## 📱 Responsive Design

The dashboard is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

## 🎯 Next Steps

Potential enhancements:
- Data export functionality
- Advanced filtering and search
- Bulk operations
- Data visualization improvements
- Real-time notifications
- User roles and permissions
