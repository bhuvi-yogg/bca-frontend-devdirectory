import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <NavLink to="/" className="brand">
          &lt;/&gt; DevDirectory
        </NavLink>
        <nav className="nav-links">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/users">Developers</NavLink>
          <NavLink to="/add-post">New Post</NavLink>
          {isAuthenticated ? (
            <>
              <span className="nav-user">Hi, {user.name}</span>
              <button className="btn btn-ghost" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <NavLink to="/login" className="btn btn-primary">Login</NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}
