/**
 * ServiceCard Component
 * 
 * A reusable card component for displaying service information.
 * Features a title and description with consistent styling.
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - The title of the service
 * @param {string} props.description - The description of the service
 * @returns {JSX.Element} The rendered service card
 * 
 * @example
 * ```jsx
 * import ServiceCard from '@/components/ServiceCard';
 * 
 * function ServicesPage() {
 *   return (
 *     <ServiceCard 
 *       title="Web Development" 
 *       description="Build modern web applications"
 *     />
 *   );
 * }
 * ```
 */
export default function ServiceCard({title, description}) {
  return (
    <div className="p-4 border rounded shadow-sm">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm">{description}</p>
    </div>
  );
}
