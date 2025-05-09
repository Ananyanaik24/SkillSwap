// ForgotPassword.jsx
import React from 'react';

function ForgotPassword() {
  return (
    <div>
      <h2>Forgot Password</h2>
      <p>Please enter your email to reset your password.</p>
      <form>
        <input type="email" placeholder="Email" required />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default ForgotPassword;
