import { useState } from "react";
import { getBand } from "../api.js";
import NewsList from "./NewsList.jsx";

export default function BandLookup() {
  const [id, setId] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function search(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setData(null);
    try {
      setData(await getBand(id));
    } catch (err) {
      setError(err.status === 404 ? "Banda não encontrada. Confira o ID." : err.message);
    } finally {
      setBusy(false);
    }
  }

  const { name, genre, country, ...extra } = data?.band ?? {};

  return (
    <section>
      <form onSubmit={search} className="row">
        <input type="number" min="1" required placeholder="ID da banda"
          value={id} onChange={(e) => setId(e.target.value)} aria-label="ID da banda" />
        <button className="btn" disabled={busy}>{busy ? "Buscando…" : "Buscar"}</button>
      </form>

      {error && <p className="error">{error}</p>}

      {data && (
        <>
          <article className="sleeve">
            <h2>{name}</h2>
            <dl>
              <dt>Gênero</dt><dd>{genre}</dd>
              <dt>País</dt><dd>{country}</dd>
              {Object.entries(extra).filter(([k]) => k !== "id").map(([k, v]) => (
                <div key={k} className="pair"><dt>{k}</dt><dd>{String(v)}</dd></div>
              ))}
            </dl>
          </article>
          <h3 className="sub">Notícias sobre {name}</h3>
          <NewsList items={data.news} />
        </>
      )}
    </section>
  );
}
