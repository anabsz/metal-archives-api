export default function NewsList({ items }) {
  if (!items?.length) return <p className="empty">Nenhuma notícia encontrada.</p>;
  return (
    <ul className="news">
      {items.map((n) => (
        <li key={n.id}>
          <h3>{n.title}</h3>
          {n.publishedAt && (
            <time dateTime={n.publishedAt}>
              {new Date(n.publishedAt).toLocaleDateString("pt-BR")}
            </time>
          )}
          {n.content && <p>{n.content}</p>}
        </li>
      ))}
    </ul>
  );
}
