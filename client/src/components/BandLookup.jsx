import { useEffect, useState } from "react";
import { getBands, getBand } from "../api.js";
import BandCard from "./BandCard.jsx";

export default function BandLookup() {
  const [nameQuery, setNameQuery] = useState("");
  const [bands, setBands] = useState([]);
  const [selectedBandData, setSelectedBandData] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // Carrega todas as bandas ao montar a tela
  useEffect(() => {
    fetchBands();
  }, []);

  async function fetchBands(search = "") {
    setBusy(true);
    setError("");
    try {
      const list = await getBands(search);
      setBands(list);
    } catch (err) {
      setError(err.message || "Erro ao carregar a lista de bandas.");
    } finally {
      setBusy(false);
    }
  }

  function handleSearch(e) {
    e.preventDefault();
    setSelectedBandData(null); // Reseta a banda selecionada ao pesquisar
    fetchBands(nameQuery);
  }

  async function handleSelectBand(bandId) {
    setBusy(true);
    setError("");
    try {
      // Busca detalhes da banda + notícias no Gateway
      const data = await getBand(bandId);
      setSelectedBandData(data);
    } catch (err) {
      setError(err.status === 404 ? "Banda não encontrada." : err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section>
      {/* Formulário de Pesquisa por Nome */}
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

      {/* Lista de Bandas Carregadas */}
      <div className="band-list" style={{ marginTop: "1.5rem" }}>
        <h3>Catálogo de Bandas ({bands.length})</h3>
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
                borderBottom: "1px solid #444"
              }}
            >
              <span>
                <strong>{band.name}</strong> — {band.genre} ({band.country})
              </span>
              <button
                className="btn-sm"
                onClick={() => handleSelectBand(band.id)}
                disabled={busy}
              >
                Ver Detalhes e Notícias
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Exibe o componente BandCard quando uma banda for selecionada */}
      {selectedBandData && (
        <div style={{ marginTop: "2rem" }}>
          <BandCard data={selectedBandData} />
        </div>
      )}
    </section>
  );
}
