const BASE = import.meta.env.VITE_API_URL ?? "/api";
const KEY = "ma_tokens";

export const getTokens = () => JSON.parse(localStorage.getItem(KEY) || "null");
const setTokens = (t) => localStorage.setItem(KEY, JSON.stringify(t));
export const logout = () => localStorage.removeItem(KEY);

async function parse(res) {
  if (res.status === 204) return null;
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const err = new Error(body?.erro || body?.detail || `Erro ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return body;
}

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

async function request(pathOrUrl, options = {}, retry = true) {
  let url = pathOrUrl;

  if (!pathOrUrl.startsWith("http")) {
    const cleanPath = pathOrUrl.startsWith("/api")
      ? pathOrUrl.replace(/^\/api/, "")
      : pathOrUrl;
    url = `${BASE}${cleanPath.startsWith("/") ? "" : "/"}${cleanPath}`;
  }

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getTokens()?.access}`,
      ...options.headers,
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
    return request(pathOrUrl, options, false);
  }
  return parse(res);
}

// Navegaçao generica
export const requestByLink = (linkUrl, options = {}) => request(linkUrl, options);

// Bandas
export const getBands = (search = "") =>
  request(`/bands${search ? `?search=${search}` : ""}`);

export const getBand = (id) => request(`/bands/${id}`);

export const createBand = (data) =>
  request("/bands", {method: "POST", body: JSON.stringify(data)});

export const updateBand = (data) =>
  request("/bands", {method: "PUT", body: JSON.stringify(data)});

export const deleteBand = (data) =>
  request("/bands", {method: "DELETE", body: JSON.stringify(data)})

// Noticias
export const listNews = (search = "") =>
  request(`/news${search ? `?search=${search}` : ""}`);

export const createNews = (newsData) =>
  request("/news", { method: "POST", body: JSON.stringify(newsData) });

export const updateNews = (newsData) =>
  request("/news", { method: "PUT", body: JSON.stringify(newsData) });

export const deleteNews = (newsId) =>
  request(`/news/${newsId}`, { method: "DELETE" });
