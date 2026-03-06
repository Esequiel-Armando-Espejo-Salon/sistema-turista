import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import api from "../services/api";

const Register = () => {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    telephone: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  /*
  load sdk facebbok
  */

  useEffect(() => {

    window.fbAsyncInit = function () {
      window.FB.init({
        appId: "1303629828488999",
        cookie: true,
        xfbml: true,
        version: "v19.0"
      });
    };

    const script = document.createElement("script");
    script.src = "https://connect.facebook.net/en_US/sdk.js";
    script.async = true;
    script.defer = true;

    document.body.appendChild(script);

  }, []);

  /*
 regirter with email and password
  */

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (loading) return;

    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("The passwords do not match");
      return;
    }

    setLoading(true);

    try {

      await api.post("/accounts/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        telephone: formData.telephone
      });

      navigate("/login");

    } catch (err) {

      if (err.response?.data?.errors) {
        setError(err.response.data.errors[0].msg);
      } else {
        setError(err.response?.data?.message || "Error registering");
      }

    } finally {
      setLoading(false);
    }

  };

  /*
  LOGIN  GOOGLE
  */

  const googleLogin = useGoogleLogin({

    onSuccess: async (tokenResponse) => {

      try {

        const res = await fetch(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenResponse.access_token}`
        );

        const user = await res.json();

        const { data } = await api.post("/accounts/google", {
          name: user.name,
          email: user.email
        });

        localStorage.setItem("token", data.token);

        navigate("/home");

      } catch (error) {

        console.error(error);
        setError("Error registering with Google");

      }

    }

  });

  /*
  LOGIN CON FACEBOOK
  */

  const handleFacebookRegister = () => {

    if (!window.FB) {
      setError("Facebook SDK not loaded");
      return;
    }

    window.FB.login((response) => {

      if (!response.authResponse) return;

      window.FB.api("/me", { fields: "name,email" }, async (user) => {

        try {

          const { data } = await api.post("/accounts/facebook", {
            name: user.name,
            email: user.email
          });

          localStorage.setItem("token", data.token);

          navigate("/home");

        } catch (err) {

          console.error(err);
          setError("Error registering with Facebook");

        }

      });

    }, { scope: "email" });

  };

  return (

    <div style={{ padding: "40px", maxWidth: "400px", margin: "auto" }}>

      <h2>Register as a Tourist</h2>

      {error && (
        <p style={{ color: "red", marginBottom: "10px" }}>
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder="Full Name"
          required
          style={{ display: "block", width: "100%", marginBottom: "10px" }}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
        />

        <input
          type="email"
          placeholder="Email"
          required
          style={{ display: "block", width: "100%", marginBottom: "10px" }}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          required
          style={{ display: "block", width: "100%", marginBottom: "10px" }}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Confirm Password"
          required
          style={{ display: "block", width: "100%", marginBottom: "10px" }}
          onChange={(e) =>
            setFormData({ ...formData, confirmPassword: e.target.value })
          }
        />

        <input
          type="text"
          placeholder="Phone Number"
          required
          style={{ display: "block", width: "100%", marginBottom: "10px" }}
          onChange={(e) =>
            setFormData({ ...formData, telephone: e.target.value })
          }
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px",
            background: loading ? "#999" : "#28a745",
            color: "white",
            border: "none",
            borderRadius: "6px",
            marginBottom: "20px"
          }}
        >
          {loading ? "Registering...": "Register"}
        </button>

      </form>

      <div style={{ textAlign: "center", marginBottom: "15px" }}>
        <p>or register with</p>
      </div>

      <button
        onClick={() => googleLogin()}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px",
          background: "#DB4437",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer"
        }}
      >
        Register with Google
      </button>

      <button
        onClick={handleFacebookRegister}
        style={{
          width: "100%",
          padding: "10px",
          background: "#1877F2",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer"
        }}
      >
        Register with Facebook
      </button>

    </div>
  );
};

export default Register;

/*import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', telephone: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/accounts/register', formData);
      alert('Registro exitoso, ahora inicia sesión');
      navigate('/login');
    } catch (err) {
      alert('Error en el registro');
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '400px', margin: 'auto' }}>
      <h2>Registro de Turista</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Nombre completo" style={{ display: 'block', width: '100%', marginBottom: '10px' }}
          onChange={(e) => setFormData({...formData, name: e.target.value})} required />
        <input type="email" placeholder="Email" style={{ display: 'block', width: '100%', marginBottom: '10px' }}
          onChange={(e) => setFormData({...formData, email: e.target.value})} required />
        <input type="password" placeholder="Contraseña (min. 6 caracteres)" style={{ display: 'block', width: '100%', marginBottom: '10px' }}
          onChange={(e) => setFormData({...formData, password: e.target.value})} required />
        <input type="text" placeholder="Teléfono" style={{ display: 'block', width: '100%', marginBottom: '10px' }}
          onChange={(e) => setFormData({...formData, telephone: e.target.value})} required />
        <button type="submit" style={{ width: '100%', padding: '10px', background: '#28a745', color: 'white', border: 'none' }}>Registrarme</button>
      </form>
    </div>
  );
};

export default Register;*/