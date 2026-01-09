import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Button, Layout, Card } from '../components/common';
import { useStatsStore } from '../stores/statsStore';
import { useTestStore } from '../stores/testStore';
import { MBTIType } from '../types';

// 미니멀 그레이스케일 팔레트
const COLORS = [
  '#171717', '#262626', '#404040', '#525252',
  '#737373', '#A3A3A3', '#D4D4D4', '#E5E5E5',
  '#171717', '#262626', '#404040', '#525252',
  '#737373', '#A3A3A3', '#D4D4D4', '#E5E5E5',
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
    <Layout className="bg-neutral-50">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="text-neutral-400 hover:text-neutral-900 transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-neutral-900">전체 통계</h1>
        </div>

        {/* Total Count */}
        <Card className="text-center bg-neutral-900 !text-white !border-0">
          <p className="text-neutral-400 text-sm mb-2">지금까지</p>
          <motion.p
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="text-4xl font-bold tracking-tight"
          >
            {stats.totalCount.toLocaleString()}명
          </motion.p>
          <p className="text-neutral-400 text-sm mt-2">이 테스트에 참여했어요</p>
        </Card>

        {/* Chart */}
        <Card>
          <h3 className="text-lg font-bold text-neutral-900 mb-6">유형별 분포</h3>
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
                        <div className="bg-neutral-900 text-white px-4 py-2 rounded-lg text-sm">
                          <p className="font-bold">{data.name}</p>
                          <p className="text-neutral-300">{data.percentage}% ({data.value.toLocaleString()}명)</p>
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
          <div className="grid grid-cols-4 gap-3 mt-6">
            {chartData.map((item, index) => (
              <div
                key={item.name}
                className={`flex items-center gap-2 text-xs ${
                  result === item.name ? 'font-bold text-neutral-900' : 'text-neutral-500'
                }`}
              >
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="truncate">{item.name}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Top 3 */}
        <Card>
          <h3 className="text-lg font-bold text-neutral-900 mb-6">TOP 3 유형</h3>
          <div className="space-y-3">
            {top3.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08, ease: [0.4, 0, 0.2, 1] }}
                className={`flex items-center justify-between p-4 rounded-xl ${
                  result === item.name ? 'bg-neutral-900 text-white' : 'bg-neutral-100'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-xl font-bold w-6">{index + 1}</span>
                  <span className="font-medium">{item.name}</span>
                </div>
                <span className={result === item.name ? 'text-neutral-300' : 'text-neutral-500'}>
                  {item.percentage}%
                </span>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Bottom 3 (Rare Types) */}
        <Card>
          <h3 className="text-lg font-bold text-neutral-900 mb-6">희귀 유형</h3>
          <div className="space-y-3">
            {bottom3.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08, ease: [0.4, 0, 0.2, 1] }}
                className={`flex items-center justify-between p-4 rounded-xl ${
                  result === item.name ? 'bg-neutral-900 text-white' : 'bg-neutral-100'
                }`}
              >
                <span className="font-medium">{item.name}</span>
                <span className={result === item.name ? 'text-neutral-300' : 'text-neutral-500'}>
                  {item.percentage}%
                </span>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* My Result */}
        {result && (
          <Card className="text-center">
            <p className="text-neutral-500 text-sm mb-2">내 결과</p>
            <p className="text-3xl font-bold text-neutral-900 mb-2">{result}</p>
            <p className="text-neutral-500 text-sm">
              상위 {chartData.findIndex((d) => d.name === result) + 1}위 · {getPercentage(result)}%
            </p>
            <Button
              onClick={() => navigate(`/result/${result}`)}
              variant="primary"
              className="mt-6"
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
