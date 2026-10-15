import { useEffect, useState } from "react";
import { getBands, createBand, updateBand, requestByLink } from "../api.js";
import BandCard from "./BandCard.jsx";
import Modal from "./Modal.jsx";

const EMPTY_FORM = { name: "", genre: "", country: "" };

export default function BandManager() {
  const [bands, setBands] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalDetailOpen, setIsModalDetailOpen] = useState(false);
  const [selectedBandData, setSelectedBandData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { loadBands(); }, []);

  async function loadBands(term = "") {
    setBusy(true);
    setError("");
    try {
      const data = await getBands(term);
      setBands(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Erro ao carregar bandas.");
    } finally {
      setBusy(false);
    }
  }

  function handleOpenCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError("");
    setIsModalOpen(true);
  }

  function handleOpenEdit(band) {
    setEditingId(band.id);
    setForm({ name: band.name, genre: band.genre, country: band.country });
    setError("");
    setIsModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (editingId) {
        await updateBand(editingId, form);
      } else {
        await createBand(form);
      }
      setIsModalOpen(false); // Fecha o modal após salvar com sucesso
      setForm(EMPTY_FORM);
      await loadBands(searchQuery);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleSelectBand(band) {
    setIsModalDetailOpen(true);
    setBusy(true);
    try {
      const href = band.links?.self;
      const data = await requestByLink(href);
      setSelectedBandData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(band) {
    setBusy(true);
    try {
      const href = band.links?.self;
      await requestByLink(href, { method: "DELETE" });
      if (selectedBandData?.band?.id === band.id) setSelectedBandData(null);
      await loadBands(searchQuery);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section>
      {/* Barra Superior de Ações */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <h2>Catálogo de Bandas</h2>
      </div>

      {/* Busca */}
      <form onSubmit={(e) => { e.preventDefault(); loadBands(searchQuery); }} className="row">

        <button className="btn" onClick={handleOpenCreate}>
          + Nova Banda
        </button>
        <input
          placeholder="Buscar por nome..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="btn" disabled={busy}>Buscar</button>
      </form>

      {/* Lista de Bandas */}
      <ul style={{ listStyle: "none", padding: 0, marginTop: "1.5rem" }}>
        {bands.map((b) => (
          <li key={b.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem 0", borderBottom: "1px solid #444" }}>
            <span><strong>{b.name}</strong> — {b.genre} ({b.country})</span>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button className="btn btn-sm" onClick={() => handleSelectBand(b)} disabled={busy}>Detalhes</button>
              <button className="btn btn-sm btn-secondary" onClick={() => handleOpenEdit(b)} disabled={busy}>Editar</button>
              <button className="btn btn-sm btn-danger" onClick={() => handleDelete(b)} disabled={busy}>Excluir</button>
            </div>
          </li>
        ))}
      </ul>

      {/* MODAL DE CADASTRO / EDIÇÃO */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Editar Banda" : "Cadastrar Nova Banda"}
      >
        <form onSubmit={handleSubmit}>
          <label>Nome
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </label>
          <label>Gênero
            <input required value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })} placeholder="Ex.: Thrash Metal" />
          </label>
          <label>País
            <input required value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
          </label>

          {error && <p className="error" style={{ marginTop: "0.5rem" }}>{error}</p>}

          <div className="row" style={{ marginTop: "1.5rem", justifyContent: "flex-end" }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </button>
            <button className="btn" disabled={busy}>
              {busy ? "Salvando…" : editingId ? "Atualizar" : "Cadastrar"}
            </button>
          </div>
        </form>
      </Modal>
      <Modal
        isOpen={isModalDetailOpen}
        onClose={() => setIsModalDetailOpen(false)}
        title={"Detalhes da Banda"}
      >
        <BandCard data={selectedBandData} />
      </Modal>

    </section>
  );
}
