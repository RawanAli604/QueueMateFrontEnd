import { useEffect, useState } from "react";
import { getAllVenues } from "../../services/venueService";
import "./Venueslist.css";

export default function VenuesPage() {
  const [venues, setVenues] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllVenues()
      .then((data) => setVenues(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = venues
    .filter((v) => v.name?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "capacity") return b.max_capacity - a.max_capacity;
      if (sortBy === "serviceTime") return a.avg_service_time - b.avg_service_time;
      return a.name.localeCompare(b.name);
    });

  return (
    <main className="venues-page">
      <header className="venues-header">
        <h1>Venues</h1>

        <div className="control-bar">
          <input
            className="search-box"
            placeholder="Search venues…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">Sort by Name</option>
            <option value="capacity">Sort by Capacity</option>
            <option value="serviceTime">Sort by Service Time</option>
          </select>
        </div>
      </header>

      {loading && <p>Loading venues...</p>}
      {!loading && filtered.length === 0 && <p>No venues found.</p>}

      <section className="grid">
        {filtered.map((v, index) => (
          <a
            key={v.id ?? index}
            href={`/venues/${v.id}`}
            className="card"
          >
            <div className="image-wrapper">
              <img src={v.image_url || "/placeholder.jpg"} alt={v.name} />
            </div>
            <h2 className="venue-name">{v.name}</h2>
          </a>
        ))}
      </section>
    </main>
  );
}
