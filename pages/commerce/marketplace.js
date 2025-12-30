import BusinessUnitLayout from "../../components/BusinessUnitLayout";
import { businessUnits } from "../../lib/businessUnits";

export default function CommerceMarketplace() {
  return (
    <BusinessUnitLayout config={businessUnits.commerce} basePath="/commerce">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Marketplace</h1>
        <p className="text-lg text-gray-600 mb-8">
          Buy and sell products across the TEC ecosystem.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Featured Products</h3>
            <p className="text-gray-600">Top selling items</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">New Arrivals</h3>
            <p className="text-gray-600">Latest products</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Best Deals</h3>
            <p className="text-gray-600">Special offers</p>
          </div>
        </div>
      </div>
    </BusinessUnitLayout>
  );
}
