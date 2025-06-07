# Lifecycle Attribution Dashboard

A comprehensive React dashboard for visualizing end-to-end lifecycle attribution insights for e-commerce brands. Built with React 18, Tailwind CSS, Shadcn/ui, Recharts, and D3.

## Features

### 🎯 **10 Interactive Chart Components**

1. **Customer Journey Flow** - D3 Sankey diagram showing multi-touch paths
2. **Multi-Touch Attribution** - Bar chart comparing assisted vs last-click revenue
3. **Holdout Test Results** - Hybrid chart showing true incremental lift
4. **Incrementality Performance** - Ranked scoreboard by lift per dollar
5. **Activation Funnel** - Funnel analysis with overlay metrics
6. **Behavior-Conversion Analysis** - Scatter plot of engagement vs conversion
7. **LTV by Source** - Line chart tracking lifetime value trends
8. **Product LTV Matrix** - Heatmap of first purchase to LTV correlation
9. **Churn Risk Analysis** - Risk heatmap by segment and recency
10. **Repeat Rate Forecast** - Predictive line chart with variance analysis

### 🎨 **Modern UI/UX**
- Fully responsive design (mobile-first)
- Collapsible sidebar navigation
- Global filters (date range, channels, segments)
- Shadcn/ui components with Tailwind CSS
- Dark/light mode support
- Accessible keyboard navigation

### 🔄 **One-Click Cohort Actions**
- Click any chart element to extract targeted cohorts
- Integration-ready for Klaviyo, Facebook Ads, Google Ads
- Plain-English insights with Recommendation + Impact
- Export functionality for campaign creation

### 📊 **Data Management**
- React Query for efficient data fetching
- Mock data generators for development
- REST API integration (`/api/lifecycle/...`)
- Real-time filter updates across all charts

## Tech Stack

- **Framework**: React 18 with functional components & hooks
- **Styling**: Tailwind CSS + Shadcn/ui components
- **Charts**: Recharts (bar/line/scatter) + D3-sankey
- **State**: React Query for server state, custom hooks for filters
- **Icons**: Lucide React
- **Build**: Vite
- **Development**: Storybook for component development

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd lifecycle-attribution-dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

The dashboard will be available at `http://localhost:5173`

### Development Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Start Storybook
npm run storybook

# Build Storybook
npm run build-storybook
```

## Project Structure

```
src/
├── components/
│   ├── ui/                 # Shadcn/ui base components
│   │   ├── button.jsx
│   │   └── card.jsx
│   ├── layout/             # Layout components
│   │   ├── Header.jsx      # Filters & navigation
│   │   └── Sidebar.jsx     # Section navigation
│   └── charts/             # Chart components
│       ├── SankeyDiagram.jsx
│       ├── AssistedRevenueBar.jsx
│       ├── HoldoutLiftHybrid.jsx
│       ├── IncrementalityScoreboard.jsx
│       ├── FunnelWithMetrics.jsx
│       ├── BehaviorConversionScatter.jsx
│       ├── LTVBySourceLine.jsx
│       ├── ProductLTVMatrix.jsx
│       ├── ChurnRiskHeatmap.jsx
│       └── RepeatRateForecast.jsx
├── hooks/
│   ├── useFilters.js       # Global filter state
│   └── useLifecycleData.js # Data fetching with React Query
├── lib/
│   └── utils.js            # Utility functions
├── pages/
│   └── DashboardPage.jsx   # Main dashboard layout
├── App.jsx                 # App router
├── main.jsx               # React entry point
└── index.css              # Global styles
```

## API Integration

The dashboard expects REST endpoints at `/api/lifecycle/`:

```
GET /api/lifecycle/sankey
GET /api/lifecycle/assistedRevenue
GET /api/lifecycle/holdoutLift
GET /api/lifecycle/incrementalityScoreboard
GET /api/lifecycle/funnelMetrics
GET /api/lifecycle/behaviorConversion
GET /api/lifecycle/ltvBySource
GET /api/lifecycle/productLTVMatrix
GET /api/lifecycle/churnRisk
GET /api/lifecycle/repeatRateForecast
```

### Query Parameters
- `startDate`: YYYY-MM-DD format
- `endDate`: YYYY-MM-DD format  
- `channels`: Comma-separated channel names
- `segment`: Customer segment filter

### Example API Response

```json
// GET /api/lifecycle/assistedRevenue
[
  {
    "channel": "Google Ads",
    "assistedRevenue": 125000,
    "lastClickRevenue": 85000
  },
  {
    "channel": "Meta",
    "assistedRevenue": 98000,
    "lastClickRevenue": 72000
  }
]
```

## Customization

### Adding New Charts

1. Create component in `src/components/charts/`
2. Follow the pattern: `({ data, onAction }) => { ... }`
3. Add to `DashboardPage.jsx` chartSections
4. Update data fetching in `useLifecycleData.js`

### Modifying Filters

Edit `src/hooks/useFilters.js` to add new filter types:

```javascript
const [newFilter, setNewFilter] = useState(defaultValue)

return {
  // ... existing filters
  newFilter,
  updateNewFilter: useCallback((value) => setNewFilter(value), [])
}
```

### Styling Changes

- Global styles: `src/index.css`
- Component styles: Tailwind classes
- Theme colors: CSS variables in `src/index.css`

## Cohort Action Integration

The `handleCohortAction` function in `DashboardPage.jsx` receives cohort data when users click chart elements:

```javascript
const handleCohortAction = (cohort) => {
  // cohort = {
  //   type: 'assisted_channel',
  //   channel: 'Google Ads', 
  //   users: 2500,
  //   description: 'Google Ads assisted revenue cohort'
  // }
  
  // Send to external platforms:
  // - Klaviyo for email campaigns
  // - Facebook Ads for lookalike audiences  
  // - Google Ads for customer match
}
```

## Production Deployment

### Build

```bash
npm run build
```

### Environment Variables

Create `.env.production`:

```
VITE_API_BASE_URL=https://your-api-domain.com
VITE_KLAVIYO_API_KEY=your_klaviyo_key
VITE_FACEBOOK_PIXEL_ID=your_pixel_id
```

### Hosting Options

- **Vercel**: `vercel --prod`
- **Netlify**: Drag `dist/` folder to Netlify
- **AWS S3 + CloudFront**: Upload `dist/` to S3 bucket
- **Docker**: See `Dockerfile` for containerization

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-chart`
3. Commit changes: `git commit -am 'Add new chart component'`
4. Push branch: `git push origin feature/new-chart`
5. Submit pull request

## License

MIT License - see LICENSE file for details

## Support

For questions or issues:
- Create GitHub issue
- Email: support@yourcompany.com
- Documentation: [Link to docs]

---

**Built with ❤️ for data-driven marketers** 