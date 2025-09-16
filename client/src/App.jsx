import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import About from './pages/About';
import Profile from './pages/Profile';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import CreateListing from './pages/CreateListing';
import UpdateListing from './pages/UpdateListing';
import Listing from './pages/Listing';
import Search from './pages/Search';
import Wishlist from './pages/Wishlist';
import MyBookings from './pages/MyBookings';
import OwnerDashboard from './pages/OwnerDashboard';
import { ThemeProvider } from './contexts/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300'>
          <Header />
          <main className='animate-fadeIn'>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/sign-in' element={<SignIn />} />
              <Route path='/sign-up' element={<SignUp />} />
              <Route path='/about' element={<About />} />
              <Route path='/search' element={<Search />} />
              <Route path='/listing/:listingId' element={<Listing />} />

              <Route element={<PrivateRoute />}>
                <Route path='/profile' element={<Profile />} />
                <Route path='/create-listing' element={<CreateListing />} />
                <Route
                  path='/update-listing/:listingId'
                  element={<UpdateListing />}
                />
                <Route path='/wishlist' element={<Wishlist />} />
                <Route path='/my-bookings' element={<MyBookings />} />
                <Route path='/owner-dashboard' element={<OwnerDashboard />} />
              </Route>
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}
