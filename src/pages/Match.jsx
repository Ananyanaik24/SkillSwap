import React, { useEffect, useState } from "react";
import { FaHome, FaSearch, FaHeart, FaUser, FaCheck, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./Match.css";

const Match = () => {
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const res = await fetch("http://localhost:5003/api/profiles");
        const data = await res.json();
        setProfiles(data);
      } catch (error) {
        console.error("Error fetching profiles:", error);
      }
    };
    fetchProfiles();
  }, []);

  const handleSwipe = (direction) => {
    setSwipeDirection(direction);
    setTimeout(() => {
      setSwipeDirection(null);
      setCurrentIndex((prev) => prev + 1);
    }, 500); // Wait for animation to finish
  };
  const handleMatchClick = async (receiverId) => {
    console.log("Receiver Id: ",receiverId)
    var receiverId=receiverId
    const senderId = localStorage.getItem('userId');
    console.log("Sender ID: ",senderId)
    if (!senderId) {
      alert("You need to be logged in to send a match request.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5003/matchrequest/send", {   // 👈 notice the backend server URL
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },  
        body: JSON.stringify({         // 👈 use it here
          senderId, receiverId }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert("Match request sent successfully!");
      } else {
        alert("Failed to send match request: " + data.message);
      }
      
    } catch (error) {
      alert("Error sending match request: " + error.message);
    }
    
  };
  
  return (
    <div className="match-container">
      <h2>Find Your Skill Match! 🔑</h2>

      {currentIndex >= profiles.length ? (
        <p>No more matches available!</p>
      ) : (
        <div
          className={`profile-card ${swipeDirection === "left" ? "swipe-left" : ""} ${
            swipeDirection === "right" ? "swipe-right" : ""
          }`}
        >
          <img
            src={
              profiles[currentIndex].photo
                ? `http://localhost:5003/uploads/${profiles[currentIndex].photo}`
                : "/default-user.png"
            }
            alt={profiles[currentIndex].name}
            className="profile-photo"
          />
          <h3>{profiles[currentIndex].name}</h3>
          <p><strong>Skill:</strong> {profiles[currentIndex].skill}</p>
          <p><strong>Category:</strong> {profiles[currentIndex].category}</p>
          <p><strong>Experience:</strong> {profiles[currentIndex].experience}</p>
        </div>
      )}

      {currentIndex < profiles.length && (
        <div className="buttons">
          <button className="skip-button" onClick={() => handleSwipe("left")}>
            <FaTimes /> Skip
          </button>
          <button className="match-button" onClick={() => handleSwipe("right")}>
            <FaCheck /> Match
            
          </button>
        </div>
      )}

      {/* Bottom Navbar */}
      <div className="bottom-nav">
        <Link to="/home" className="nav-item"><FaHome /></Link>
        <Link to="/search" className="nav-item"><FaSearch /></Link>
        <Link to="/match" className="nav-item active"><FaHeart /></Link>
        <Link to="/profile" className="nav-item"><FaUser /></Link>
      </div>
    </div>
  );
};

export default Match;
