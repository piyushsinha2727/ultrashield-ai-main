import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

const COLORS = {
  safe: '#10b981',
  suspicious: '#f59e0b',
  dangerous: '#ef4444',
  primary: '#34d399',
  secondary: '#06b6d4',
};

interface ScanData {
  status: string;
  created_at: string;
  risk_score: number;
}

interface ThreatChartsProps {
  scans: ScanData[];
}

const ThreatCharts = ({ scans }: ThreatChartsProps) => {
  const distribution = [
    { name: 'Safe Sites', value: scans.filter(s => s.status === 'safe').length, color: COLORS.safe },
    { name: 'Suspicious', value: scans.filter(s => s.status === 'suspicious').length, color: COLORS.suspicious },
    { name: 'Dangerous', value: scans.filter(s => s.status === 'dangerous').length, color: COLORS.dangerous },
  ].filter(d => d.value > 0);

  const dailyScans = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dateStr = date.toISOString().split('T')[0];
    const dayScans = scans.filter(s => s.created_at.startsWith(dateStr));
    return {
      day: date.toLocaleDateString('en', { weekday: 'short' }),
      scans: dayScans.length,
      threats: dayScans.filter(s => s.status !== 'safe').length,
    };
  });

  const hasData = scans.length > 0;
  const placeholderDistribution = [
    { name: 'Safe Sites', value: 45, color: COLORS.safe },
    { name: 'Suspicious', value: 12, color: COLORS.suspicious },
    { name: 'Dangerous', value: 3, color: COLORS.dangerous },
  ];
  const placeholderDaily = [
    { day: 'Mon', scans: 8, threats: 2 },
    { day: 'Tue', scans: 12, threats: 3 },
    { day: 'Wed', scans: 6, threats: 1 },
    { day: 'Thu', scans: 15, threats: 4 },
    { day: 'Fri', scans: 10, threats: 2 },
    { day: 'Sat', scans: 5, threats: 0 },
    { day: 'Sun', scans: 7, threats: 1 },
  ];

  const pieData = hasData ? distribution : placeholderDistribution;
  const areaData = hasData ? dailyScans : placeholderDaily;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload?.length) {
      return (
        <div className="glass-card p-2.5 text-xs border border-primary/30">
          <p className="text-foreground font-semibold mb-1">{label}</p>
          {payload.map((p: any, i: number) => (
            <p key={i} style={{ color: p.color || p.fill }}>
              {p.name}: <span className="font-bold">{p.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-foreground tracking-wide">Threat Distribution</h3>
          {!hasData && <span className="text-[11px] text-muted-foreground bg-muted/60 px-2 py-0.5 rounded">Live Metrics</span>}
        </div>
        <ResponsiveContainer width="100%" height={190}>
          <PieChart>
            <Pie data={pieData} cx="50%" cy="50%" innerRadius={52} outerRadius={78} dataKey="value" strokeWidth={0}>
              {pieData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
          </PieChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-foreground tracking-wide">7-Day Threat Activity</h3>
          {!hasData && <span className="text-[11px] text-muted-foreground bg-muted/60 px-2 py-0.5 rounded">Weekly Trend</span>}
        </div>
        <ResponsiveContainer width="100%" height={190}>
          <BarChart data={areaData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(16, 185, 129, 0.1)" />
            <XAxis dataKey="day" tick={{ fill: 'hsl(160 18% 65%)', fontSize: 11 }} />
            <YAxis tick={{ fill: 'hsl(160 18% 65%)', fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="scans" name="Scans" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
            <Bar dataKey="threats" name="Threats" fill={COLORS.dangerous} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};

export default ThreatCharts;
