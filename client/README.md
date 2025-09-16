# 🏠 MERN Estate - Student PG Accommodation Platform



## 🎯 Project Overview

**MERN Estate** is a comprehensive web application that bridges the gap between students looking for affordable, safe PG accommodations and property owners offering student-friendly housing. The platform provides an intuitive interface for property discovery, booking management, and seamless communication between tenants and owners.

### 🌟 Key Highlights
- **Target Market**: Student accommodation in India
- **User Roles**: Property Owners & Tenants (Students)
- **Technology**: Modern MERN Stack with performance optimizations
- **Features**: Advanced search, real-time booking, wishlist, dark mode
- **Performance**: Optimized images, lazy loading, service worker caching

---

## ✨ Features

### 🔐 **Authentication & User Management**
- **Dual Registration**: Separate flows for Property Owners and Tenants
- **Google OAuth**: Quick sign-in with Google accounts
- **JWT Security**: Secure token-based authentication
- **Role-Based Access**: Different permissions for owners and tenants

### 🏡 **Property Management** (For Owners)
- **Easy Listing Creation**: Upload images, set pricing, add amenities
- **Property Dashboard**: Manage all listings from one place
- **Booking Management**: View and manage tenant booking requests
- **Mobile Contact**: Direct phone/WhatsApp integration

### 🔍 **Advanced Search & Discovery** (For Tenants)
- **Smart Filters**: Filter by location, price, amenities, type
- **Search Suggestions**: Auto-complete for locations and properties
- **Sorting Options**: Price, date, popularity
- **Map Integration**: Location-based property discovery

### 💝 **Booking & Wishlist System**
- **Easy Booking**: Simple booking form with date selection
- **Wishlist**: Save favorite properties for later
- **Booking History**: Track all past and current bookings
- **Real-time Updates**: Instant booking confirmations

### 🎨 **Modern UI/UX**
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Perfect on mobile, tablet, and desktop
- **Image Galleries**: Swiper-based property image carousels
- **Smooth Animations**: CSS transitions and loading states

### ⚡ **Performance Optimizations**
- **Lazy Loading**: Images load only when needed
- **Service Worker**: Cache images for instant repeat visits
- **WebP Support**: Automatic image format optimization
- **Progressive Loading**: Blur-to-sharp image transitions
- **Code Splitting**: Optimized bundle loading

---

## 🛠️ Technology Stack

<table>
<tr>
<td>

### **Frontend**
- **React** 18.2.0 - UI Library
- **Vite** 4.4.5 - Build Tool  
- **Tailwind CSS** 3.3.3 - Styling
- **Redux Toolkit** - State Management
- **React Router** 6.15.0 - Navigation
- **Swiper.js** - Image Carousels
- **React Icons** - Icon Library

</td>
<td>

### **Backend**
- **Node.js** - Runtime Environment
- **Express.js** 4.18.2 - Web Framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password Hashing
- **Cookie Parser** - Session Management

</td>
</tr>
<tr>
<td>

### **Services**
- **Firebase Storage** - Image Storage
- **Firebase Auth** - Google OAuth
- **MongoDB Atlas** - Cloud Database
- **Vite Dev Server** - Development

</td>
<td>

### **DevOps & Tools**
- **Service Worker** - Caching
- **ESLint** - Code Linting
- **PostCSS** - CSS Processing
- **dotenv** - Environment Variables

</td>
</tr>
</table>

---

## 📦 Installation & Setup

### Prerequisites
- **Node.js** 16.0 or higher
- **npm** or **yarn** package manager
- **MongoDB Atlas** account
- **Firebase** project setup
- **Git** for version control

### 🚀 Quick Start

1. **Clone the Repository**
```bash
git clone https://github.com/your-username/mern-estate.git
cd mern-estate
```

2. **Install Backend Dependencies**
```bash
npm install
```

3. **Install Frontend Dependencies**
```bash
cd client
npm install
cd ..
```

4. **Environment Configuration**

Create `.env` file in the root directory:
```env
# MongoDB Connection
MONGO=mongodb+srv://username:password@cluster.mongodb.net/mern-estate

# JWT Secret Key
JWT_SECRET=your-super-secret-jwt-key-here

# Server Port (Optional)
PORT=3000
```

Create `.env` file in the `client` directory:
```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id
```

5. **Start Development Servers**
```bash
# Terminal 1 - Backend Server (Port 3000)
npm run dev

# Terminal 2 - Frontend Server (Port 5173)
cd client
npm run dev
```

6. **Access the Application**
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/api

---

## 📁 Project Structure

```
mern-estate/
├── 📂 api/                     # Backend Server
│   ├── 📂 controllers/         # Route Handlers
│   ├── 📂 models/             # MongoDB Schemas
│   ├── 📂 routes/             # API Routes
│   ├── 📂 utils/              # Utilities & Middleware
│   └── 📄 index.js            # Server Entry Point
│
├── 📂 client/                 # Frontend Application
│   ├── 📂 public/             # Static Assets
│   ├── 📂 src/
│   │   ├── 📂 components/     # Reusable Components
│   │   ├── 📂 pages/          # Page Components
│   │   ├── 📂 redux/          # State Management
│   │   ├── 📂 contexts/       # React Contexts
│   │   ├── 📂 hooks/          # Custom Hooks
│   │   └── 📂 utils/          # Utilities
│   ├── 📄 package.json        # Frontend Dependencies
│   └── 📄 vite.config.js      # Vite Configuration
│
├── 📄 package.json            # Backend Dependencies
├── 📄 .gitignore              # Git Ignore Rules
└── 📄 README.md               # Project Documentation
```

---

## 🔌 API Endpoints

### **Authentication**
- `POST /api/auth/signup` - User Registration
- `POST /api/auth/signin` - User Login
- `POST /api/auth/google` - Google OAuth
- `POST /api/auth/signout` - User Logout

### **User Management**
- `GET /api/user/test` - Test Endpoint
- `POST /api/user/update/:id` - Update Profile
- `DELETE /api/user/delete/:id` - Delete Account
- `GET /api/user/listings/:id` - User's Listings

### **Property Listings**
- `GET /api/listing/get` - Get Listings (with filters)
- `GET /api/listing/get/:id` - Get Single Listing
- `POST /api/listing/create` - Create Listing
- `POST /api/listing/update/:id` - Update Listing
- `DELETE /api/listing/delete/:id` - Delete Listing

### **Booking System**
- `POST /api/booking/create` - Create Booking
- `GET /api/booking/tenant/:id` - Tenant's Bookings
- `GET /api/booking/owner/:id` - Owner's Bookings
- `PUT /api/booking/update/:id` - Update Booking
- `DELETE /api/booking/cancel/:id` - Cancel Booking

### **Wishlist**
- `POST /api/wishlist/add` - Add to Wishlist
- `DELETE /api/wishlist/remove/:id` - Remove from Wishlist
- `GET /api/wishlist/:userId` - Get User Wishlist
- `GET /api/wishlist/check/:listingId` - Check Status

---

## 🎨 UI Components

### **Core Components**
- **Header** - Navigation with theme toggle
- **ListingItem** - Property card with optimized images
- **OptimizedImage** - Advanced image component with lazy loading
- **BookingModal** - Booking form with date validation
- **SearchSuggestions** - Auto-complete search functionality

### **Page Components**
- **Home** - Hero section with featured properties
- **Search** - Advanced search with filters
- **Listing** - Property details with image gallery
- **Profile** - User dashboard and settings
- **CreateListing** - Property creation form
- **Wishlist** - Saved properties management

---

## 🚀 Performance Features

### **Image Optimization** 🖼️
- **Lazy Loading**: Images load only when scrolled into view
- **WebP Support**: Automatic format conversion for 20-40% smaller sizes
- **Progressive Loading**: Blur placeholder → Sharp image transition
- **Service Worker Caching**: Images cached for instant repeat visits
- **Error Handling**: Graceful fallback for failed image loads

### **Code Optimization** ⚡
- **Bundle Splitting**: Separate chunks for vendors and features
- **Tree Shaking**: Remove unused code automatically
- **Minification**: Compressed JavaScript and CSS
- **Hot Reload**: Instant development updates

### **Caching Strategy** 💾
- **Browser Cache**: Static assets cached for 7 days
- **Service Worker**: Cache-first strategy for images
- **API Cache**: Network-first for fresh data
- **Redux Persist**: State persistence across sessions

---

## 🔒 Security Features

### **Authentication Security**
- **JWT Tokens**: Secure session management
- **HTTP-Only Cookies**: XSS attack prevention
- **Password Hashing**: bcryptjs with salt rounds
- **Role-Based Access**: Owner/Tenant permission system

### **Data Protection**
- **Input Validation**: Server-side validation for all inputs
- **MongoDB Injection**: Mongoose schema protection
- **CORS Configuration**: Cross-origin request security
- **Environment Variables**: Sensitive data protection

---

## 📱 Responsive Design

The application is fully responsive and optimized for:

- 📱 **Mobile Phones** (320px - 768px)
- 📱 **Tablets** (768px - 1024px) 
- 💻 **Laptops** (1024px - 1440px)
- 🖥️ **Desktops** (1440px+)

### **Mobile Features**
- Touch-friendly navigation
- Swipe gestures for image galleries
- Optimized form inputs
- Collapsible search filters
- Mobile-first CSS approach

---

## 🎯 User Roles & Permissions

### **Property Owners** 🏢
- ✅ Create and manage property listings
- ✅ Upload property images
- ✅ Set pricing and availability
- ✅ View and manage booking requests
- ✅ Contact information management
- ✅ Property analytics dashboard

### **Tenants (Students)** 🎓
- ✅ Search and filter properties
- ✅ View property details and images
- ✅ Add properties to wishlist
- ✅ Book properties with date selection
- ✅ Manage booking history
- ✅ Contact property owners

---

## 🧪 Testing

### **Development Testing**
```bash
# Frontend tests
cd client
npm run test

# Backend tests
npm run test

# Linting
cd client
npm run lint
```

### **Performance Testing**
- **Lighthouse Audit**: 90+ scores for Performance, SEO, Accessibility
- **Core Web Vitals**: Optimized loading and interaction metrics
- **Image Loading**: Test lazy loading and caching effectiveness

---

## 🚀 Deployment

### **Production Build**
```bash
# Build frontend
cd client
npm run build

# The build files will be served by the Express server
cd ..
npm start
```

### **Deployment Platforms**
- **Backend**: Railway, Render, Heroku, DigitalOcean
- **Database**: MongoDB Atlas (recommended)
- **Storage**: Firebase Storage
- **Domain**: Custom domain with SSL certificate

### **Environment Setup**
Ensure production environment variables are configured:
- Database connection string
- JWT secret key
- Firebase configuration
- CORS origins



