import { useState } from "react";
import { login } from "../api.js";

export default function Login({ onSuccess }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await login(form.username, form.password);
      onSuccess();
    } catch (err) {
      setError(err.status === 401 ? "Usuário ou senha incorretos." : err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="login">
      <h1 className="logo big">Metal Archives</h1>
      <form onSubmit={submit} className="card">
        <label>
          Usuário
          <input value={form.username} autoFocus required
            onChange={(e) => setForm({ ...form, username: e.target.value })} />
        </label>
        <label>
          Senha
          <input type="password" value={form.password} required
            onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </label>
        {error && <p className="error">{error}</p>}
        <button className="btn" disabled={busy}>{busy ? "Entrando…" : "Entrar"}</button>
      </form>
    </div>
  );
}
