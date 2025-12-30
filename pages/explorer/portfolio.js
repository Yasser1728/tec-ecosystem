import { withAuth } from "../../lib/withAuth";
import { USER_TIERS } from "../../lib/roles";

import BusinessUnitLayout from "../../components/BusinessUnitLayout";
import { businessUnits } from "../../lib/businessUnits";

function ExplorerPortfolio() {
  return (
    <BusinessUnitLayout config={businessUnits.explorer} basePath="/explorer">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Portfolio Management</h1>
        <p className="text-lg text-gray-600 mb-8">
          Manage and optimize your investment portfolio.
        </p>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Your Holdings</h3>
            <p className="text-gray-600">View and manage your investments</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Asset Allocation</h3>
            <p className="text-gray-600">
              Optimize your portfolio distribution
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Risk Assessment</h3>
            <p className="text-gray-600">Evaluate portfolio risk levels</p>
          </div>
        </div>
      </div>
    </BusinessUnitLayout>
  );
}

export default withAuth(ExplorerPortfolio, {
  requiredTier: USER_TIERS.STANDARD,
});
