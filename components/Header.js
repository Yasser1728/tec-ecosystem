import { LanguageToggle } from "./layout";

export default function Header() {
  return (
    <header className="p-4 bg-gray-900 border-b border-[#00ff9d]/20">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] bg-clip-text text-transparent">
            TEC Ecosystem
          </h1>
          <p className="text-xs text-gray-400">Titan Elite Commerce</p>
        </div>
        <div className="flex items-center gap-4">
          <LanguageToggle compact />
          <div className="text-sm text-gray-400">Powered by Pi Network</div>
        </div>
      </div>
    </header>
  );
}
