import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function MatchNotification1() {
  const [requestCount, setRequestCount] = useState(0);
  const [matchRequests, setMatchRequests] = useState([]);
  const navigate = useNavigate();

 
    useEffect(() => {
      const storedUser = localStorage.getItem('userId');
 // 👈 grabbing logged-in user
      console.log('Stored user:', storedUser);
      if (storedUser) {
        fetch(`http://localhost:5003/api/matchRequest/sent/${storedUser}`)  // 👈 correct URL
          .then((response) => response.json())
          .then((data) => {
            console.log("Fetched match requests:", data);  // 👈 add a console.log here
            setMatchRequests(data.data);  // 👈 important
          })
          .catch((error) => console.error("Error fetching match requests:", error));
      }
    

      const fetchMatchRequests = async () => {
        try {
          const res = await fetch(`http://localhost:5003/api/matchRequest/sent/${storedUser}`);
  
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
  
      fetchMatchRequests();
      const interval = setInterval(fetchMatchRequests, 0);

    return () => clearInterval(interval);
  }, [navigate]);

  const handleAccept = async (requestId) => {
    try {
      await fetch(`http://localhost:5003/api/matchRequest/accept/${requestId}`, {
        method: 'PUT',
      });
      setMatchRequests(prev => prev.filter(req => req._id !== requestId));
      setRequestCount(prev => prev - 1);
    } catch (error) {
      console.error("Error accepting match request:", error);
    }
  };

  const handleReject = async (requestId) => {
    try {
      await fetch(`http://localhost:5003/api/matchRequest/reject/${requestId}`, {
        method: 'PUT',
      });
      setMatchRequests(prev => prev.filter(req => req._id !== requestId));
      setRequestCount(prev => prev - 1);
    } catch (error) {
      console.error("Error rejecting match request:", error);
    }
 };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Match Requests ❤️</h2>

      {requestCount === 0 ? (
        <p>No new match requests!</p>
      ) : (
        <div>
          <p>You have {requestCount} match request(s).</p>
          {matchRequests.map((req) => (
            <div key={req._id} style={{ 
              border: "1px solid #ddd", 
              padding: "10px", 
              marginBottom: "10px", 
              borderRadius: "8px",
              background: "#f9f9f9"
            }}>
               <p>You have sent a match request to <strong>{req.receiverId?.name || "Unknown"}</strong></p>

              <div style={{ marginTop: "10px" }}>
              <button 
  style={{ 
    backgroundColor: req.isAccepted ? 'green' : 'red', 
    color: 'white', 
    padding: '10px 20px', 
    border: 'none', 
    borderRadius: '5px' 
  }}
>
  {req.isAccepted ? "Request Approved" : "Request Pending"}
</button>
                {/* <button 
                  style={{ marginRight: "10px", padding: "5px 10px", background: "green", color: "white", border: "none", borderRadius: "5px" }}
                  onClick={() => handleAccept(req._id)}
                >
                  Accept
                </button> */}
                {/* <button 
                  style={{ padding: "5px 10px", background: "red", color: "white", border: "none", borderRadius: "5px" }}
                  onClick={() => handleReject(req._id)}
                >
                  Reject
                </button> */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MatchNotification1;
