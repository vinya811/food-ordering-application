import { useState } from "react";
import {
  Link,
  useNavigate,
  useLocation
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  // =========================
  // HANDLE INPUT
  // =========================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value
    }));

    setError("");
  };


  // =========================
  // LOGIN
  // =========================

  const handleSubmit = async (event) => {
    event.preventDefault();

    const email = formData.email.trim().toLowerCase();
    const password = formData.password;

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "https://food-ordering-application-nine.vercel.app/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            email,
            password
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Incorrect email or password."
        );

        return;
      }


      // Save the MongoDB user
      // as the currently logged-in user.
      login(data.user);


      // Go back to the page the user
      // originally wanted to visit.
      const destination = location.state?.from;

      const requestedPath =
        destination?.pathname?.startsWith("/") &&
        !destination.pathname.startsWith("//")
          ? destination.pathname
          : "/";

      navigate(requestedPath, {
        replace: true
      });

    } catch (error) {
      console.error("Login error:", error);

      setError(
        "Could not connect to the server. Please make sure the backend is running."
      );

    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="login-page">

      <div className="login-card">

        <div className="login-icon">
          🍔
        </div>

        <h1>
          Welcome Back!
        </h1>

        <p className="login-subtitle">
          Login to continue ordering delicious food.
        </p>


        <form onSubmit={handleSubmit}>

          <label>
            Email
          </label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />


          <label>
            Password
          </label>

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />


          {error && (
            <p
              className="login-error"
              role="alert"
            >
              {error}
            </p>
          )}


          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>


        <p className="signup-text">

          Don't have an account?{" "}

          <Link to="/signup">
            Sign Up
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Login;