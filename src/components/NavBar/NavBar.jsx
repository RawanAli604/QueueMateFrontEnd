import { useContext } from 'react';
import { Link } from 'react-router';
import './NavBar.css';
import { UserContext } from '../../contexts/UserContext';
import { NavLink } from "react-router-dom";

const NavBar = () => {

  const { user, setUser } = useContext(UserContext);

   const handleSignOut = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <nav className='navbar'>
      <div className='nav-container'>
        <div className='nav-logo'>
          QueueMate
        </div>
      {user ? (
        <ul className='nav-links'>
          <li className='nav-link'><Link to='/'>Dashboard</Link></li>
          <li className='nav-link'><Link to='/venues'>Browse Venues</Link></li>
          <li className='nav-link'><Link to='/waitlist'>History</Link></li>
          <li className='nav-link'><Link to='/' onClick={handleSignOut}>Sign Out</Link></li>
        </ul>
      ) : (
        <ul>
          <li className='nav-link'><Link to='/'>Home</Link></li>
          <li className='nav-link'><NavLink to="/about">About</NavLink></li>
          <li className='nav-link'><Link to='/sign-up'>Sign Up</Link></li>
          <li className='nav-link'><Link to='/sign-in'>Sign In</Link></li>
        </ul>
      )}
      </div>
    </nav>
  );
};

export default NavBar;

