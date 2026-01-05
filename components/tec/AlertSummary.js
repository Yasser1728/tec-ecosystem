import { useState, useEffect } from 'react';

/**
 * AlertSummary Component
 * Displays a summary of user alerts and notifications
 */
export default function AlertSummary({ userId }) {
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    // Simulate fetching alerts
    const fetchAlerts = async () => {
      setIsLoading(true);
      try {
        // Mock data - replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setAlerts([
          {
            id: '1',
            type: 'info',
            title: 'New Domain Available',
            message: 'TEC Explorer is now available for preview',
            timestamp: new Date(Date.now() - 1800000).toISOString(),
            read: false,
          },
          {
            id: '2',
            type: 'warning',
            title: 'Subscription Renewal',
            message: 'Your subscription will renew in 7 days',
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            read: false,
          },
        ]);
      } catch (error) {
        console.error('Error fetching alerts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlerts();
  }, [userId]);

  const getAlertIcon = (type) => {
    switch (type) {
      case 'info':
        return '💡';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      case 'success':
        return '✅';
      default:
        return '📢';
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'info':
        return 'border-blue-500/30 bg-blue-500/10';
      case 'warning':
        return 'border-yellow-500/30 bg-yellow-500/10';
      case 'error':
        return 'border-red-500/30 bg-red-500/10';
      case 'success':
        return 'border-green-500/30 bg-green-500/10';
      default:
        return 'border-gray-500/30 bg-gray-500/10';
    }
  };

  const unreadCount = alerts.filter(a => !a.read).length;
  const displayAlerts = expanded ? alerts : alerts.slice(0, 2);

  if (isLoading) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-700 rounded w-1/2"></div>
          <div className="h-16 bg-gray-700 rounded"></div>
          <div className="h-16 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h3 className="text-xl font-bold text-[#00ff9d]">Alerts</h3>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        {alerts.length > 2 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-[#00c6ff] hover:text-[#00ff9d] text-sm font-semibold transition-colors"
          >
            {expanded ? 'Show Less' : 'View All'}
          </button>
        )}
      </div>

      {/* Alerts List */}
      {alerts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400">No alerts at this time</p>
          <p className="text-sm text-gray-500 mt-2">You're all caught up! ✨</p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border ${getAlertColor(alert.type)} ${
                !alert.read ? 'font-semibold' : 'opacity-75'
              } transition-all hover:opacity-100`}
            >
              <div className="flex items-start space-x-3">
                <span className="text-2xl">{getAlertIcon(alert.type)}</span>
                <div className="flex-1">
                  <h4 className="text-white mb-1">{alert.title}</h4>
                  <p className="text-sm text-gray-300">{alert.message}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(alert.timestamp).toLocaleString()}
                  </p>
                </div>
                {!alert.read && (
                  <div className="w-2 h-2 bg-[#00ff9d] rounded-full"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      {alerts.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <button className="text-sm text-[#00c6ff] hover:text-[#00ff9d] transition-colors">
            Mark all as read
          </button>
        </div>
      )}
    </div>
  );
}
