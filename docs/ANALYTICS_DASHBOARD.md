# 📊 Analytics Dashboard System

## Overview

Comprehensive analytics and business intelligence dashboard providing real-time insights across all TEC domains. Supports executive, operational, financial, and domain-specific analytics.

## Architecture

```
┌──────────────────────────────────────────────┐
│         Analytics Dashboard Manager          │
├──────────────────────────────────────────────┤
│  • Data Aggregation Engine                   │
│  • Real-time Metric Collection               │
│  • Dashboard Registry                        │
│  • Caching Layer                             │
│  • Alert System                              │
└────────────┬─────────────────────────────────┘
             │
    ┌────────┴────────┐
    │                 │
┌───▼───┐        ┌───▼────┐
│Metrics│        │Dashboards│
│Store  │        │ Config   │
└───────┘        └──────────┘
```

## Pre-built Dashboards

### 1. Executive Dashboard

**Purpose**: High-level business metrics for C-suite

**Widgets**:
- Total Revenue (all domains)
- Active Users (system domain)
- Transaction Volume (NBF + Commerce)
- Growth Rate (all domains)

```javascript
GET /api/analytics/dashboard?dashboardId=executive&timeRange=30d

Response:
{
  "success": true,
  "dashboard": {
    "id": "executive",
    "name": "Executive Overview",
    "widgets": [
      {
        "type": "revenue",
        "title": "Total Revenue",
        "data": {
          "total": 1250000,
          "breakdown": {
            "commerce": 450000,
            "fundx": 350000,
            "nbf": 250000
          },
          "currency": "USD"
        },
        "trend": {
          "percentage": 12.5,
          "direction": "up"
        }
      }
    ]
  }
}
```

### 2. Operations Dashboard

**Purpose**: System health and performance monitoring

**Widgets**:
- System Availability (all domains)
- Response Times (P50, P95, P99)
- Error Rates
- Request Throughput

### 3. Financial Dashboard

**Purpose**: Financial analytics and performance

**Widgets**:
- Portfolio Value (Assets + FundX)
- Investment Performance (FundX)
- Revenue Streams (Commerce + NBF)
- Return on Investment

### 4. Domain-Specific Dashboards

#### Assets Management
- Total Assets Under Management (AUM)
- Asset Allocation
- Portfolio Performance
- Recent Transactions

#### FundX Investment Platform
- Assets Under Management
- Active Strategies
- Investment Returns
- Active Investors

#### Commerce Analytics
- Total Sales
- Order Volume
- Conversion Rate
- Top Products

## Usage

### Get Available Dashboards

```javascript
GET /api/analytics/dashboard

Response:
{
  "success": true,
  "dashboards": [
    {
      "id": "executive",
      "name": "Executive Overview",
      "widgetCount": 4
    },
    {
      "id": "operations",
      "name": "Operations Monitoring",
      "widgetCount": 4
    }
  ]
}
```

### Get Dashboard Data

```javascript
GET /api/analytics/dashboard?dashboardId=executive&timeRange=24h

// Optional parameters:
// - timeRange: 1h, 6h, 24h, 7d, 30d, 90d, 1y
// - refresh: true (bypass cache)
```

### Record Custom Metric

```javascript
import { analyticsDashboard } from './lib/monitoring/analytics-dashboard.js';

analyticsDashboard.recordMetric(
  'commerce',           // domain
  'order_value',        // metric name
  125.50,              // value
  {                    // metadata
    productId: 'prod_123',
    category: 'electronics'
  }
);
```

### Create Custom Dashboard

```javascript
analyticsDashboard.registerDashboard('custom', {
  name: 'Custom Analytics',
  widgets: [
    {
      type: 'revenue',
      title: 'Monthly Revenue',
      domains: ['commerce']
    },
    {
      type: 'users',
      title: 'User Growth',
      domains: ['system']
    }
  ]
});
```

## Widget Types

### 1. Revenue Widget

Displays revenue metrics and trends.

```json
{
  "type": "revenue",
  "title": "Total Revenue",
  "domains": ["commerce", "fundx", "nbf"],
  "data": {
    "total": 1250000,
    "breakdown": { ... },
    "currency": "USD",
    "period": { ... }
  },
  "trend": {
    "percentage": 12.5,
    "direction": "up",
    "comparison": "previous_period"
  }
}
```

### 2. Users Widget

Shows active user metrics.

```json
{
  "type": "users",
  "title": "Active Users",
  "domains": ["system"],
  "data": {
    "total": 15420,
    "new": 342,
    "returning": 15078,
    "breakdown": {
      "daily": 8500,
      "weekly": 12000,
      "monthly": 15420
    }
  }
}
```

### 3. Transactions Widget

Displays transaction volume and success rates.

```json
{
  "type": "transactions",
  "title": "Transaction Volume",
  "domains": ["nbf", "commerce"],
  "data": {
    "total": 45320,
    "successful": 44890,
    "failed": 430,
    "successRate": 99.05,
    "averageValue": 275.50
  }
}
```

### 4. Availability Widget

Shows system uptime and availability.

```json
{
  "type": "availability",
  "title": "System Availability",
  "domains": ["all"],
  "data": {
    "overall": 99.95,
    "byDomain": {
      "assets": 99.97,
      "fundx": 99.94,
      "commerce": 99.93
    },
    "sloTarget": 99.9
  }
}
```

### 5. Latency Widget

Displays response time metrics.

```json
{
  "type": "latency",
  "title": "Response Times",
  "domains": ["all"],
  "data": {
    "p50": 45,
    "p95": 120,
    "p99": 380,
    "average": 75,
    "byDomain": { ... }
  }
}
```

## Real-time Updates

### WebSocket Integration (Planned)

```javascript
const ws = new WebSocket('wss://api.tec.pi/analytics/stream');

ws.onmessage = (event) => {
  const update = JSON.parse(event.data);
  // update = {
  //   domain: 'commerce',
  //   metric: 'order_count',
  //   value: 1,
  //   timestamp: 1706342400000
  // }
  
  updateDashboard(update);
};
```

### Server-Sent Events (Planned)

```javascript
const eventSource = new EventSource('/api/analytics/stream');

eventSource.onmessage = (event) => {
  const update = JSON.parse(event.data);
  updateDashboard(update);
};
```

## Time Ranges

Supported time ranges:

| Range | Description | Data Points |
|-------|-------------|-------------|
| 1h | Last hour | Every minute |
| 6h | Last 6 hours | Every 5 minutes |
| 24h | Last day | Every 15 minutes |
| 7d | Last week | Every hour |
| 30d | Last month | Every 4 hours |
| 90d | Last quarter | Every day |
| 1y | Last year | Every week |

## Caching

- **Default TTL**: 1 minute for real-time dashboards
- **Executive Dashboard**: 5 minutes
- **Historical Data**: 1 hour
- **Cache Strategy**: Time-based expiration

```javascript
// Bypass cache
GET /api/analytics/dashboard?dashboardId=executive&refresh=true
```

## Data Aggregation

### Aggregation Intervals

- **Real-time**: No aggregation, raw data
- **Minutes**: 1-minute rollup
- **Hours**: 1-hour rollup
- **Days**: 1-day rollup

### Aggregation Functions

- **Sum**: Total value (revenue, transactions)
- **Average**: Mean value (latency, load)
- **Count**: Number of occurrences (users, orders)
- **Min/Max**: Range values
- **Percentiles**: P50, P95, P99 (latency)

## Alert System

### Alert Rules

```javascript
const alertConfig = {
  revenue: {
    threshold: 1000000,
    condition: 'below',
    period: '24h',
    action: 'email'
  },
  errorRate: {
    threshold: 1.0,
    condition: 'above',
    period: '1h',
    action: 'pagerduty'
  }
};
```

### Alert Channels

- **Email**: Standard alerts
- **Slack**: Team notifications
- **PagerDuty**: Critical incidents
- **Webhook**: Custom integrations

## Performance

### Query Optimization

- Pre-aggregated data for common queries
- Indexed time-series data
- Materialized views for complex metrics
- Connection pooling

### Scalability

- Horizontal scaling support
- Read replicas for analytics queries
- Data partitioning by time
- Archive old data (> 1 year)

## Export Options

### CSV Export

```bash
GET /api/analytics/export?dashboardId=executive&format=csv&timeRange=30d
```

### JSON Export

```bash
GET /api/analytics/export?dashboardId=executive&format=json&timeRange=30d
```

### PDF Report (Planned)

```bash
POST /api/analytics/report
{
  "dashboardId": "executive",
  "timeRange": "30d",
  "format": "pdf",
  "email": "exec@tec.pi"
}
```

## Integration Examples

### React Dashboard

```jsx
import React, { useEffect, useState } from 'react';

function AnalyticsDashboard() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    async function fetchDashboard() {
      const response = await fetch('/api/analytics/dashboard?dashboardId=executive');
      const result = await response.json();
      setData(result.dashboard);
    }
    
    fetchDashboard();
    
    // Refresh every minute
    const interval = setInterval(fetchDashboard, 60000);
    return () => clearInterval(interval);
  }, []);
  
  if (!data) return <div>Loading...</div>;
  
  return (
    <div className="dashboard">
      <h1>{data.name}</h1>
      {data.widgets.map(widget => (
        <Widget key={widget.type} data={widget} />
      ))}
    </div>
  );
}
```

### Vue Dashboard

```vue
<template>
  <div class="dashboard">
    <h1>{{ dashboard.name }}</h1>
    <widget v-for="widget in dashboard.widgets" 
            :key="widget.type" 
            :data="widget" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      dashboard: null
    };
  },
  async mounted() {
    await this.loadDashboard();
    setInterval(this.loadDashboard, 60000);
  },
  methods: {
    async loadDashboard() {
      const response = await fetch('/api/analytics/dashboard?dashboardId=executive');
      const result = await response.json();
      this.dashboard = result.dashboard;
    }
  }
};
</script>
```

## Best Practices

1. **Choose Appropriate Time Range**
   - Real-time: 1h - 6h
   - Daily review: 24h - 7d
   - Monthly review: 30d - 90d

2. **Use Caching Wisely**
   - Executive dashboards: 5-minute cache
   - Operational dashboards: 1-minute cache
   - Historical analysis: 1-hour cache

3. **Limit Widget Count**
   - Mobile: 2-4 widgets
   - Desktop: 4-8 widgets
   - Large screen: 8-12 widgets

4. **Set Up Alerts**
   - Critical metrics: Real-time alerts
   - Important metrics: Hourly digest
   - Informational: Daily summary

## Troubleshooting

### Slow Dashboard Loading

**Cause**: Complex queries, no caching
**Solution**: 
- Enable caching
- Reduce time range
- Pre-aggregate data

### Inconsistent Data

**Cause**: Clock skew, caching issues
**Solution**:
- Sync system clocks (NTP)
- Clear cache
- Check aggregation logic

### Missing Metrics

**Cause**: Data not being recorded
**Solution**:
- Verify metric recording code
- Check domain health
- Review error logs

## Future Enhancements

- [ ] Custom widget builder UI
- [ ] Drag-and-drop dashboard designer
- [ ] Advanced filtering and segmentation
- [ ] Predictive analytics
- [ ] Anomaly detection
- [ ] Scheduled reports
- [ ] Mobile app integration

## Support

For analytics questions:
- Analytics team: analytics@tec.pi
- Slack: #analytics-support
- Documentation: https://docs.tec.pi/analytics

---

**Last Updated**: January 2026  
**Version**: 1.0.0  
**Maintained By**: TEC Analytics Team
