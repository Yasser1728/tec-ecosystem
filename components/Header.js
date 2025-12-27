/**
 * Header Component
 * 
 * A simple header component displaying the TEC Ecosystem title.
 * Used across pages for consistent branding.
 * 
 * @returns {JSX.Element} The rendered header element
 * 
 * @example
 * ```jsx
 * import Header from '@/components/Header';
 * 
 * function Page() {
 *   return <Header />;
 * }
 * ```
 */
export default function Header() {
  return (
    <header className="p-4 bg-gray-100">
      <h1 className="text-2xl font-bold">TEC Ecosystem</h1>
    </header>
  );
}
