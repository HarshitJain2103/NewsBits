import { useState , useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import 'bootstrap-icons/font/bootstrap-icons.css';

function Login({ setUser, isDarkMode, setAlertMessage }) { // ✅ accept setAlertMessage
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/api/auth/login", form);
      setUser(res.data.user);
      localStorage.setItem('token', res.data.token);
      setAlertMessage('Login successful!'); // ✅ trigger global alert
      setTimeout(() => navigate('/'), 1000);
    } catch (error) {
      setAlertMessage(error.response?.data?.message || 'Login Failed!'); // ✅ trigger global alert
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div
        className="card p-4"
        style={{
          width: '400px',
          backgroundColor: !isDarkMode ? '#ffffff' : '#373434',
          borderRadius: '20px',
          boxShadow: isDarkMode ? '0 4px 12px rgba(232, 229, 229, 0.94)' : '0 4px 12px rgba(0, 0, 0, 0.25)',
          border: `1px solid ${isDarkMode ? '#ffffff' : '#000000'}`,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-6px)";
          e.currentTarget.style.boxShadow = isDarkMode
            ? '0 4px 12px rgba(232, 229, 229, 0.94)'
            : '0 4px 12px rgba(0, 0, 0, 0.25)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = isDarkMode
            ? '0 4px 12px rgba(232, 229, 229, 0.94)'
            : '0 4px 12px rgba(0, 0, 0, 0.25)';
        }}
      >
        <h2 className="text-center mb-4" style={{ color: isDarkMode ? '#ffffff' : '#000000' }}>
          Login
        </h2>

        {/* ✅ Alert REMOVED from here */}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Email"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3 position-relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className="form-control"
              placeholder="Password"
              onChange={handleChange}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(prev => !prev)}
              className="btn position-absolute top-50 end-0 translate-middle-y me-2 p-0 border-0 bg-transparent"
              style={{ outline: 'none' }}
            >
              <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`} style={{ fontSize: "1.2rem" }}></i>
            </button>
          </div>
          <div className="d-grid">
            <button type="submit" className="btn btn-primary py-2">
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
