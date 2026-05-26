import { Activity, ArrowLeft, Heart, Shield, Users, Zap } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (page: 'dashboard' | 'about') => void;
  onLogout: () => void;
}

export function AboutPage({ onNavigate, onLogout }: AboutPageProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border shadow-sm sticky top-0 z-50">
        <div className="max-w-full mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-primary">偏頭痛照護系統</h3>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => onNavigate('dashboard')}
                className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                返回
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-full mx-auto px-4 py-12 pb-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-full mb-6 shadow-lg">
            <Activity className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-text-primary mb-4">偏頭痛個案照護系統</h1>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-white rounded-xl shadow-md p-6 border border-border text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-text-primary mb-2">以病人為中心</h3>
            <p className="text-text-secondary">簡化記錄流程，讓病人輕鬆管理健康資訊</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-border text-center">
            <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-secondary" />
            </div>
            <h3 className="text-text-primary mb-2">智能分析</h3>
            <p className="text-text-secondary">數據視覺化與趨勢分析，輔助醫療決策</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-border text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-success" />
            </div>
            <h3 className="text-text-primary mb-2">多角色協作</h3>
            <p className="text-text-secondary">病人、醫師、個管師無縫溝通與協作</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-border text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-text-primary mb-2">安全可靠</h3>
            <p className="text-text-secondary">符合醫療資訊安全規範，保護隱私</p>
          </div>
        </div>

        {/* System Features */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-border mb-16">
          <h2 className="text-text-primary mb-8 text-center">系統功能</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-primary mb-4">病人端</h3>
              <ul className="space-y-2 text-text-secondary">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <span>每日頭痛日誌記錄</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <span>8 種標準化健康量表</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <span>個人化統計圖表</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <span>智能分析建議</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-secondary mb-4">醫師端</h3>
              <ul className="space-y-2 text-text-secondary">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-secondary rounded-full mt-2"></div>
                  <span>病患管理與追蹤</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-secondary rounded-full mt-2"></div>
                  <span>頭痛趨勢圖表分析</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-secondary rounded-full mt-2"></div>
                  <span>問卷結果檢視</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-secondary rounded-full mt-2"></div>
                  <span>整體統計報告</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-success mb-4">個管師端</h3>
              <ul className="space-y-2 text-text-secondary">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-success rounded-full mt-2"></div>
                  <span>高風險病患追蹤</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-success rounded-full mt-2"></div>
                  <span>回診提醒管理</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-success rounded-full mt-2"></div>
                  <span>個案狀態管理</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-success rounded-full mt-2"></div>
                  <span>追蹤備註記錄</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Questionnaires */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl shadow-md p-8 border border-blue-200 mb-16">
          <h2 className="text-text-primary mb-6 text-center">內建標準化評估量表</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'MIDAS', full: 'Migraine Disability Assessment' },
              { name: 'HADS', full: 'Hospital Anxiety and Depression Scale' },
              { name: 'BDI', full: 'Beck Depression Inventory' },
              { name: 'PSQI', full: 'Pittsburgh Sleep Quality Index' },
              { name: 'FSS', full: 'Fatigue Severity Scale' },
              { name: 'WPI', full: 'Widespread Pain Index' },
              { name: 'Allodynia', full: 'Allodynia Questionnaire' },
              { name: 'PSS', full: 'Perceived Stress Scale' },
            ].map((q) => (
              <div key={q.name} className="bg-white rounded-lg p-4 border border-primary shadow-sm">
                <div className="text-primary">{q.name}</div>
                <div className="text-text-secondary">{q.full}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}