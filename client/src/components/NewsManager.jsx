import { useEffect, useState } from "react";
import { listNews, createNews, updateNews, deleteNews, requestByLink } from "../api.js";
import Modal from "./Modal.jsx";

const EMPTY_NEWS = { title: "", content: "" };

export default function NewsManager() {
  const [newsList, setNewsList] = useState([]);
  const [form, setForm] = useState(EMPTY_NEWS);
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalDetailOpen, setIsModalDetailOpen] = useState(false);
  const [selectedNewsData, setSelectedNewsData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { loadNews(); }, []);

  async function loadNews(term = "") {
    setBusy(true);
    setError("");
    try {
      const data = await listNews(term);
      setNewsList(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Erro ao carregar notícias.");
    } finally {
      setBusy(false);
    }
  }

  function handleOpenCreate() {
    setEditingId(null);
    setForm(EMPTY_NEWS);
    setError("");
    setIsModalOpen(true);
  }

  function handleOpenEdit(news) {
    setEditingId(news.id);
    setForm({
      title: news.title || "",
      content: news.content || ""
    });
    setError("");
    setIsModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (editingId) {
        await updateNews(editingId, form);
      } else {
        await createNews(form);
      }
      setIsModalOpen(false);
      setForm(EMPTY_NEWS);
      await loadNews(searchQuery);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleSelectNews(news) {
    setIsModalDetailOpen(true);
    setBusy(true);
    try {
      const href = news.links?.self;
      const data = await requestByLink(href);
      setSelectedNewsData(data || news);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(news) {
    setBusy(true);
    try {
      const href = news.links?.self;
      await requestByLink(href, { method: "DELETE" });
      if (selectedNewsData?.id === news.id) setSelectedNewsData(null);
      await loadNews(searchQuery);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <h2>Gerenciamento de Notícias</h2>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); loadNews(searchQuery); }} className="row">
        <button type="button" className="btn" onClick={handleOpenCreate}>
          + Nova Notícia
        </button>
        <input
          placeholder="Buscar notícia por título ou conteúdo..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="btn" disabled={busy}>Buscar</button>
      </form>

      {error && <p className="error" style={{ marginTop: "1rem" }}>{error}</p>}

      <div style={{ marginTop: "1.5rem" }}>
        <h3>Notícias Cadastradas</h3>
        {newsList.length === 0 && !busy && <p>Nenhuma notícia encontrada.</p>}

        <ul style={{ listStyle: "none", padding: 0 }}>
          {newsList.map((n) => (
            <li key={n.id} style={{ padding: "1rem 0", borderBottom: "1px solid #444" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <h4>{n.title}</h4>
                  <p>{n.content}</p>
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button className="btn btn-sm" onClick={() => handleSelectNews(n)} disabled={busy}>Detalhes</button>
                  <button className="btn btn-sm btn-secondary" onClick={() => handleOpenEdit(n)} disabled={busy}>Editar</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(n)} disabled={busy}>Excluir</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* MODAL DE CADASTRO / EDIÇÃO */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Editar Notícia" : "Cadastrar Nova Notícia"}
      >
        <form onSubmit={handleSubmit}>
          <label>Título
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </label>
          <label>Conteúdo
            <textarea required value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={4} />
          </label>

          {error && <p className="error" style={{ marginTop: "0.5rem" }}>{error}</p>}

          <div className="row" style={{ marginTop: "1.5rem", justifyContent: "flex-end" }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </button>
            <button className="btn" disabled={busy}>
              {busy ? "Salvando…" : editingId ? "Atualizar" : "Publicar"}
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL DE DETALHES (HATEOAS) */}
      <Modal
        isOpen={isModalDetailOpen}
        onClose={() => setIsModalDetailOpen(false)}
        title="Detalhes da Notícia"
      >
        {selectedNewsData ? (
          <div>
            <h3>{selectedNewsData.title}</h3>
            {selectedNewsData.publishedAt && (
              <p><small>Publicado em: {selectedNewsData.publishedAt}</small></p>
            )}
            <p style={{ marginTop: "1rem", whiteSpace: "pre-wrap" }}>{selectedNewsData.content}</p>
          </div>
        ) : (
          <p>{busy ? "Carregando..." : "Nenhum detalhe disponível."}</p>
        )}
      </Modal>
    </section>
  );
}
