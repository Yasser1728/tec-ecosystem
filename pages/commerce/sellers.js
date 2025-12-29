import { withAuth } from '../../lib/withAuth';
import { USER_TIERS } from '../../lib/roles';

import BusinessUnitLayout from '../../components/BusinessUnitLayout';
import { businessUnits } from '../../lib/businessUnits';

function CommerceSellers() {
  return (
    <BusinessUnitLayout config={businessUnits.commerce} basePath="/commerce">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Seller Hub</h1>
        <p className="text-lg text-gray-600 mb-8">
          Manage your store and products.
        </p>
        
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Dashboard</h3>
            <p className="text-gray-600">Track sales and performance</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Product Management</h3>
            <p className="text-gray-600">Add and manage your products</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Orders</h3>
            <p className="text-gray-600">Process customer orders</p>
          </div>
        </div>
      </div>
    </BusinessUnitLayout>
  );
}


export default withAuth(CommerceSellers, {
  requiredTier: USER_TIERS.STANDARD,
});
