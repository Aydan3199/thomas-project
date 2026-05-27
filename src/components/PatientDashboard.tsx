import { useState, useEffect } from 'react';
import { User, useAuthStore } from '../store/useAuthStore';
import { Header } from './Header';
import { HeadacheDiary } from './HeadacheDiary';
import { QuestionnaireList } from './QuestionnaireList';
import { PatientStats } from './PatientStats';
import { Calendar, FileText, BarChart3 } from 'lucide-react';
import { API_BASE_URL } from '../config';

interface PatientDashboardProps {
  user: User;
  onLogout: () => void;
  onNavigate: (page: 'dashboard' | 'about') => void;
}

type TabType = 'diary' | 'questionnaire' | 'stats';

export function PatientDashboard({ user, onLogout, onNavigate }: PatientDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('diary');
  const currentUser = useAuthStore((state) => state.currentUser);
  
  // Profile settings state
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [editAge, setEditAge] = useState<number | ''>('');
  const [editGender, setEditGender] = useState('未設定');
  const [editPhone, setEditPhone] = useState('');

  useEffect(() => {
    if (currentUser) {
      setEditAge(currentUser.age ?? '');
      setEditGender(currentUser.gender ?? '未設定');
      setEditPhone(currentUser.phone ?? '');
    }
  }, [currentUser]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${currentUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          age: editAge === '' ? null : Number(editAge),
          gender: editGender,
          phone: editPhone
        })
      });
      if (response.ok) {
        const updatedUser = await response.json();
        // Update store state instantly
        useAuthStore.getState().updateUserFields({
          age: updatedUser.age,
          gender: updatedUser.gender,
          phone: updatedUser.phone
        });
        alert('基本資料已成功儲存！');
        setShowProfileModal(false);
      } else {
        alert('更新個人資料失敗，請稍後再試');
      }
    } catch (err) {
      console.error(err);
      alert('連線失敗，請確認後端服務已啟動');
    }
  };

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
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border pb-6">
          <div>
            <h1 className="text-text-primary mb-2">歡迎回來，{user.name}</h1>
            <div className="text-text-secondary flex flex-wrap items-center gap-3 text-sm">
              <span>這裡是您的個人健康管理中心</span>
              {currentUser?.age && (
                <>
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                  <span className="text-primary font-medium">{currentUser.age} 歲</span>
                </>
              )}
              {currentUser?.gender && currentUser?.gender !== '未設定' && (
                <>
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                  <span className="text-primary font-medium">性別：{currentUser.gender}</span>
                </>
              )}
              {currentUser?.phone && (
                <>
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                  <span className="text-primary font-medium">聯絡電話：{currentUser.phone}</span>
                </>
              )}
            </div>
          </div>
          <button
            onClick={() => setShowProfileModal(true)}
            className="px-5 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-all shadow-md font-medium text-sm self-start md:self-auto hover:shadow-lg"
          >
            編輯基本資料
          </button>
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
                    ? 'border-b-2 border-primary text-primary font-medium'
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

      {/* Profile Edit Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-border p-6 relative">
            <h3 className="text-text-primary mb-2 text-xl font-bold">編輯個人基本資料</h3>
            <p className="text-text-secondary text-sm mb-6">填寫您的基本資料，以便醫師和個案管理師為您提供更精準的照護</p>
            
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">年齡</label>
                <input
                  type="number"
                  min="0"
                  max="120"
                  value={editAge}
                  onChange={(e) => setEditAge(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50 text-text-primary"
                  placeholder="請輸入您的年齡"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">性別</label>
                <select
                  value={editGender}
                  onChange={(e) => setEditGender(e.target.value)}
                  className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50 cursor-pointer text-text-primary"
                  required
                >
                  <option value="男">男</option>
                  <option value="女">女</option>
                  <option value="其他">其他</option>
                  <option value="未設定">未設定</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">聯絡電話</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50 text-text-primary"
                  placeholder="例如: 0912-345-678"
                  required
                />
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-border mt-6">
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="px-5 py-2 border border-border rounded-lg hover:bg-gray-50 transition-colors text-text-secondary"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-all shadow-md font-medium"
                >
                  儲存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}