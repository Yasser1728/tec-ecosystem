import { withAuth } from '../../lib/withAuth';
import { USER_TIERS } from '../../lib/roles';

import BusinessUnitLayout from '../../components/BusinessUnitLayout';
import { businessUnits } from '../../lib/businessUnits';

function ExplorerAnalytics() {
  return (
    <BusinessUnitLayout config={businessUnits.explorer} basePath="/explorer">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Analytics Dashboard</h1>
        <p className="text-lg text-gray-600 mb-8">
          Advanced analytics and performance metrics.
        </p>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-semibold mb-3">Performance Metrics</h3>
          <p className="text-gray-600">Track your portfolio performance</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3">Market Analysis</h3>
          <p className="text-gray-600">Comprehensive market insights</p>
        </div>
      </div>
    </BusinessUnitLayout>
  );
}


export default withAuth(ExplorerAnalytics, {
  requiredTier: USER_TIERS.STANDARD,
});
