import { withAuth } from '../../lib/withAuth';
import { USER_TIERS } from '../../lib/roles';

import BusinessUnitLayout from '../../components/BusinessUnitLayout';
import { businessUnits } from '../../lib/businessUnits';

function CommercePayments() {
  return (
    <BusinessUnitLayout config={businessUnits.commerce} basePath="/commerce">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Payment Solutions</h1>
        <p className="text-lg text-gray-600 mb-8">
          Secure payment processing for your transactions.
        </p>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Payment Methods</h3>
            <p className="text-gray-600">Multiple payment options</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Transaction History</h3>
            <p className="text-gray-600">View all transactions</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Security</h3>
            <p className="text-gray-600">Encrypted and secure</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Refunds</h3>
            <p className="text-gray-600">Easy refund processing</p>
          </div>
        </div>
      </div>
    </BusinessUnitLayout>
  );
}


export default withAuth(CommercePayments, {
  requiredTier: USER_TIERS.STANDARD,
});
