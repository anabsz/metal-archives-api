import { useEffect, useState } from "react";
import { listNews } from "../api.js";
import NewsList from "./NewsList.jsx";

export default function NewsSearch() {
  const [q, setQ] = useState("");
  const [items, setItems] = useState(null);
  const [error, setError] = useState("");

  async function load(term) {
    setError("");
    try {
      setItems(await listNews(term));
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => { load(""); }, []);

  return (
    <section>
      <form onSubmit={(e) => { e.preventDefault(); load(q); }} className="row">
        <input placeholder="Buscar por banda ou título" value={q}
          onChange={(e) => setQ(e.target.value)} aria-label="Buscar notícias" />
        <button className="btn">Buscar</button>
      </form>
      {error && <p className="error">{error}</p>}
      {items === null && !error ? <p className="empty">Carregando…</p> : <NewsList items={items} />}
    </section>
  );
}
