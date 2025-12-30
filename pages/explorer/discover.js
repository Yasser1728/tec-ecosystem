import BusinessUnitLayout from "../../components/BusinessUnitLayout";
import { businessUnits } from "../../lib/businessUnits";

export default function ExplorerDiscover() {
  return (
    <BusinessUnitLayout config={businessUnits.explorer} basePath="/explorer">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Discover Opportunities</h1>
        <p className="text-lg text-gray-600 mb-8">
          Explore investment opportunities across the TEC ecosystem.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Market Insights</h3>
            <p className="text-gray-600">Real-time market data and analytics</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Investment Trends</h3>
            <p className="text-gray-600">Track emerging opportunities</p>
          </div>
        </div>
      </div>
    </BusinessUnitLayout>
  );
}
