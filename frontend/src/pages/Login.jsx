
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Login = () => {

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const { data } = await api.post('/accounts/login', formData);

      localStorage.setItem('token', data.token);

      navigate('/home');

    } catch (err) {

      setError(err.response?.data?.message || 'Error logging in');

    }
  };

  return (

    <div style={{ padding: '40px', maxWidth: '400px', margin: 'auto' }}>

      <h2>Iniciar Sesión</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>

        <input
          type="email"
          placeholder="Email"
          required
          style={{ display: 'block', width: '100%', marginBottom: '10px' }}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          required
          style={{ display: 'block', width: '100%', marginBottom: '10px' }}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />

        <button
          type="submit"
          style={{ width: '100%', padding: '10px', background: '#007bff', color: 'white', border: 'none' }}
        >
          Sign In
        </button>

      </form>

      <p>
        Don't have an account? <Link to="/register">Sign up here</Link>
      </p>

    </div>
  );
};

export default Login;


/*import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/accounts/login', formData);
      localStorage.setItem('token', data.token);
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '400px', margin: 'auto' }}>
      <h2>Iniciar Sesión</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" style={{ display: 'block', width: '100%', marginBottom: '10px' }}
          onChange={(e) => setFormData({...formData, email: e.target.value})} required />
        <input type="password" placeholder="Contraseña" style={{ display: 'block', width: '100%', marginBottom: '10px' }}
          onChange={(e) => setFormData({...formData, password: e.target.value})} required />
        <button type="submit" style={{ width: '100%', padding: '10px', background: '#007bff', color: 'white', border: 'none' }}>Entrar</button>
      </form>
      <p>¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link></p>
    </div>
  );
};

export default Login;*/