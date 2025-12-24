import './Landing.css';

const Landing = () => {
  return (
    <main className="landing">
      <div className="landing-hero">
        <h1>QueueEase</h1>
        <p>Smart waitlist & venue queue management — fast, simple, reliable.</p>

        <div className="cta-group">
          <button onClick={() => window.location.href='/sign-up'}>
            Create Account
          </button>

          <button
            className="secondary"
            onClick={() => window.location.href='/sign-in'}
          >
            Sign In
          </button>
        </div>
      </div>
    </main>
  );
};

export default Landing;

