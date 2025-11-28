export default function ServiceCard({ service }) {
  return (
    <a href={service.url} className="block border rounded-lg p-6 shadow hover:shadow-lg transition">
      <h2 className="text-2xl font-semibold mb-2">{service.name}</h2>
      <p className="text-gray-600">{service.description}</p>
      <p className="text-sm text-gray-400 mt-2">{service.domain}</p>
    </a>
  )
}
