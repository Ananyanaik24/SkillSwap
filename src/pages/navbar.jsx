// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("userId");
  sessionStorage.removeItem("token");
  
    setUser(null); 
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="logo">SkillSwap</div>

      <nav className="nav-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/search">Search</Link>
        <Link to="/match">Match</Link>
        <Link to="/profile">Profile</Link>

        {/* Only show "Chat" if logged in */}
        {user && (
          <Link to={`/chat/${user?.id}/${user?.id}`}>Chat</Link>
        )}

        {!user && (
          <>
            <Link to="/signup">Sign Up</Link>
            <Link to="/login">Login</Link>
            
          </>
        )}

        {user && (
          <>
            {/* <span className="welcome-text">Welcome, {user?.name}!</span> */}
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
