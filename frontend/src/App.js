import React, { useState } from "react";
import axios from "axios";
import "./App.css";

// =========================
// INGRESS BASE API
// =========================
const API = "/api";

// =========================
// PGADMIN ROUTE (IMPORTANT)
// =========================
const PGADMIN_URL = "http://pgadmin.local";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const [signupData, setSignupData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // =========================
  // SIDEBAR
  // =========================
  const openSidebar = () => setSidebarOpen(true);
  const closeSidebar = () => setSidebarOpen(false);

  // =========================
  // LOGIN
  // =========================
  const handleLogin = async () => {
    if (!loginData.username || !loginData.password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await axios.post(`${API}/login`, loginData);
      alert(res.data.message || "Login successful");
      setIsLoggedIn(true);
    } catch (err) {
      alert(err.response?.data || "Login failed");
    }
  };

  // =========================
  // SIGNUP
  // =========================
  const handleSignup = async () => {
    if (
      !signupData.username ||
      !signupData.email ||
      !signupData.password
    ) {
      alert("Please fill required fields");
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post(`${API}/signup`, signupData);
      alert(res.data.message || "Signup successful");
      setShowSignup(false);
    } catch (err) {
      alert(err.response?.data || "Signup failed");
    }
  };

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoginData({ username: "", password: "" });
  };

  // =========================
  // INPUT HANDLERS
  // =========================
  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignupChange = (e) => {
    setSignupData({
      ...signupData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // LOGIN SCREEN
  // =========================
  const loginForm = (
    <div className="login-container">
      <div className="form-box">
        <h2>Login</h2>

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={loginData.username}
          onChange={handleLoginChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={loginData.password}
          onChange={handleLoginChange}
        />

        <button onClick={handleLogin}>Login</button>

        <span onClick={() => setShowSignup(true)}>
          Don't have an account? Signup
        </span>
      </div>
    </div>
  );

  // =========================
  // SIGNUP SCREEN
  // =========================
  const signupForm = (
    <div className="login-container">
      <div className="form-box">
        <h2>Signup</h2>

        <input
          name="firstname"
          placeholder="First Name"
          onChange={handleSignupChange}
        />

        <input
          name="lastname"
          placeholder="Last Name"
          onChange={handleSignupChange}
        />

        <input
          name="username"
          placeholder="Username"
          onChange={handleSignupChange}
        />

        <input
          name="email"
          placeholder="Email"
          onChange={handleSignupChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleSignupChange}
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          onChange={handleSignupChange}
        />

        <button onClick={handleSignup}>Signup</button>

        <span onClick={() => setShowSignup(false)}>
          Back to login
        </span>
      </div>
    </div>
  );

  // =========================
  // DASHBOARD
  // =========================
  const mainContent = (
    <div>
      <div className="logout-tab" onClick={handleLogout}>
        Logout
      </div>

      <div className="menu-icon" onClick={openSidebar}>
        &#9776;
      </div>

      <div className="sidebar" style={{ width: sidebarOpen ? "250px" : "0" }}>
        <span className="closebtn" onClick={closeSidebar}>
          &times;
        </span>

        {/* PGADMIN LINK (FIXED) */}
        <a
          href={PGADMIN_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          Open pgAdmin
        </a>
      </div>

      <h1>Welcome, {loginData.username} 👋</h1>
      <p>Your Kubernetes app is running 🚀</p>
    </div>
  );

  // =========================
  // RENDER
  // =========================
  return (
    <div className="App">
      {!isLoggedIn ? (showSignup ? signupForm : loginForm) : mainContent}
    </div>
  );
}

export default App;