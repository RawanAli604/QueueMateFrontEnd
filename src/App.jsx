
import { Routes, Route } from 'react-router';
import NavBar from './components/NavBar/NavBar';
import SignUpForm from './components/SignUpForm/SignUpForm';
import SignInForm from './components/SignInForm/SignInForm';
import Landing from './components/Landing/Landing';
import Dashboard from './components/Dashboard/Dashboard';
import About from './components/About/About';
import Venues from './components/Venueslist/Venueslist';
import Venuedetail from './components/Venuedetail/Venuedetail';
import Waitlisthistory from './components/Waitlisthistory/Waitlisthistory';
import Venuewaitlist from './components/Venuewaitlist/Venuewaitlist'
import Createvenue from './components/CreateVenue/CreateVenue';
import { useContext } from 'react';
import { UserContext } from './contexts/UserContext';

const App = () => {
  const { user } = useContext(UserContext);

  return (
    <>
      <NavBar />

      <Routes>
        {
          user ?
          <>
            <Route path='/' element={<Dashboard/>}/>
            <Route path='/venues' element={<Venues/>}/>
            <Route path='/venues/:id' element={<Venuedetail />} />
            <Route path='/waitlist' element={<Waitlisthistory />} /> 
            <Route path='/waitlist/my/:id' element={<Venuewaitlist />} /> 
            <Route path='/create/venue' element={<Createvenue />} />
          </>
            :
            <>
            <Route path='/' element={<Landing/>}/>
            <Route path='/about' element={<About />}/>
            <Route path='/sign-up' element={<SignUpForm />} />
            <Route path='/sign-in' element={<SignInForm />} />
            </>
        }
      </Routes>
    </>
  );
};

export default App;

