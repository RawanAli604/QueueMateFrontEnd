import './Landing.css';

const Landing = () => {
  return (
    <main className="landing">
      <div className="landing-hero">
        <h1>QueueMate</h1>

        <p className="tagline">
          Manage queues with confidence — smooth, smart, and effortless.
        </p>

        <div className="cta-group">
          <button onClick={() => window.location.href='/sign-up'}>
            Get Started
          </button>

          <button
            className="secondary"
            onClick={() => window.location.href='/sign-in'}
          >
            Sign In
          </button>
        </div>

        <span className="small-hint">
          No hassle • Real-time queue control • Works anywhere
        </span>
      </div>
    </main>
  );
};

export default Landing;
