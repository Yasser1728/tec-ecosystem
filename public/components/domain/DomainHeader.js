export default function DomainHeader({ title, subtitle }) {
  return (
    <header style={{ padding: "3rem 2rem", borderBottom: "1px solid #222" }}>
      <h1>{title}</h1>
      <p style={{ opacity: 0.7 }}>{subtitle}</p>
    </header>
  );
}
