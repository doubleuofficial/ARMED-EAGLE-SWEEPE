'use client'

import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Target,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  PieChart,
  Activity,
  DollarSign,
  Trophy,
  AlertTriangle
} from 'lucide-react'
import { motion } from 'motion/react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Cell
} from 'recharts'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth-context'
import { createClient } from '@/lib/supabase/client'

// Mock data - in real app, this would come from the database
const profitData = [
  { date: '2024-01-01', profit: 1250, entries: 45, wins: 8 },
  { date: '2024-01-02', profit: 890, entries: 38, wins: 6 },
  { date: '2024-01-03', profit: 2100, entries: 52, wins: 12 },
  { date: '2024-01-04', profit: 1650, entries: 41, wins: 9 },
  { date: '2024-01-05', profit: 3200, entries: 58, wins: 15 },
  { date: '2024-01-06', profit: 2800, entries: 49, wins: 11 },
  { date: '2024-01-07', profit: 1950, entries: 44, wins: 10 },
]

const platformData = [
  { name: 'Stake.us', profit: 4500, entries: 120, winRate: 18.5, color: '#D4AF37' },
  { name: 'Chumba', profit: 3200, entries: 95, winRate: 15.2, color: '#FFD700' },
  { name: 'LuckyLand', profit: 2800, entries: 88, winRate: 12.8, color: '#B8860B' },
  { name: 'WOW Vegas', profit: 2100, entries: 67, winRate: 14.7, color: '#DAA520' },
  { name: 'Pulsz', profit: 1800, entries: 54, winRate: 16.3, color: '#F0E68C' },
]

const monthlyTrends = [
  { month: 'Oct', profit: 8500, target: 8000 },
  { month: 'Nov', profit: 9200, target: 8500 },
  { month: 'Dec', profit: 11800, target: 9000 },
  { month: 'Jan', profit: 12400, target: 9500 },
]

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7d')
  const [selectedMetric, setSelectedMetric] = useState('profit')
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()
  const supabase = createClient()

  const handleExport = () => {
    // In a real app, this would export data to CSV/PDF
    console.log('Exporting analytics data...')
  }

  const handleRefresh = async () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => setIsLoading(false), 2000)
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black tracking-tighter text-white uppercase italic">
            Strategic Analytics Command
          </h2>
          <p className="text-tactical-muted font-mono text-xs uppercase tracking-[0.2em] mt-1">
            Intelligence Division // Real-time Performance Analysis
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-tactical-muted" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-tactical-card border border-tactical-border px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-gold"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
          </div>

          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw size={14} className={cn(isLoading && "animate-spin")} />
            Refresh
          </Button>

          <Button
            onClick={handleExport}
            className="flex items-center gap-2"
          >
            <Download size={14} />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: 'Total Profit',
            value: '$12,450',
            change: '+12.5%',
            trend: 'up',
            icon: DollarSign,
            color: 'text-green-500'
          },
          {
            title: 'Win Rate',
            value: '15.8%',
            change: '+2.1%',
            trend: 'up',
            icon: Target,
            color: 'text-gold'
          },
          {
            title: 'Active Entries',
            value: '247',
            change: '-5.2%',
            trend: 'down',
            icon: Activity,
            color: 'text-blue-500'
          },
          {
            title: 'Best Performer',
            value: 'Stake.us',
            change: '18.5% WR',
            trend: 'up',
            icon: Trophy,
            color: 'text-yellow-500'
          }
        ].map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="top-secret-border bg-tactical-card p-6">
              <div className="flex items-center justify-between mb-4">
                <metric.icon className={cn("w-8 h-8", metric.color)} />
                <div className={cn(
                  "flex items-center gap-1 text-xs font-mono",
                  metric.trend === 'up' ? 'text-green-500' : 'text-red-500'
                )}>
                  {metric.trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {metric.change}
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-white mb-1">{metric.value}</p>
                <p className="text-xs font-mono text-tactical-muted uppercase tracking-widest">
                  {metric.title}
                </p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profit Trend */}
        <Card className="top-secret-border bg-tactical-card p-6" title="Profit Trend Analysis" icon={<BarChart3 size={16} />}>
          <div className="h-80 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={profitData}>
                <defs>
                  <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2D2D2D" />
                <XAxis
                  dataKey="date"
                  stroke="#666"
                  fontSize={10}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis stroke="#666" fontSize={10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1A1A1A',
                    border: '1px solid #2D2D2D',
                    borderRadius: '4px'
                  }}
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <Area
                  type="monotone"
                  dataKey="profit"
                  stroke="#D4AF37"
                  strokeWidth={2}
                  fill="url(#profitGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Platform Performance */}
        <Card className="top-secret-border bg-tactical-card p-6" title="Platform Performance" icon={<PieChart size={16} />}>
          <div className="h-80 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={platformData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#2D2D2D" />
                <XAxis type="number" stroke="#666" fontSize={10} />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="#666"
                  fontSize={10}
                  width={80}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1A1A1A',
                    border: '1px solid #2D2D2D',
                    borderRadius: '4px'
                  }}
                />
                <Bar dataKey="profit" fill="#D4AF37" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Monthly Goals */}
        <Card className="top-secret-border bg-tactical-card p-6" title="Monthly Goal Tracking" icon={<Target size={16} />}>
          <div className="h-80 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2D2D2D" />
                <XAxis dataKey="month" stroke="#666" fontSize={10} />
                <YAxis stroke="#666" fontSize={10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1A1A1A',
                    border: '1px solid #2D2D2D',
                    borderRadius: '4px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke="#D4AF37"
                  strokeWidth={3}
                  dot={{ fill: '#D4AF37', strokeWidth: 2, r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="#666"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: '#666', strokeWidth: 2, r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Win Rate Analysis */}
        <Card className="top-secret-border bg-tactical-card p-6" title="Win Rate Analysis" icon={<Activity size={16} />}>
          <div className="space-y-4 mt-4">
            {platformData.map((platform, index) => (
              <motion.div
                key={platform.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-black/20 rounded border border-tactical-border/50"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: platform.color }}
                  />
                  <span className="text-sm font-medium text-white">{platform.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-gold">{platform.winRate}%</div>
                  <div className="text-xs text-tactical-muted">{platform.entries} entries</div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>

      {/* Advanced Insights */}
      <Card className="top-secret-border bg-tactical-card p-6" title="Advanced Intelligence Report" icon={<AlertTriangle size={16} />}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <h4 className="text-gold font-bold text-sm uppercase tracking-widest">Performance Insights</h4>
            <div className="space-y-2 text-sm">
              <p className="text-green-500">• Stake.us showing 23% profit increase</p>
              <p className="text-yellow-500">• Chumba win rate below average</p>
              <p className="text-tactical-muted">• Consider reducing entries on underperforming platforms</p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-gold font-bold text-sm uppercase tracking-widest">Risk Assessment</h4>
            <div className="space-y-2 text-sm">
              <p className="text-green-500">• Portfolio diversification: Optimal</p>
              <p className="text-yellow-500">• High concentration on Stake.us (38%)</p>
              <p className="text-tactical-muted">• Consider balancing across platforms</p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-gold font-bold text-sm uppercase tracking-widest">Recommendations</h4>
            <div className="space-y-2 text-sm">
              <p className="text-gold">• Increase LuckyLand entries by 15%</p>
              <p className="text-gold">• Monitor WOW Vegas for next month</p>
              <p className="text-tactical-muted">• Target profit goal: $15,000/month</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}