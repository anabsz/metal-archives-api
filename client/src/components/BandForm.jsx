import { useState } from "react";
import { createBand } from "../api.js";

const EMPTY = { name: "", genre: "", country: "" };

export default function BandForm() {
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");
  const [created, setCreated] = useState(null);
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setCreated(null);
    try {
      setCreated(await createBand(form));
      setForm(EMPTY);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="card">
      <label>Nome<input required value={form.name} onChange={set("name")} /></label>
      <label>Gênero<input required value={form.genre} onChange={set("genre")} placeholder="Ex.: Thrash Metal" /></label>
      <label>País<input required value={form.country} onChange={set("country")} /></label>
      {error && <p className="error">{error}</p>}
      {created && <p className="ok">Banda cadastrada com ID {created.id}.</p>}
      <button className="btn" disabled={busy}>{busy ? "Salvando…" : "Cadastrar banda"}</button>
    </form>
  );
}
