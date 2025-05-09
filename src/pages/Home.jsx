import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { FaHome, FaSearch, FaUser } from "react-icons/fa";
import io from "socket.io-client";
import "./Home.css";

const socket = io("http://localhost:5003");

function Home() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await fetch("http://localhost:5003/api/profiles");
        const data = await response.json();
        setProfiles(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch profiles:", error);
        setLoading(false);
      }
    };

    fetchProfiles();

    socket.on("match-notification", (msg) => {
      alert(`🔔 ${msg}`);
    });

    return () => {
      socket.off("match-notification");
    };
  }, []);

  const currentProfile = profiles[currentIndex];

  const goToNextProfile = () => {
    setSwipeDirection(null);
    setCurrentIndex((prev) => prev + 1);
  };

  const animateSwipe = (direction, callback) => {
    setSwipeDirection(direction);
    setTimeout(() => {
      callback();
    }, 300); // Match CSS transition duration
  };

  const handleMatch = async (profile) => {
    alert(`You matched with ${profile.name}!`);
    socket.emit("match", { userId: profile._id, name: profile.name });

    try {
      await fetch("http://localhost:5003/api/profiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ matchedUserId: profile._id }),
      });
    } catch (error) {
      console.error("Error saving match:", error);
    }

    animateSwipe("right", goToNextProfile);
  };

  const handleSkip = () => {
    animateSwipe("left", goToNextProfile);
  };

  return (
    <div className="search-container single-view">
      <h2>Find Your Skill Match! 💡</h2>

      {loading ? (
        <div className="loader"></div>
      ) : currentProfile ? (
        <div
          key={currentProfile._id}
          className={`skill-card ${
            swipeDirection === "left"
              ? "swipe-left"
              : swipeDirection === "right"
              ? "swipe-right"
              : ""
          }`}
        >
          <img
            src={`http://localhost:5003/uploads/${currentProfile.photo}`}
            alt={currentProfile.name}
            className="skill-photo"
          />
          <h3>{currentProfile.name}</h3>
          {currentProfile.skill && <p className="match-bio">Skill: {currentProfile.skill}</p>}
{currentProfile.category && <p className="match-bio">Category: {currentProfile.category}</p>}
{currentProfile.experience && <p className="match-bio">Experience: {currentProfile.experience}</p>}



          <div className="match-buttons">
            <button className="btn-match" onClick={() => handleMatch(currentProfile)}>
              ✅ Match
            </button>
            <button className="btn-skip" onClick={handleSkip}>
              ❌ Skip
            </button>
          </div>
        </div>
      ) : (
        <p>No more profiles to show.</p>
      )}

      <div className="bottom-nav">
        <Link to="/home" className="nav-item">
          <FaHome />
        </Link>
        <Link to="/search" className="nav-item active">
          <FaSearch />
        </Link>
        <Link to="/profile" className="nav-item">
          <FaUser />
        </Link>
      </div>
    </div>
  );
}

export default Home;
