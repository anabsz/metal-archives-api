const BASE = import.meta.env.VITE_API_URL ?? "/api";
const KEY = "ma_tokens";

export const getTokens = () => JSON.parse(localStorage.getItem(KEY) || "null");
const setTokens = (t) => localStorage.setItem(KEY, JSON.stringify(t));
export const logout = () => localStorage.removeItem(KEY);

async function parse(res) {
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const err = new Error(body?.erro || body?.detail || `Erro ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return body;
}

// Rotas do ninja_jwt (obtain_pair_router montado em /auth): /auth/pair e /auth/refresh
export async function login(username, password) {
  const res = await fetch(`${BASE}/auth/pair`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  setTokens(await parse(res));
}

async function refresh() {
  const t = getTokens();
  if (!t?.refresh) throw new Error("Sessão expirada");
  const res = await fetch(`${BASE}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh: t.refresh }),
  });
  setTokens({ ...t, ...(await parse(res)) });
}

async function request(path, options = {}, retry = true) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getTokens()?.access}`,
    },
  });
  if (res.status === 401 && retry) {
    try {
      await refresh();
    } catch {
      logout();
      window.dispatchEvent(new Event("ma:logout"));
      throw new Error("Sessão expirada. Entre novamente.");
    }
    return request(path, options, false);
  }
  return parse(res);
}

export const getBand = (id) => request(`/bands/${id}`);
export const getBands = (search = "") => request(`/bands${search ? `?search=${encodeURIComponent(search)}` : ""}`);
export const createBand = (data) =>
  request("/bands/", { method: "POST", body: JSON.stringify(data) });
export const listNews = (search = "") =>
  request(`/news${search ? `?search=${encodeURIComponent(search)}` : ""}`);
