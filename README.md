# 🏠 MERN Estate - PG Finder

A web app I built to help students find PG accommodations. Made with MERN stack as a learning project!

## What I used:
- **Frontend**: React, Vite, Tailwind CSS, Redux
- **Backend**: Node.js, Express, MongoDB
- **Other stuff**: Firebase for images, Google login
- **Cool features**: Fast image loading, dark mode

## What it does:

### 🔑 Login stuff
- You can sign up as a student or PG owner
- Google login works too (using Firebase)
- Passwords are hashed properly with bcryptjs
- JWT tokens for staying logged in

### 🏠 PG listings
- Owners can add their PG details and photos
- Students can search by location, price, amenities
- Image upload to Firebase Storage
- Mobile number validation for Indian numbers

### 📱 UI features
- Works on phone and desktop (Tailwind CSS)
- Dark mode toggle (saves your preference)
- Image carousel for PG photos (Swiper.js)
- Redux for managing user state

### ⚡ Performance stuff
- Images load only when you scroll to them (lazy loading)
- WebP format for smaller image sizes
- Service Worker caches images so they load faster next time
- Blur effect while images load


## Database (MongoDB)
Basic collections:
- **Users**: username, email, password, role (student/owner)
- **Listings**: PG details, images, price, amenities, location
- **Bookings**: booking requests with dates
- **Wishlist**: saved PGs for students

## How to run:

```bash
# Install stuff
npm install
cd client && npm install

# Add .env file with:
MONGO=your-mongodb-url
JWT_SECRET=any-random-string

# Add .env in client folder:
VITE_FIREBASE_API_KEY=your-firebase-key

# Start servers
npm run dev        # Backend
cd client && npm run dev  # Frontend
```

## API endpoints:
- **Auth**: signup, signin, google login, logout
- **Users**: update profile, delete account
- **Listings**: create/edit PGs, search with filters
- **Bookings**: create bookings, view booking history
- **Wishlist**: save/remove favorite PGs

## What I learned:

### Backend stuff:
- JWT authentication and cookies
- File upload to Firebase Storage
- MongoDB with Mongoose
- Express middleware for authentication

### Frontend stuff:
- React hooks and components
- Redux for state management
- Tailwind CSS for styling
- Image optimization and lazy loading

### Cool optimizations:
- Service Worker for caching images
- WebP image format for smaller sizes
- Lazy loading so images load only when needed
- Dark mode that remembers your choice
