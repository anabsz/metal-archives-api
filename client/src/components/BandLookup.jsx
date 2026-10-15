import { useEffect, useState } from "react";
import { getBands, requestByLink } from "../api.js";
import BandCard from "./BandCard.jsx";

export default function BandLookup() {
  const [nameQuery, setNameQuery] = useState("");
  const [bands, setBands] = useState([]);
  const [selectedBandData, setSelectedBandData] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetchBands();
  }, []);

  async function fetchBands(search = "") {
    setBusy(true);
    setError("");
    try {
      const list = await getBands(search);
      setBands(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(err.message || "Erro ao carregar a lista de bandas.");
      setBands([]);
    } finally {
      setBusy(false);
    }
  }

  function handleSearch(e) {
    e.preventDefault();
    setSelectedBandData(null);
    fetchBands(nameQuery);
  }

  async function handleSelectBand(band) {
    setBusy(true);
    setError("");
    try {
      const href = band.links?.self;
      const data = await requestByLink(href);
      setSelectedBandData(data);
    } catch (err) {
      setError(err.status === 404 ? "Banda não encontrada." : err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section>
      <form onSubmit={handleSearch} className="row">
        <input
          type="text"
          placeholder="Digite o nome da banda..."
          value={nameQuery}
          onChange={(e) => setNameQuery(e.target.value)}
          aria-label="Nome da banda"
        />
        <button className="btn" disabled={busy}>
          {busy ? "Buscando…" : "Buscar"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {selectedBandData && (
        <div style={{ marginTop: "2rem" }}>
          <BandCard data={selectedBandData} />
        </div>
      )}

      <div className="band-list" style={{ marginTop: "1.5rem" }}>
        <h3>Catálogo de Bandas</h3>
        {bands.length === 0 && !busy && <p>Nenhuma banda encontrada.</p>}

        <ul style={{ listStyle: "none", padding: 0 }}>
          {bands.map((band) => (
            <li
              key={band.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.5rem 0",
                borderBottom: "1px solid #444",
              }}
            >
              <span>
                <strong>{band.name}</strong> — {band.genre} ({band.country})
              </span>
              <button
                className="btn btn-sm"
                onClick={() => handleSelectBand(band)}
                disabled={busy}
              >
                Ver Detalhes
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
