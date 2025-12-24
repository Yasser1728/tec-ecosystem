export default function DomainCard({ title, description }) {
  return (
    <section
      style={{
        border: "1px solid #333",
        borderRadius: "12px",
        padding: "2rem",
        maxWidth: "520px",
        marginBottom: "20px",
      }}
    >
      <h2 style={{ marginBottom: "10px" }}>{title}</h2>
      <p style={{ opacity: 0.8 }}>{description}</p>
    </section>
  );
}
