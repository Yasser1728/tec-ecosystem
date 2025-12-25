export default function ServiceCard({title, description}) {
  return (
    <div className="p-4 border rounded shadow-sm">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm">{description}</p>
    </div>
  );
}
