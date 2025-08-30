# 🚀 MoonRider - Business Management Dashboard

A comprehensive, full-stack business management application built with modern web technologies. MoonRider provides a complete solution for managing products, orders, customers, and business analytics in a single, intuitive dashboard.

## 🌐 Live Demo

### **Frontend Application**
**🔗 [https://moonrider-sigma.vercel.app/](https://moonrider-sigma.vercel.app/)**

### **Backend API**
**🔗 [https://moonrider-n59g.onrender.com/](https://moonrider-n59g.onrender.com/)**

> **⚠️ Note**: The backend API is hosted on Render and may take a few seconds to cold start on the first request. Subsequent requests will be much faster.

## ✨ Features

### 🏪 **Product Management**
- **Complete CRUD Operations**: Create, read, update, and delete products
- **Rich Product Data**: Name, percentage, color, price, stock, category, description, and image URL
- **Stock Tracking**: Real-time inventory management with automatic stock updates
- **Category Organization**: Organize products by categories for better management
- **Visual Product Display**: Color-coded product representation with percentage indicators

### 📦 **Order Management**
- **Full Order Lifecycle**: Track orders from pending to delivered
- **Status Management**: Update order status (pending → processing → shipped → delivered → cancelled)
- **Stock Integration**: Automatic stock decrementation when orders are created
- **Customer Linking**: Associate orders with customers for complete tracking
- **Order Items**: Detailed line items with quantities, prices, and totals
- **Order Analytics**: Comprehensive reporting and insights

### 👥 **Customer Management**
- **Customer Profiles**: Complete customer information management
- **Order History**: Track all customer orders and spending patterns
- **Customer Analytics**: Spending analysis and customer insights
- **Status Tracking**: Active, inactive, and VIP customer management
- **Contact Information**: Email, phone, address, city, and country

### 📊 **Dashboard & Analytics**
- **Real-time Metrics**: Live data from actual business operations
- **Revenue Tracking**: Total revenue calculation from orders
- **Transaction Counts**: Real order counts and statistics
- **User Activity**: Guest and user activity tracking
- **Performance Charts**: Visual representation of business metrics
- **Period Comparisons**: Week-over-week and period-over-period analysis

### 🔐 **Authentication & Security**
- **Google OAuth Integration**: Secure sign-in with Google accounts
- **User Management**: Individual user accounts with role-based access
- **Session Management**: Secure cookie-based authentication
- **Route Protection**: Protected routes requiring authentication
- **User Profiles**: Personal user settings and preferences

### 📱 **Responsive Design**
- **Mobile-First Approach**: Optimized for all device sizes
- **Modern UI/UX**: Clean, professional interface design
- **Sidebar Navigation**: Collapsible sidebar for mobile devices
- **Touch-Friendly**: Optimized for touch and mobile interactions

## 🛠️ Technology Stack

### **Frontend**
- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Type-safe development with enhanced IDE support
- **TanStack Router**: File-based routing with type safety
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **Shadcn/ui**: High-quality, accessible UI components
- **React Query**: Server state management and data fetching
- **Zustand**: Lightweight state management for client state
- **Lucide React**: Beautiful, customizable icons

### **Backend**
- **Node.js**: JavaScript runtime environment
- **Express.js**: Fast, unopinionated web framework
- **TypeScript**: Type-safe backend development
- **Prisma**: Modern database ORM with type safety
- **PostgreSQL**: Robust, open-source relational database
- **JWT**: JSON Web Token authentication
- **Cookie Parser**: Secure cookie handling
- **CORS**: Cross-origin resource sharing support

### **Database**
- **PostgreSQL**: Primary database with advanced features
- **Prisma Schema**: Type-safe database schema definition
- **Relationships**: Proper foreign key relationships between entities
- **Indexing**: Optimized database performance
- **Migrations**: Version-controlled database schema changes

### **Development Tools**
- **Vite**: Fast build tool and development server
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting and style consistency
- **Hot Reload**: Instant development feedback
- **Type Checking**: Real-time TypeScript validation

## 🏗️ Architecture

### **Frontend Architecture**
```
frontend/
├── src/
│   ├── components/     # Reusable UI components
│   ├── routes/         # Page components and routing
│   ├── lib/           # Utilities and configurations
│   ├── hooks/         # Custom React hooks
│   └── types/         # TypeScript type definitions
```

### **Backend Architecture**
```
server/
├── controllers/        # Business logic handlers
├── routes/            # API endpoint definitions
├── middleware/        # Authentication and validation
├── lib/              # Database and utility functions
├── prisma/           # Database schema and migrations
└── types/            # TypeScript type definitions
```

### **Database Schema**
- **User**: Authentication and user management
- **Product**: Product catalog and inventory
- **Customer**: Customer relationship management
- **Order**: Order processing and tracking
- **OrderItem**: Detailed order line items
- **Activity**: User activity and analytics
- **Metric**: Business performance metrics
- **Notification**: User notifications system

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+ 
- PostgreSQL 14+
- npm, yarn, or bun package manager

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/Gopal-nd/moonrider.git
   cd moonrider
   ```

2. **Install dependencies**
   ```bash
   # Backend
   cd server
   npm install
   
   # Frontend
   cd ../frontend
   npm install
   ```

3. **Environment setup**
   ```bash
   # Backend (.env)
   DATABASE_URL="postgresql://username:password@localhost:5432/moonrider"
   JWT_SECRET="your-secret-key"
   GOOGLE_CLIENT_ID="your-google-client-id"
   
   # Frontend (.env)
   VITE_API_URL="http://localhost:8000"
   VITE_GOOGLE_CLIENT_ID="your-google-client-id"
   ```

4. **Database setup**
   ```bash
   cd server
   npx prisma db push
   npm run seed
   ```

5. **Start development servers**
   ```bash
   # Backend
   cd server
   npm run dev
   
   # Frontend (new terminal)
   cd frontend
   npm run dev
   ```

## 📖 API Documentation

### **Authentication Endpoints**
- `POST /api/auth/google` - Google OAuth authentication
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### **Product Endpoints**
- `GET /api/dashboard/products` - Get all products
- `POST /api/dashboard/products` - Create new product
- `PUT /api/dashboard/products/:id` - Update product
- `DELETE /api/dashboard/products/:id` - Delete product

### **Order Endpoints**
- `GET /api/orders` - Get all orders with pagination
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id/status` - Update order status
- `DELETE /api/orders/:id` - Delete order
- `GET /api/orders/analytics` - Get order analytics

### **Customer Endpoints**
- `GET /api/customers` - Get all customers with pagination
- `POST /api/customers` - Create new customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer
- `GET /api/customers/analytics` - Get customer analytics

### **Dashboard Endpoints**
- `GET /api/dashboard/metrics` - Get dashboard metrics
- `GET /api/dashboard/activities` - Get user activities
- `POST /api/dashboard/activities` - Create activity

## 🔧 Development

### **Available Scripts**

#### **Backend**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run db:push      # Push database schema changes
npm run db:seed      # Seed database with sample data
npm run db:studio    # Open Prisma Studio
```

#### **Frontend**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

### **Code Quality**
- **ESLint**: Code linting and style enforcement
- **Prettier**: Automatic code formatting
- **TypeScript**: Static type checking
- **Prisma**: Database schema validation

## 🧪 Testing

### **Manual Testing Checklist**
1. **Authentication Flow**
   - Google OAuth sign-in
   - Session persistence
   - Logout functionality

2. **Product Management**
   - Create product with all fields
   - Update product information
   - Delete products
   - Stock validation

3. **Order Management**
   - Create orders with products
   - Update order status
   - Stock decrementation
   - Order analytics

4. **Customer Management**
   - Create customer profiles
   - Update customer information
   - Customer analytics
   - Order history

5. **Dashboard Metrics**
   - Real-time data display
   - Period comparisons
   - Chart visualizations

## 🚀 Deployment

### **Production Build**
```bash
# Backend
cd server
npm run build
npm start

# Frontend
cd frontend
npm run build
# Deploy dist/ folder to your hosting service
```

### **Environment Variables**
Ensure all production environment variables are properly set:
- Database connection strings
- JWT secrets
- Google OAuth credentials
- API URLs

### **Database Migration**
```bash
cd server
npx prisma migrate deploy
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Shadcn/ui** for beautiful UI components
- **Prisma** for excellent database tooling
- **TanStack** for modern React libraries
- **Tailwind CSS** for utility-first styling

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code examples

---

**MoonRider** - Empowering businesses with comprehensive management tools 🚀
