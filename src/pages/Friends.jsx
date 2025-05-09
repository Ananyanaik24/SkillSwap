import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 👈 for navigation
import './friends.css'; // 🔥 Importing CSS file
import { Link } from 'react-router-dom';

function Friends() {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // 👈 Initialize navigate

  useEffect(() => {
    const fetchFriends = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) return;

      try {
        const response = await fetch(`http://localhost:5003/api/matchrequest/friends/${userId}`);
        const data = await response.json();

        if (data.success) {
          setFriends(data.data);
        } else {
          console.error('Failed to fetch friends');
        }
      } catch (error) {
        console.error('Error fetching friends:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, []);

  if (loading) return <div className="loading">Loading friends...</div>;

  const handleChat = (friendId) => {
    const userId = localStorage.getItem('userId');
    if (userId && friendId) {
      // navigate(`/chatRoom/${userId}/${friendId}`);
    }
  };

  return (
    <div className="friends-container">
      <h2 className="friends-title">My Friends 🤝</h2>
      {friends.length === 0 ? (
        <p className="no-friends">You have no friends yet!</p>
      ) : (
        <div className="friends-grid">
          {friends.map(friend => (
            <div key={friend._id} className="friend-card">
              <div className="avatar">
                {friend.name ? friend.name.charAt(0).toUpperCase() : '?'}
              </div>
              <h4 className="friend-name">{friend.name}</h4>
              <p className="friend-email">{friend.email}</p>
           

              <Link to={`/chat/${friend._id}`} className="chat-button">
  Chat 💬
</Link>

                
             
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Friends;
