import { useEffect, useState } from "react";
import { getTokens, logout } from "./api.js";
import Login from "./components/Login.jsx";
import BandLookup from "./components/BandLookup.jsx";
import NewsSearch from "./components/NewsSearch.jsx";
import BandForm from "./components/BandForm.jsx";

const TABS = [
  ["bands", "Buscar banda", BandLookup],
  ["news", "Notícias", NewsSearch],
  ["new", "Cadastrar banda", BandForm],
];

export default function App() {
  const [authed, setAuthed] = useState(!!getTokens());
  const [tab, setTab] = useState("bands");

  useEffect(() => {
    const onLogout = () => setAuthed(false);
    window.addEventListener("ma:logout", onLogout);
    return () => window.removeEventListener("ma:logout", onLogout);
  }, []);

  if (!authed) return <Login onSuccess={() => setAuthed(true)} />;

  const Current = TABS.find(([k]) => k === tab)[2];

  return (
    <div className="shell">
      <header className="top">
        <h1 className="logo">Metal Archives</h1>
        <button className="link" onClick={() => { logout(); setAuthed(false); }}>
          Sair
        </button>
      </header>
      <nav className="tabs" role="tablist">
        {TABS.map(([key, label]) => (
          <button
            key={key}
            role="tab"
            aria-selected={tab === key}
            className={tab === key ? "tab on" : "tab"}
            onClick={() => setTab(key)}
          >
            {label}
          </button>
        ))}
      </nav>
      <main>
        <Current onOpenNews={() => setTab("news")} />
      </main>
    </div>
  );
}
