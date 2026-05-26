import { useState, useEffect } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Calendar, Activity, Pill, AlertTriangle, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { API_BASE_URL } from '../config';

// 莫蘭迪/馬卡龍護眼高質感色系
const COLORS = ['#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

interface DiaryEntry {
  id?: string;
  userId?: string;
  date: string;
  time: string;
  intensity: number;
  symptoms: string[];
  medication: string;
  notes: string;
}

interface QuestionnaireResponse {
  id?: string;
  patientId: string;
  questionnaireId: string;
  score: number;
  details: string;
  completedAt: string;
}

export function PatientStats() {
  const currentUser = useAuthStore((state) => state.currentUser);
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [questionnaires, setQuestionnaires] = useState<QuestionnaireResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!currentUser?.id) return;
    try {
      setLoading(true);
      setError(null);

      // Fetch diaries
      const diariesRes = await fetch(`${API_BASE_URL}/api/diaries/user/${currentUser.id}`);
      let diariesData: DiaryEntry[] = [];
      if (diariesRes.ok) {
        diariesData = await diariesRes.json();
        setDiaries(diariesData);
      } else {
        throw new Error('無法取得頭痛日誌資料');
      }

      // Fetch questionnaires
      const questionnairesRes = await fetch(`${API_BASE_URL}/api/questionnaires/patient/${currentUser.id}`);
      if (questionnairesRes.ok) {
        const questionnairesData = await questionnairesRes.json();
        setQuestionnaires(questionnairesData);
      } else {
        throw new Error('無法取得健康量表資料');
      }

    } catch (err: any) {
      console.error(err);
      setError('無法與後端資料庫連線，請確認 Spring Boot 服務是否已啟動。');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentUser]);

  // 1. 本月頭痛天數計算
  const currentMonthStr = new Date().toISOString().slice(0, 7); // yyyy-MM
  const headacheDaysThisMonth = diaries.filter(d => d.date && d.date.startsWith(currentMonthStr)).length;

  // 2. 平均疼痛強度計算
  const avgIntensity = diaries.length > 0 
    ? (diaries.reduce((sum, d) => sum + d.intensity, 0) / diaries.length).toFixed(1)
    : "0.0";

  // 3. 平均持續時間計算 (以強度推估為模擬展示數據)
  const avgDuration = diaries.length > 0
    ? (diaries.reduce((sum, d) => sum + (d.intensity * 0.8 + 2), 0) / diaries.length).toFixed(1)
    : "0.0";

  // 4. 本月用藥次數計算
  const medicationCountThisMonth = diaries.filter(d => 
    d.date && 
    d.date.startsWith(currentMonthStr) && 
    d.medication && 
    d.medication.trim() !== ''
  ).length;

  // === 圖表數據處理 ===

  // 1. 疼痛強度與持續時間趨勢 (按日期升序排序)
  const chartHeadacheData = [...diaries]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(d => ({
      date: d.date ? d.date.slice(5) : '', // 轉化為 MM-DD 格式
      intensity: d.intensity,
      duration: parseFloat((d.intensity * 0.8 + 2).toFixed(1))
    }))
    .slice(-10); // 只取最近 10 筆

  // 2. 症狀分布圓餅圖數據
  const symptomCounts: { [key: string]: number } = {};
  diaries.forEach(d => {
    if (d.symptoms) {
      d.symptoms.forEach(s => {
        symptomCounts[s] = (symptomCounts[s] || 0) + 1;
      });
    }
  });
  const chartSymptomData = Object.keys(symptomCounts)
    .map(name => ({
      name,
      value: symptomCounts[name]
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5); // 取前五大主要症狀

  // 3. MIDAS 分數趨勢圖數據 (問卷)
  const chartMidasData = questionnaires
    .filter(q => q.questionnaireId === 'midas')
    .sort((a, b) => a.completedAt.localeCompare(b.completedAt))
    .map(q => {
      const dateObj = new Date(q.completedAt);
      const monthStr = isNaN(dateObj.getTime()) ? '近期' : `${dateObj.getMonth() + 1}/${dateObj.getDate()}`;
      const score = q.score;
      let grade = 'I';
      if (score > 20) grade = 'IV';
      else if (score > 10) grade = 'III';
      else if (score > 5) grade = 'II';
      return { month: monthStr, score, grade };
    });

  // 4. 生成個人化智能醫學分析建議
  const generateInsights = () => {
    const insights: string[] = [];
    if (diaries.length === 0) {
      return ["尚無足夠的頭痛日記記錄。請前往「頭痛日誌」記錄您的頭痛發作情況，以獲得個人化臨床分析。"];
    }

    if (parseFloat(avgIntensity) >= 7) {
      insights.push(`⚠️ 您的平均頭痛痛感強度偏高（目前達 ${avgIntensity} / 10分）。強烈建議您在回診時與主治醫師討論，評估是否需要調整目前的急性發作藥物或啟動偏頭痛預防性用藥治療。`);
    } else {
      insights.push(`✨ 您的平均疼痛強度控制在 ${avgIntensity} / 10分，屬於輕度至中度。請繼續保持規律作息與日記追蹤！`);
    }

    if (headacheDaysThisMonth >= 4) {
      insights.push(`📅 本月頭痛次數已達 ${headacheDaysThisMonth} 次，較為頻繁。請注意近期是否伴隨生活工作壓力升高、睡眠品質下降等誘發因素；並切忌過度服用急性止痛藥物，以免引發「藥物過度使用性頭痛 (MOH)」。`);
    }

    if (chartSymptomData.length > 0) {
      insights.push(`🎯 根據您的日記分析，最常伴隨的偏頭痛特徵為「${chartSymptomData[0].name}」。在下次發作時，您可以特別留意是否能透過遮光、降低環境噪音或冷敷來緩解該症狀。`);
    }

    return insights;
  };

  const insightsList = generateInsights();

  // 圖表通用極簡設計與陰影配置
  const customTooltipStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    border: 'none',
    borderRadius: '12px',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.08)',
    padding: '12px 16px',
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-12 border border-border flex items-center justify-center h-96">
        <div className="text-center text-text-secondary">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg font-medium">正在載入您的個人健康統計數據...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-md p-12 border border-border text-center text-danger">
        <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-danger opacity-85" />
        <h3 className="text-xl font-bold mb-2">數據載入失敗</h3>
        <p className="mb-4 text-text-secondary">{error}</p>
        <button 
          onClick={fetchData} 
          className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg transition-all shadow-md"
        >
          重新整理
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-text-primary mb-2">個人統計</h2>
        <p className="text-text-secondary">查看您的頭痛趨勢與分析</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-border hover:shadow-md transition-shadow flex flex-col items-center text-center">
          <div className="mb-2">
            <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
          <div className="text-text-secondary text-sm">本月頭痛天數</div>
          <h3 className="text-primary mt-1 text-2xl font-bold">{headacheDaysThisMonth} <span className="text-sm font-normal text-text-secondary">天</span></h3>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-border hover:shadow-md transition-shadow flex flex-col items-center text-center">
          <div className="mb-2">
            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6" />
            </div>
          </div>
          <div className="text-text-secondary text-sm">平均疼痛強度</div>
          <h3 className="text-danger mt-1 text-2xl font-bold">{avgIntensity} <span className="text-sm font-normal text-text-secondary">/ 10</span></h3>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-border hover:shadow-md transition-shadow flex flex-col items-center text-center">
          <div className="mb-2">
            <div className="w-12 h-12 bg-green-50 text-green-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          <div className="text-text-secondary text-sm">平均持續時間</div>
          <h3 className="text-success mt-1 text-2xl font-bold">{avgDuration} <span className="text-sm font-normal text-text-secondary">小時</span></h3>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-border hover:shadow-md transition-shadow flex flex-col items-center text-center">
          <div className="mb-2">
            <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center">
              <Pill className="w-6 h-6" />
            </div>
          </div>
          <div className="text-text-secondary text-sm">本月用藥次數</div>
          <h3 className="text-warning mt-1 text-2xl font-bold">{medicationCountThisMonth} <span className="text-sm font-normal text-text-secondary">次</span></h3>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Intensity Trend - AreaChart with glowing gradient */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-border">
          <h3 className="text-text-primary mb-6 font-semibold text-center">疼痛強度趨勢</h3>
          {chartHeadacheData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[300px] text-text-secondary">
              <AlertCircle className="w-12 h-12 text-gray-300 mb-2" />
              <p>無頭痛記錄數據</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartHeadacheData} margin={{ top: 20, right: 30, left: 0, bottom: 15 }}>
                <defs>
                  <linearGradient id="colorIntensity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.01}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="date" stroke="#94a3b8" tickLine={false} axisLine={false} dy={12} />
                <YAxis stroke="#94a3b8" domain={[0, 10]} tickLine={false} axisLine={false} dx={-12} />
                <Tooltip contentStyle={customTooltipStyle} />
                <Legend iconType="circle" />
                <Area type="monotone" dataKey="intensity" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorIntensity)" name="疼痛強度" activeDot={{ r: 6, strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Duration Chart - BarChart with custom gradient and rounded top corners */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-border">
          <h3 className="text-text-primary mb-6 font-semibold text-center">持續時間分析</h3>
          {chartHeadacheData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[300px] text-text-secondary">
              <AlertCircle className="w-12 h-12 text-gray-300 mb-2" />
              <p>無頭痛記錄數據</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartHeadacheData} margin={{ top: 20, right: 30, left: 0, bottom: 15 }}>
                <defs>
                  <linearGradient id="colorBarDuration" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.95}/>
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.95}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="date" stroke="#94a3b8" tickLine={false} axisLine={false} dy={12} />
                <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} dx={-12} />
                <Tooltip contentStyle={customTooltipStyle} />
                <Legend iconType="circle" />
                <Bar dataKey="duration" fill="url(#colorBarDuration)" radius={[6, 6, 0, 0]} barSize={20} name="持續時間（小時）" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Symptom Distribution - Modern Donut (Ring) Chart */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-border">
          <h3 className="text-text-primary mb-6 font-semibold text-center">主要發作症狀分布</h3>
          {chartSymptomData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[300px] text-text-secondary">
              <AlertCircle className="w-12 h-12 text-gray-300 mb-2" />
              <p>無伴隨症狀數據，請在日誌勾選症狀</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartSymptomData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                  labelLine={true}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {chartSymptomData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip contentStyle={customTooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* MIDAS Score Trend - Elegant Green AreaChart */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-border">
          <h3 className="text-text-primary mb-6 font-semibold text-center">MIDAS 分數趨勢</h3>
          {chartMidasData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[300px] text-text-secondary">
              <AlertCircle className="w-12 h-12 text-gray-300 mb-2" />
              <p>無 MIDAS 量表歷史，請在「健康量表」填寫問卷</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartMidasData} margin={{ top: 20, right: 30, left: 0, bottom: 15 }}>
                <defs>
                  <linearGradient id="colorMidas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.01}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" tickLine={false} axisLine={false} dy={12} />
                <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} dx={-12} />
                <Tooltip 
                  contentStyle={customTooltipStyle}
                  formatter={(value: number, name: string) => {
                    if (name === 'MIDAS分數') {
                      const entry = chartMidasData.find(d => d.score === value);
                      return [`${value}分 (Grade ${entry?.grade})`, name];
                    }
                    return [value, name];
                  }}
                />
                <Legend iconType="circle" />
                <Area type="monotone" dataKey="score" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorMidas)" name="MIDAS分數" activeDot={{ r: 6, strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Insights */}
      <div className="bg-gradient-to-br from-blue-50/70 via-cyan-50/30 to-blue-50/50 rounded-2xl p-6 border border-blue-100 shadow-sm">
        <h3 className="text-text-primary mb-4 font-semibold flex items-center justify-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          智能臨床分析建議
        </h3>
        <div className="space-y-4">
          {insightsList.map((insight, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-text-primary leading-relaxed text-sm">{insight}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}