import { useState } from 'react';
import { useNavigate } from 'react-router';
import { signUp } from '../../services/authService';
import { Link } from 'react-router-dom';


const SignUpForm = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const { username, email, password } = formData;

  const handleChange = (evt) => {
    setMessage('');
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const newUser = await signUp({ username, email, password });
      setUser(newUser);
      navigate('/');
    } catch (err) {
      setMessage(err.message);
    }
  };

  const isFormInvalid = () => !(username && email && password);

  return (
    <main>
      <h1>Sign Up</h1>
      <p>{message}</p>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor='username'>Username:</label>
          <input
            type='text'
            id='username'
            name='username'
            value={username}
            onChange={handleChange}
            autoComplete='username'
            required
          />
        </div>
        <div>
          <label htmlFor='email'>Email:</label>
          <input
            type='email'
            id='email'
            name='email'
            value={email}
            onChange={handleChange}
            autoComplete='email'
            required
          />
        </div>
        <div>
          <label htmlFor='password'>Password:</label>
          <input
            type='password'
            id='password'
            name='password'
            value={password}
            onChange={handleChange}
            autoComplete='new-password'
            required
          />
        </div>
        <div>
          <button type='submit' disabled={isFormInvalid()}>Sign Up</button>
          <button type='button' onClick={() => navigate('/')}>Cancel</button>
        </div>
      </form>
      <p>Already have an account? <button onClick={() =>navigate('/sign-in')}>Log in</button></p>
    </main>
  );
};

export default SignUpForm;
