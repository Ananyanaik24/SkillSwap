import { useEffect, useState } from "react"; // only import hooks

import { Link } from "react-router-dom";
import { FaHome, FaSearch, FaUser } from "react-icons/fa";
import axios from "axios";

import "./Search.css";


// Function to handle sending a match request
const sendMatchRequest = async (senderId, receiverId) => {
  if (!senderId || !receiverId) {
    console.error("Sender ID or Receiver ID is missing.");
    return;
  }

  try {
    const response = await axios.post("http://localhost:5003/matchRequest/send", {
      senderId: senderId, // Ensure senderId is passed correctly
      receiverId: receiverId,
    });
    console.log("Match request sent:", response.data);
  } catch (error) {
    console.error("Error sending match request:", error);
  }
};
function Search() {
  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const currentUserId = localStorage.getItem('userId');


  // Fetch profiles on component mount

    useEffect(() => {
      const fetchProfiles = async () => {
        try {
          const res = await axios.get("http://localhost:5003/api/profiles");
          setProfiles(res.data);
          setFilteredProfiles(res.data);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching profiles:", error);
          setLoading(false);
        }
      };
    
      fetchProfiles();
    }, []);
    

  // Handle filtering and searching profiles
  const handleSearch = () => {
    const filtered = profiles.filter((profile) => {
      const matchesCategory =
        selectedCategory === "All" || profile.category === selectedCategory;

      const matchesSearch =
        profile.skill.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.name.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesCategory && matchesSearch;
    });

    setFilteredProfiles(filtered);
  };
  

  // Handle the match request click
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
    <div className="search-container">
      <h2>Find Your Skill Match! 💡</h2>

      <div className="filters">
        {/* Search bar */}
        <input
          type="text"
          placeholder="Search skills or names..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        {/* Category dropdown */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="dropdown"
        >
          <option value="All">All Categories</option>
          <option value="Technical">Technical</option>
          <option value="Cultural">Cultural</option>
        </select>

        {/* Search button */}
        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
      </div>

      {/* Loading or no results message */}
      {loading ? (
        <p>Loading profiles...</p>
      ) : filteredProfiles.length === 0 ? (
        <p>No profiles found for "{searchTerm}" in "{selectedCategory}"</p>
      ) : (
        <div className="card-grid">
          {filteredProfiles.map((profile) => (
            <div key={profile._id} className="profile-card">
              <img
                src={profile.photo ? `http://localhost:5003/uploads/${profile.photo}` : "/default-image.jpg"}
                alt={profile.name}
                className="profile-image"
              />
              <h3>{profile.name}</h3>
              <p><strong>Category:</strong> {profile.category}</p>
              <p><strong>Skill:</strong> {profile.skill}</p>
              <p><strong>Experience:</strong> {profile.experience}</p>

              <div className="card-buttons">
                {/* Match button */}
                <button
                  className="match-button"
                  onClick={() => handleMatchClick(profile._id)} // Pass the profile._id as receiverId
                >
                  Match
                </button>

                {/* Skip button */}
                <button className="skip-button">Skip</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="bottom-nav">
        <Link to="/match" className="nav-item">
          <FaHome className="nav-icon" />
        </Link>
        <Link to="/search" className="nav-item active">
          <FaSearch className="nav-icon" />
        </Link>
        <Link to="/profile" className="nav-item">
          <FaUser className="nav-icon" />
        </Link>
      </div>
    </div>
  );
}

export default Search;