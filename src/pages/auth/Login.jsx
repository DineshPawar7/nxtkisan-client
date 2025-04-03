import React, { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      // const response = await fetch("http://localhost:5000/api/auth/login", {
        const response = await fetch("https://nxtkisan-server.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        alert("Login Successful");
        window.location.href = "/profile"; // Redirect to profile
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Login failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <h2>Login</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="button" onClick={handleLogin} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
