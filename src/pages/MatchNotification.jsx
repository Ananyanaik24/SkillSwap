import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function MatchNotification() {
  const [requestCount, setRequestCount] = useState(0);
  const [matchRequests, setMatchRequests] = useState([]);
  const [friendMessage, setFriendMessage] = useState("");
  const navigate = useNavigate();

  const storedUser = localStorage.getItem('userId');

  const fetchMatchRequests = async () => {
    try {
      if (!storedUser) return;
      const res = await fetch(`http://localhost:5003/api/matchRequest/received/${storedUser}`);
      const data = await res.json();
      if (data && data.data) {
        const pendingRequests = data.data.filter(req => !req.isAccepted && !req.isRejected);
        setMatchRequests(pendingRequests);
        setRequestCount(pendingRequests.length);
      }
    } catch (error) {
      console.error("Error fetching match requests:", error);
    }
  };

  useEffect(() => {
    fetchMatchRequests(); // 👉 Fetch once on load
    const interval = setInterval(fetchMatchRequests, 5000); // Optional live refresh

    return () => clearInterval(interval);
  }, [navigate]);

  const handleAccept = async (requestId) => {
    try {
      await fetch(`http://localhost:5003/api/matchRequest/accept/${requestId}`, {
        method: 'PUT',
      });

      const acceptedRequest = matchRequests.find(req => req._id === requestId);

      if (acceptedRequest && acceptedRequest.senderId?.name) {
        setFriendMessage(`🎉 You are now friends with ${acceptedRequest.senderId.name}!`);
      } else {
        setFriendMessage("🎉 You are now friends!");
      }

      

      await fetchMatchRequests(); // 👉 Refresh the match requests list after accepting

    } catch (error) {
      console.error("Error accepting match request:", error);
    }
  };

  const handleReject = async (requestId) => {
    try {
      await fetch(`http://localhost:5003/matchRequest/reject/${requestId}`, {
        method: 'PUT',

      });
      const rejectedRequest = matchRequests.find(req => req._id === requestId);
      if (rejectedRequest && rejectedRequest.senderId?.name) {
        setFriendMessage(`Request Rejected with ${rejectedRequest.senderId.name}!`);
        alert("Request Rejected");
      } else {
        setFriendMessage("Request Rejected!");
        alert("Request Rejected");
      }
      
      await fetchMatchRequests(); // 👉 Refresh the match requests list after rejecting
    } catch (error) {
      console.error("Error rejecting match request:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Match Requests ❤️</h2>

      {friendMessage && (
        <div style={{
          backgroundColor: "#d4edda",
          color: "#155724",
          padding: "10px",
          borderRadius: "8px",
          marginBottom: "15px",
          textAlign: "center",
          fontWeight: "bold"
        }}>
          {friendMessage}
        </div>
      )}

      {requestCount === 0 && !friendMessage ? (
        <p>No new match requests!</p>
      ) : (
        <div>
          {matchRequests.map((req) => (
            <div key={req._id} style={{
              border: "1px solid #ddd",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "8px",
              background: "#f9f9f9"
            }}>
              <p>You have a match request from <strong>{req.senderId?.name || "Unknown"}</strong></p>

              <div style={{ marginTop: "10px" }}>
                <button
                  style={{ marginRight: "10px", padding: "5px 10px", background: "green", color: "white", border: "none", borderRadius: "5px" }}
                  onClick={() => handleAccept(req._id)}
                >
                  Accept
                </button>
                <button
                  style={{ padding: "5px 10px", background: "red", color: "white", border: "none", borderRadius: "5px" }}
                  onClick={() => handleReject(req._id)}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MatchNotification;
