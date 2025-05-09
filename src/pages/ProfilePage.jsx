import { useState } from "react";
import axios from "axios";
import { FaUser, FaEnvelope, FaPhone, FaPen, FaBriefcase } from "react-icons/fa";
import "./ProfilePage.css";

const ProfilePage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    skill: "",
    category: "",
    experience: "",
  });

  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setSaved(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      // Append all form data
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      // Add user ID from localStorage
      const userId = localStorage.getItem("userId");
      data.append("id", userId);

      // Add photo if selected
      if (photo) {
        data.append("photo", photo);
      }

      const response = await axios.post(
        "http://localhost:5003/api/profiles",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201 || response.status === 200) {
        setSaved(true);
        alert("✅ Profile saved successfully!");
      } else {
        alert("❌ Failed to save profile!");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("❌ An error occurred while saving the profile.");
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-wrapper">
        <h2>Edit Profile</h2>

        <div className="profile-avatar">
          {preview ? (
            <img src={preview} alt="Preview" />
          ) : (
            <div className="placeholder-avatar">Upload Image</div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="avatar-upload"
          />
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="input-group">
            <FaUser className="icon" />
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <FaEnvelope className="icon" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <FaPhone className="icon" />
            <input
              type="tel"
              name="contact"
              placeholder="Contact Number"
              value={formData.contact}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <FaPen className="icon" />
            <input
              type="text"
              name="skill"
              placeholder="Your Skill"
              value={formData.skill}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <FaPen className="icon" />
            <input
              type="text"
              name="category"
              placeholder="Your Category"
              value={formData.category}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <FaBriefcase className="icon" />
            <input
              type="text"
              name="experience"
              placeholder="Experience"
              value={formData.experience}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="submit-btn">
            Save Profile
          </button>

          {saved && <p className="success-message">✅ Profile Saved!</p>}
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
