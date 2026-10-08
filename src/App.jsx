import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import UserDirectory from './pages/UserDirectory';
import UserProfile from './pages/UserProfile';
import AddPost from './pages/AddPost';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<UserDirectory />} />
          <Route path="/users/:id" element={<UserProfile />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/add-post"
            element={
              <ProtectedRoute>
                <AddPost />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
}
