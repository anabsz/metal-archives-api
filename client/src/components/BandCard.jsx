import NewsList from "./NewsList.jsx";

export default function BandCard({ data }) {
  if (!data) return null;

  const { name, genre, country, ...extra } = data.band ?? {};
  const newsItems = data.news ?? [];

  return (
    <div className="band-card">
      <article className="sleeve">
        <h2>{name}</h2>
        <dl>
          <dt>Gênero</dt>
          <dd>{genre}</dd>
          <dt>País</dt>
          <dd>{country}</dd>

          {/* Filtra ID e links para não exibir objetos HATEOAS brutos no <dl> */}
          {Object.entries(extra)
            .filter(([k]) => k !== "id" && k !== "links")
            .map(([k, v]) => (
              <div key={k} className="pair">
                <dt>{k}</dt>
                <dd>{String(v)}</dd>
              </div>
            ))}
        </dl>
      </article>

      <h3 className="sub">Notícias sobre {name}</h3>
      <NewsList items={newsItems} />
    </div>
  );
}
