# FundX Domain - Investment Strategies & Portfolio Optimization

## 🎯 Domain Mission

FundX (fundx.pi) is the premier investment strategies and portfolio optimization platform within the TEC Ecosystem. It provides sophisticated investment tools, strategies, and analytics for users seeking to maximize returns while managing risk across diverse asset classes.

## 📋 Core Features

### 1. Investment Strategies

- **Pre-built Strategies**: Curated investment strategies (Growth, Value, Income, Balanced)
- **Custom Strategies**: User-defined investment approaches
- **Strategy Backtesting**: Historical performance analysis
- **Risk Assessment**: Comprehensive risk profiling and management

### 2. Portfolio Optimization

- **Modern Portfolio Theory**: Efficient frontier calculations
- **Asset Allocation**: Optimal distribution recommendations
- **Rebalancing**: Automated portfolio rebalancing suggestions
- **Diversification Analysis**: Correlation and risk distribution

### 3. Investment Calculator & Tools

- **ROI Calculator**: Calculate expected returns on investment
- **Compound Interest**: Project long-term growth
- **Risk/Reward Analysis**: Evaluate investment opportunities
- **Tax Impact Calculator**: Estimate tax implications

### 4. Market Intelligence

- **Market Analysis**: Real-time market trends and insights
- **Investment Opportunities**: Curated investment suggestions
- **Research Reports**: Professional analysis and recommendations
- **Economic Indicators**: Key market metrics tracking

## 🔗 Key Entities

### Investment Strategy

- **Attributes**: name, description, riskLevel, targetReturn, assetAllocation, minInvestment
- **Types**: GROWTH, VALUE, INCOME, BALANCED, AGGRESSIVE, CONSERVATIVE
- **Status**: ACTIVE, PAUSED, CLOSED

### User Investment

- **Attributes**: strategyId, amount, shares, entryPrice, currentValue, unrealizedPL
- **Tracking**: Entry date, performance history, dividends, rebalancing events

### Strategy Performance

- **Metrics**: totalReturn, annualizedReturn, sharpeRatio, maxDrawdown, volatility
- **Benchmarks**: Comparison against market indices

## 🔌 API Endpoints

### Strategies

- `GET /api/fundx/strategies` - List available strategies
- `GET /api/fundx/strategies/:id` - Get strategy details
- `POST /api/fundx/strategies` - Create custom strategy (PREMIUM)
- `GET /api/fundx/strategies/:id/performance` - Get performance history

### Investments

- `POST /api/fundx/investments` - Create new investment
- `GET /api/fundx/investments` - List user investments
- `GET /api/fundx/investments/:id` - Get investment details
- `PUT /api/fundx/investments/:id` - Update investment (rebalance)
- `DELETE /api/fundx/investments/:id` - Close investment

### Analytics

- `POST /api/fundx/calculator/roi` - Calculate ROI
- `POST /api/fundx/calculator/compound` - Compound interest projection
- `GET /api/fundx/analytics/market` - Market analysis
- `POST /api/fundx/optimizer/allocate` - Get optimal allocation

## 🔗 Integration with Other Domains

### Assets Domain

**Flow**: Investment → Asset Creation

- When user makes investment, automatically create asset in Assets domain
- Track investment performance in unified portfolio
- Sync valuations for accurate net worth calculation

### Analytics Domain

**Flow**: Performance Data → Analytics

- Share investment performance data for comprehensive analytics
- Contribute to user financial profile
- Enable cross-domain insights

### NBF Domain

**Flow**: Funding → Investment

- Users can fund investments from NBF accounts
- Automated payment processing
- Interest optimization between savings and investments

## 💼 Business Logic

### Investment Creation

```javascript
1. User selects strategy and amount
2. Validate minimum investment requirements
3. Calculate shares based on current NAV
4. Process payment via Pi Network
5. Create investment record
6. Emit event to Assets domain
7. Send confirmation notification
```

### Performance Calculation

```javascript
1. Fetch current NAV of strategy
2. Calculate shares value (shares × NAV)
3. Calculate unrealized P/L (current - cost basis)
4. Calculate percentage return
5. Update investment record
6. Record valuation snapshot
```

## 📊 Sample Data Models

### Investment Strategy Example

```json
{
  "id": "strategy_growth_tech",
  "name": "Tech Growth Portfolio",
  "description": "High-growth technology sector focus",
  "riskLevel": "HIGH",
  "targetReturn": 25.0,
  "minInvestment": 1000,
  "currentNAV": 125.5,
  "assetAllocation": {
    "stocks": 70,
    "crypto": 20,
    "cash": 10
  },
  "performance": {
    "ytd": 18.5,
    "oneYear": 32.8,
    "threeYear": 95.2
  }
}
```

### User Investment Example

```json
{
  "id": "inv_user123_strategy_growth",
  "userId": "user_123",
  "strategyId": "strategy_growth_tech",
  "amount": 10000,
  "shares": 79.68,
  "entryPrice": 125.5,
  "entryDate": "2025-01-01T00:00:00Z",
  "currentNAV": 138.75,
  "currentValue": 11053.2,
  "unrealizedPL": 1053.2,
  "percentageReturn": 10.53,
  "status": "ACTIVE"
}
```

## 🚀 Future Enhancements

1. **AI-Powered Recommendations**: Machine learning for personalized strategies
2. **Social Investing**: Follow successful investors, copy trades
3. **Fractional Investing**: Enable micro-investments
4. **Auto-Invest**: Recurring investment automation
5. **Tax Optimization**: Tax-loss harvesting and optimization

---

**Domain Owner**: FundX Team
**Status**: Active Development
**Last Updated**: January 2026
