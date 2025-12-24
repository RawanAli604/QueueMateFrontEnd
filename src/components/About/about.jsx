const About = () => {
  return (
    <main className="about">
      <h1>About QueueEase</h1>

      <section>
        <p>
          QueueEase is a smart waitlist and venue queue management platform
          designed for restaurants, clinics, lounges, and service venues.
          It helps venues organize customer flow while reducing wait times
          and improving experience on both sides.
        </p>
      </section>

      <section>
        <h2>What customers can do</h2>
        <ul>
          <li>Join venue waitlists remotely</li>
          <li>Track live wait-time and position updates</li>
          <li>Receive reminders and countdown notifications</li>
          <li>View past and upcoming visits</li>
        </ul>
      </section>

      <section>
        <h2>What staff can do</h2>
        <ul>
          <li>Manage venue waitlists in real-time</li>
          <li>View customer queue analytics</li>
          <li>Track capacity and peak hours</li>
          <li>Monitor performance stats across venues</li>
        </ul>
      </section>

      <section>
        <h2>Our goal</h2>
        <p>
          To eliminate physical waiting, reduce operational friction,
          and create a smarter, more predictable guest experience.
        </p>
      </section>
    </main>
  );
};

export default About;
