export default function HomeFooter({ t }) {
  return (
    <footer className="text-center py-10 opacity-70">
      <h3 className="text-xl font-bold mb-2">{t.contactTitle}</h3>
      <p className="mb-1">support@tec.pi</p>
      <p className="text-sm text-gray-400">{t.copyright}</p>
    </footer>
  );
}
