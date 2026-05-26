import { useState } from 'react';
import { User } from '../App';
import { Header } from './Header';
import { HeadacheDiary } from './HeadacheDiary';
import { QuestionnaireList } from './QuestionnaireList';
import { PatientStats } from './PatientStats';
import { Calendar, FileText, BarChart3 } from 'lucide-react';

interface PatientDashboardProps {
  user: User;
  onLogout: () => void;
  onNavigate: (page: 'dashboard' | 'about') => void;
}

type TabType = 'diary' | 'questionnaire' | 'stats';

export function PatientDashboard({ user, onLogout, onNavigate }: PatientDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('diary');

  const tabs = [
    { id: 'diary', label: '頭痛日誌', icon: Calendar },
    { id: 'questionnaire', label: '健康量表', icon: FileText },
    { id: 'stats', label: '個人統計', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onLogout={onLogout} onNavigate={onNavigate} />

      <div className="max-w-full mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-text-primary mb-2">歡迎回來，{user.name}</h1>
          <p className="text-text-secondary">這裡是您的個人健康管理中心</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-border overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2 px-6 py-3 transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-text-secondary hover:text-primary'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="mt-6">
          {activeTab === 'diary' && <HeadacheDiary />}
          {activeTab === 'questionnaire' && <QuestionnaireList />}
          {activeTab === 'stats' && <PatientStats />}
        </div>
      </div>
    </div>
  );
}