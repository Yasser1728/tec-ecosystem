import { useEffect, useState } from 'react';

/**
 * DashboardWidget Component
 * Displays key metrics and information on the TEC dashboard
 */
export default function DashboardWidget({ title, value, subtitle, icon, color = 'green' }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const colorClasses = {
    green: 'from-[#00ff9d] to-[#00c6ff]',
    blue: 'from-[#00c6ff] to-[#0099ff]',
    purple: 'from-[#9d00ff] to-[#c600ff]',
    orange: 'from-[#ff9d00] to-[#ff6600]',
  };

  const borderColors = {
    green: 'border-[#00ff9d]/20',
    blue: 'border-[#00c6ff]/20',
    purple: 'border-[#9d00ff]/20',
    orange: 'border-[#ff9d00]/20',
  };

  return (
    <div className={`bg-gray-800 p-6 rounded-lg border ${borderColors[color]} hover:border-opacity-50 transition-all duration-300`}>
      {isLoading ? (
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded w-3/4 mb-4"></div>
          <div className="h-8 bg-gray-700 rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-gray-700 rounded w-2/3"></div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-300">{title}</h3>
            {icon && (
              <span className={`text-2xl bg-gradient-to-r ${colorClasses[color]} bg-clip-text text-transparent`}>
                {icon}
              </span>
            )}
          </div>
          
          <div className={`text-3xl font-bold mb-2 bg-gradient-to-r ${colorClasses[color]} bg-clip-text text-transparent`}>
            {value}
          </div>
          
          {subtitle && (
            <p className="text-sm text-gray-400">{subtitle}</p>
          )}
        </>
      )}
    </div>
  );
}
