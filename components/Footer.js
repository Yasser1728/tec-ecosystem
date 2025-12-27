/**
 * Footer Component
 * 
 * A footer component displaying copyright information with dynamic year.
 * Automatically updates the copyright year based on the current date.
 * 
 * @returns {JSX.Element} The rendered footer element
 * 
 * @example
 * ```jsx
 * import Footer from '@/components/Footer';
 * 
 * function Page() {
 *   return (
 *     <>
 *       <main>Content</main>
 *       <Footer />
 *     </>
 *   );
 * }
 * ```
 */
export default function Footer() {
  return (
    <footer className="p-4 bg-gray-100 text-center">
      © {new Date().getFullYear()} TEC Ecosystem
    </footer>
  );
}
