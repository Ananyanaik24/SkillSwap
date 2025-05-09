import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserFriends, FaHeart, FaComments } from "react-icons/fa";
import "./Dashboard.css";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [matchRequestCount, setMatchRequestCount] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    // Get logged-in user's name from localStorage
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser && storedUser.name) {
      setUsername(storedUser.name);
    } else {
      navigate("/login"); // Redirect to login if no user is found
    }

    // Fetch users for match display
    fetch("http://localhost:5003/api/users")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched users:", data);
        setUsers(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setLoading(false);
      });

    // Fetch pending match requests count
    const fetchMatchRequests = async () => {
      try {
        if (!storedUser || !storedUser._id) return;

        const res = await fetch(`http://localhost:5003/matchRequest/received/${storedUser._id}`);
        const data = await res.json();
        if (data && data.data) {
          const pendingRequests = data.data.filter(req => !req.isAccepted && !req.isRejected);
          setMatchRequestCount(pendingRequests.length);
        }
      } catch (err) {
        console.error("Error fetching match requests:", err);
      }
    };

    fetchMatchRequests();
    const interval = setInterval(fetchMatchRequests, 5003); // Refresh every 5 seconds

    return () => clearInterval(interval); // Clean up
  }, [navigate]);

  const handleMatchRequest = (receiverId) => {
    const sender = JSON.parse(localStorage.getItem('user'));
    if (!sender || !sender._id) return;

    const senderId = sender._id;

    fetch('http://localhost:5003/matchRequest/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ senderId, receiverId }),
    })
      .then(response => response.json())
      .then(data => {
        console.log("Match request sent:", data);
        alert('Match request sent!');
      })
      .catch(error => {
        console.error("Error sending match request:", error);
      });
  };

  return (
    <div className="dashboard-container">
      {/* Main Section */}
      <main className="dashboard-main">
        <section className="welcome-section">
          <h2 className="welcome-title">
            {username ? `Welcome, ${username}!` : "Welcome!"}
          </h2>
          <p className="welcome-subtitle">
            Discover new connections and grow your skills.
          </p>
        </section>

        <section className="dashboard-actions">
          <Link to="/MatchNotification" className="dashboard-card" style={{ position: "relative" }}>
            <FaHeart className="dashboard-card-icon" />
            {matchRequestCount > 0 && (
              <span style={{
                position: "absolute",
                top: "-8px",
                right: "-8px",
                background: "red",
                color: "white",
                borderRadius: "50%",
                padding: "4px 7px",
                fontSize: "12px",
              }}>
                {matchRequestCount}
              </span>
            )}
            <span>Matches</span>
            
          </Link>
          <Link to="/MatchNotification1" className="dashboard-card" style={{ position: "relative" }}>
            <FaHeart className="dashboard-card-icon" />
            {matchRequestCount > 0 && (
              <span style={{
                position: "absolute",
                top: "-8px",
                right: "-8px",
                background: "red",
                color: "white",
                borderRadius: "50%",
                padding: "4px 7px",
                fontSize: "12px",
              }}>
                {matchRequestCount}
              </span>
            )}
            <span>Matches Sent</span>
            
          </Link>

          <Link to="/ChatRoom" className="dashboard-card">
            <FaComments className="dashboard-card-icon" />
            <span>Messages</span>
          </Link>

          <Link to="/Friends" className="dashboard-card">
            <FaUserFriends className="dashboard-card-icon" />
            <span>Friends</span>
          </Link>
        </section>

        {/* Matches Section */}
        <section className="matches-section">
          <h2>Your Matches</h2>
          {loading ? (
            <p className="loading">Loading matches...</p>
          ) : users.length === 0 ? (
            <p className="no-matches">No matches found.</p>
          ) : (
            <div className="matches-grid">
              {users
                .filter(user => user.skill && user.skill !== "No skill listed") // Filter out users with no skill listed
                .map((user) => (
                  <div className="match-card" key={user._id}>
                    <div className="match-avatar">
                      <img
                        src={user.profilePic || 'http://localhost:5003/matchRequest/received.id'}
                        alt={user.name}
                      />
                    </div>
                    <h3>{user.name}</h3>
                    <p>{user.skill}</p>
                    <button
                      className="match-btn"
                      onClick={() => handleMatchRequest(user._id)}
                    >
                      Match
                    </button>
                  </div>
                ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
