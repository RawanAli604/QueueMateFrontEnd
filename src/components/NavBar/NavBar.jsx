import { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './NavBar.css';
import { UserContext } from '../../contexts/UserContext';

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

            {user.role === 'customer' && (
              <>
                <li className='nav-link'><Link to='/'>Dashboard</Link></li>
                <li className='nav-link'><Link to='/waitlist'>My Waitlist</Link></li>
                <li className='nav-link'><Link to='/venues'>Venues</Link></li>
              </>
            )}

            {user.role === 'staff' && (
              <>
                <li className='nav-link'><Link to='/'>Dashboard</Link></li>
                <li className='nav-link'><Link to='/venues'>Manage Venues</Link></li>
                <li className='nav-link'><Link to='/create/venue'>Create Venues</Link></li>
              </>
            )}

            {user.role === 'admin' && (
              <>
                <li className='nav-link'><Link to='/'>Admin Dashboard</Link></li>
                <li className='nav-link'><Link to='/admin/staff'>Add Staff</Link></li>
                <li className='nav-link'><Link to='/admin/users'>Manage Users</Link></li>
                <li className='nav-link'><Link to='/analytics'>Analytics</Link></li>
              </>
            )}

            <li className='nav-link'><Link to='/' onClick={handleSignOut}>Sign Out</Link></li>
          </ul>
        ) : (
          <ul className='nav-links'>
            <li className='nav-link'><Link to='/'>Home</Link></li>
            <li className='nav-link'><NavLink to='/about'>About</NavLink></li>
            <li className='nav-link'><Link to='/sign-up'>Sign Up</Link></li>
            <li className='nav-link'><Link to='/sign-in'>Sign In</Link></li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
