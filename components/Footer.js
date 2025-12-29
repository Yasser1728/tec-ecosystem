export default function Footer() {
  return (
    <footer className="p-8 bg-gray-900 border-t border-[#00ff9d]/20 text-center">
      <div className="container mx-auto">
        <p className="text-gray-400 mb-2">
          © {new Date().getFullYear()} TEC Ecosystem - Titan Elite Commerce
        </p>
        <p className="text-sm text-gray-500">
          24 Luxury Business Domains | Powered by Pi Network
        </p>
      </div>
    </footer>
  );
}
