import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Button, Layout, Card } from '../components/common';
import { useStatsStore } from '../stores/statsStore';
import { useTestStore } from '../stores/testStore';
import { MBTIType } from '../types';

const COLORS = [
  '#6366F1', '#818CF8', '#A78BFA', '#C4B5FD',
  '#EC4899', '#F472B6', '#F9A8D4', '#FBCFE8',
  '#10B981', '#34D399', '#6EE7B7', '#A7F3D0',
  '#F59E0B', '#FBBF24', '#FCD34D', '#FDE68A',
];

export function StatsPage() {
  const navigate = useNavigate();
  const { stats, getPercentage } = useStatsStore();
  const { result } = useTestStore();

  const chartData = Object.entries(stats.distribution)
    .map(([type, count]) => ({
      name: type,
      value: count,
      percentage: getPercentage(type as MBTIType),
    }))
    .sort((a, b) => b.value - a.value);

  const top3 = chartData.slice(0, 3);
  const bottom3 = chartData.slice(-3).reverse();

  return (
    <Layout className="bg-gray-50">
      <div className="py-4 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button onClick={() => navigate(-1)} variant="ghost" className="!p-2">
            ← 뒤로
          </Button>
          <h1 className="text-xl font-bold text-gray-800">전체 통계</h1>
        </div>

        {/* Total Count */}
        <Card className="text-center gradient-bg !text-white">
          <p className="text-white/80 mb-2">지금까지</p>
          <motion.p
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            className="text-4xl font-bold"
          >
            {stats.totalCount.toLocaleString()}명
          </motion.p>
          <p className="text-white/80 mt-2">이 테스트에 참여했어요!</p>
        </Card>

        {/* Chart */}
        <Card>
          <h3 className="text-lg font-bold text-gray-800 mb-4">유형별 분포</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-2 rounded shadow-lg border text-sm">
                          <p className="font-bold">{data.name}</p>
                          <p>{data.percentage}% ({data.value.toLocaleString()}명)</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-4 gap-2 mt-4">
            {chartData.map((item, index) => (
              <div
                key={item.name}
                className={`flex items-center gap-1 text-xs ${
                  result === item.name ? 'font-bold text-primary-600' : 'text-gray-600'
                }`}
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Top 3 */}
        <Card>
          <h3 className="text-lg font-bold text-gray-800 mb-4">🏆 TOP 3 유형</h3>
          <div className="space-y-3">
            {top3.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  result === item.name ? 'bg-primary-50 border border-primary-200' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                  </span>
                  <span className={`font-semibold ${result === item.name ? 'text-primary-600' : ''}`}>
                    {item.name}
                  </span>
                </div>
                <span className="text-gray-600">{item.percentage}%</span>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Bottom 3 (Rare Types) */}
        <Card>
          <h3 className="text-lg font-bold text-gray-800 mb-4">🦄 희귀 유형</h3>
          <div className="space-y-3">
            {bottom3.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  result === item.name ? 'bg-secondary-50 border border-secondary-200' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">✨</span>
                  <span className={`font-semibold ${result === item.name ? 'text-secondary-600' : ''}`}>
                    {item.name}
                  </span>
                </div>
                <span className="text-gray-600">{item.percentage}%</span>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* My Result */}
        {result && (
          <Card className="text-center">
            <p className="text-gray-600 mb-2">내 결과</p>
            <p className="text-2xl font-bold text-primary-600">{result}</p>
            <p className="text-gray-500 mt-2">
              상위 {chartData.findIndex((d) => d.name === result) + 1}위 | {getPercentage(result)}%
            </p>
            <Button
              onClick={() => navigate(`/result/${result}`)}
              variant="primary"
              className="mt-4"
            >
              내 결과 자세히 보기
            </Button>
          </Card>
        )}

        {/* Back to Home */}
        <Button onClick={() => navigate('/')} variant="secondary" fullWidth>
          홈으로 돌아가기
        </Button>
      </div>
    </Layout>
  );
}
