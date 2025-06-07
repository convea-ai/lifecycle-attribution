import { useState } from 'react'
import { cn } from '@/lib/utils'
import { 
  BarChart3, 
  TrendingUp, 
  Filter, 
  DollarSign, 
  Brain,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Target
} from 'lucide-react'

const navigationItems = [
  {
    id: 'overview',
    label: 'Dashboard Overview',
    icon: LayoutDashboard,
    href: '#overview'
  },
  {
    id: 'attribution',
    label: 'Multi-Channel Attribution',
    icon: BarChart3,
    href: '#attribution'
  },
  {
    id: 'incrementality',
    label: 'Incremental Lift',
    icon: TrendingUp,
    href: '#incrementality'
  },
  {
    id: 'funnel',
    label: 'Activation Funnel',
    icon: Filter,
    href: '#funnel'
  },
  {
    id: 'ltv',
    label: 'LTV by Source',
    icon: DollarSign,
    href: '#ltv'
  },
  {
    id: 'retention',
    label: 'Retention Intelligence',
    icon: Brain,
    href: '#retention'
  },
  {
    id: 'action-plan',
    label: 'Action Plan',
    icon: Target,
    href: '#action-plan'
  }
]

export const Sidebar = ({ activeSection, onSectionChange }) => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <div className={cn(
      "h-screen bg-card border-r border-border transition-all duration-300 ease-in-out",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          {!isCollapsed && (
            <h2 className="font-semibold text-lg text-card-foreground">
              Attribution
            </h2>
          )}
          <button
            onClick={toggleCollapse}
            className="p-2 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = activeSection === item.id

            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {!isCollapsed && (
                  <span className="truncate">{item.label}</span>
                )}
              </button>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          {!isCollapsed && (
            <div className="text-xs text-muted-foreground">
              <p>Lifecycle Attribution v1.0</p>
              <p className="mt-1">Real-time insights</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 