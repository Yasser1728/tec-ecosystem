export default function Header() {
  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">TEC Ecosystem</h1>
        <nav>
          <a href="/" className="px-3">Home</a>
          <a href="/app" className="px-3">Dashboard</a>
          <a href="/contact" className="px-3">Contact</a>
        </nav>
      </div>
    </header>
  )
}
