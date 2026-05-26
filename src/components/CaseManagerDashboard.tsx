import { useState, useEffect } from 'react';
import { User } from '../store/useAuthStore';
import { Header } from './Header';
import { API_BASE_URL } from '../config';
import { AlertTriangle, Calendar, Phone, Mail, CheckCircle, Clock, Bell } from 'lucide-react';

interface CaseManagerDashboardProps {
  user: User;
  onLogout: () => void;
  onNavigate: (page: 'dashboard' | 'about') => void;
}

interface HighRiskPatient {
  id: string;
  name: string;
  age: number;
  phone: string;
  email: string;
  midasScore: number;
  headacheDays: number;
  lastVisit: string;
  nextAppointment: string | null;
  riskFactors: string[];
  status: 'pending' | 'contacted' | 'scheduled';
  notes?: string;
}

const mockHighRiskPatients: HighRiskPatient[] = [
  {
    id: '1',
    name: '王小明',
    age: 35,
    phone: '0912-345-678',
    email: 'wang@example.com',
    midasScore: 24,
    headacheDays: 15,
    lastVisit: '2024-11-20',
    nextAppointment: null,
    riskFactors: ['MIDAS Grade IV', '頭痛天數過多', '藥物過度使用'],
    status: 'pending',
  },
  {
    id: '2',
    name: '張美玲',
    age: 42,
    phone: '0923-456-789',
    email: 'zhang@example.com',
    midasScore: 22,
    headacheDays: 15,
    lastVisit: '2024-11-18',
    nextAppointment: '2024-12-05',
    riskFactors: ['MIDAS Grade IV', '憂鬱評分偏高'],
    status: 'scheduled',
  },
  {
    id: '3',
    name: '李雅雯',
    age: 38,
    phone: '0934-567-890',
    email: 'li@example.com',
    midasScore: 19,
    headacheDays: 12,
    lastVisit: '2024-11-15',
    nextAppointment: null,
    riskFactors: ['睡眠品質不佳', '壓力指數高'],
    status: 'contacted',
  },
  {
    id: '4',
    name: '陳志強',
    age: 45,
    phone: '0945-678-901',
    email: 'chen@example.com',
    midasScore: 21,
    headacheDays: 14,
    lastVisit: '2024-11-10',
    nextAppointment: null,
    riskFactors: ['MIDAS Grade IV', '三個月未回診'],
    status: 'pending',
  },
];

export function CaseManagerDashboard({ user, onLogout, onNavigate }: CaseManagerDashboardProps) {
  const [patients, setPatients] = useState<HighRiskPatient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<HighRiskPatient | null>(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/casemanager/patients`);
      if (response.ok) {
        const data = await response.json();
        setPatients(data);
        setError(null);
      } else {
        setError('無法取得高風險病患資料');
      }
    } catch (err) {
      console.error(err);
      setError('無法連線至後端伺服器，請確認 Spring Boot 服務是否已啟動');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    if (selectedPatient) {
      setNotes(selectedPatient.notes || '');
    } else {
      setNotes('');
    }
    setShowDatePicker(false);
  }, [selectedPatient]);

  const handleStatusChange = async (patientId: string, newStatus: 'pending' | 'contacted' | 'scheduled') => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/casemanager/tracking/${patientId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        setPatients((prev) =>
          prev.map((p) => (p.id === patientId ? { ...p, status: newStatus } : p))
        );
        if (selectedPatient && selectedPatient.id === patientId) {
          setSelectedPatient((prev) => prev ? { ...prev, status: newStatus } : null);
        }
      } else {
        alert('變更狀態失敗');
      }
    } catch (err) {
      console.error(err);
      alert('無法連線至後端伺服器');
    }
  };

  const handleScheduleAppointment = async (patientId: string, date: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/casemanager/tracking/${patientId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nextAppointment: date, status: 'scheduled' }),
      });
      if (response.ok) {
        setPatients((prev) =>
          prev.map((p) =>
            p.id === patientId ? { ...p, nextAppointment: date, status: 'scheduled' } : p
          )
        );
        if (selectedPatient && selectedPatient.id === patientId) {
          setSelectedPatient((prev) =>
            prev ? { ...prev, nextAppointment: date, status: 'scheduled' } : null
          );
        }
        alert('已成功安排回診時間');
      } else {
        alert('安排回診失敗');
      }
    } catch (err) {
      console.error(err);
      alert('無法連線至後端伺服器');
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedPatient) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/casemanager/tracking/${selectedPatient.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      });
      if (response.ok) {
        setPatients((prev) =>
          prev.map((p) => (p.id === selectedPatient.id ? { ...p, notes } : p))
        );
        setSelectedPatient((prev) => prev ? { ...prev, notes } : null);
        alert('備註已成功儲存');
      } else {
        alert('儲存備註失敗');
      }
    } catch (err) {
      console.error(err);
      alert('無法連線至後端伺服器');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-danger bg-red-100';
      case 'contacted':
        return 'text-warning bg-yellow-100';
      case 'scheduled':
        return 'text-success bg-green-100';
      default:
        return 'text-text-secondary bg-gray-100';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return '待處理';
      case 'contacted':
        return '已聯絡';
      case 'scheduled':
        return '已安排';
      default:
        return '未知';
    }
  };

  const pendingCount = patients.filter((p) => p.status === 'pending').length;
  const contactedCount = patients.filter((p) => p.status === 'contacted').length;
  const scheduledCount = patients.filter((p) => p.status === 'scheduled').length;

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onLogout={onLogout} onNavigate={onNavigate} />

      <div className="max-w-full mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-text-primary mb-2">個案管理師追蹤頁</h1>
          <p className="text-text-secondary">高風險病患追蹤與回診提醒</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border border-border">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-danger" />
              </div>
            </div>
            <div className="text-text-secondary">待處理</div>
            <h3 className="text-danger">{pendingCount} 人</h3>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-border">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-warning" />
              </div>
            </div>
            <div className="text-text-secondary">已聯絡</div>
            <h3 className="text-warning">{contactedCount} 人</h3>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-border">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
            </div>
            <div className="text-text-secondary">已安排</div>
            <h3 className="text-success">{scheduledCount} 人</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Patient List */}
          <div className="space-y-4">
            <h3 className="text-text-primary">高風險病患列表</h3>
            {loading ? (
              <div className="bg-white rounded-xl shadow-md p-8 border border-border flex items-center justify-center h-64">
                <div className="text-center text-text-secondary">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-4"></div>
                  <p>載入高風險個案中...</p>
                </div>
              </div>
            ) : error ? (
              <div className="bg-white rounded-xl shadow-md p-8 border border-border text-center text-danger">
                <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-danger opacity-85" />
                <p className="font-semibold mb-2">{error}</p>
                <button 
                  onClick={fetchPatients} 
                  className="mt-2 px-5 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm transition-all"
                >
                  重新嘗試
                </button>
              </div>
            ) : patients.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-8 border border-border text-center text-text-secondary">
                <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>目前無待追蹤的高風險個案</p>
              </div>
            ) : (
              patients.map((patient) => (
                <div
                  key={patient.id}
                  className={`bg-white rounded-xl shadow-md p-6 border-2 transition-all cursor-pointer ${
                    selectedPatient?.id === patient.id
                      ? 'border-primary'
                      : 'border-border hover:border-primary'
                  }`}
                  onClick={() => setSelectedPatient(patient)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="text-text-primary">{patient.name}</h4>
                      <p className="text-text-secondary">{patient.age}歲</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full ${getStatusColor(patient.status)}`}>
                      {getStatusLabel(patient.status)}
                    </span>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2 text-text-secondary">
                      <AlertTriangle className="w-4 h-4 text-danger" />
                      <span>MIDAS: {patient.midasScore} | 頭痛天數: {patient.headacheDays}</span>
                    </div>
                    <div className="flex items-center gap-2 text-text-secondary">
                      <Calendar className="w-4 h-4" />
                      <span>最後就診: {patient.lastVisit}</span>
                    </div>
                    {patient.nextAppointment && (
                      <div className="flex items-center gap-2 text-success">
                        <Bell className="w-4 h-4" />
                        <span>下次回診: {patient.nextAppointment}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {patient.riskFactors.map((factor, idx) => (
                      <span key={idx} className="px-2 py-1 bg-red-50 text-danger rounded">
                        {factor}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Patient Detail */}
          {selectedPatient ? (
            <div className="bg-white rounded-xl shadow-md p-6 border border-border sticky top-24 self-start">
              <h3 className="text-text-primary mb-6">病患詳情 - {selectedPatient.name}</h3>

              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-text-secondary mb-1">年齡</div>
                    <div className="text-text-primary">{selectedPatient.age}歲</div>
                  </div>
                  <div>
                    <div className="text-text-secondary mb-1">MIDAS 分數</div>
                    <div className="text-danger">{selectedPatient.midasScore}</div>
                  </div>
                  <div>
                    <div className="text-text-secondary mb-1">月頭痛天數</div>
                    <div className="text-danger">{selectedPatient.headacheDays}</div>
                  </div>
                  <div>
                    <div className="text-text-secondary mb-1">最後就診</div>
                    <div className="text-text-primary">{selectedPatient.lastVisit}</div>
                  </div>
                </div>

                <div>
                  <div className="text-text-secondary mb-1">聯絡方式</div>
                  <div className="flex items-center gap-2 text-text-primary mb-1">
                    <Phone className="w-4 h-4" />
                    {selectedPatient.phone}
                  </div>
                  <div className="flex items-center gap-2 text-text-primary">
                    <Mail className="w-4 h-4" />
                    {selectedPatient.email}
                  </div>
                </div>

                <div>
                  <div className="text-text-secondary mb-2">風險因素</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedPatient.riskFactors.map((factor, idx) => (
                      <span key={idx} className="px-3 py-1 bg-red-50 text-danger rounded-lg">
                        {factor}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3 mb-6">
                <h4 className="text-text-primary">追蹤動作</h4>
                <div className="flex gap-2">
                  {selectedPatient.status === 'contacted' ? (
                    <button
                      onClick={() => handleStatusChange(selectedPatient.id, 'pending')}
                      className="flex-1 px-4 py-2 border border-yellow-200 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 rounded-lg transition-all"
                    >
                      取消已聯絡
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStatusChange(selectedPatient.id, 'contacted')}
                      className="flex-1 px-4 py-2 border border-border hover:bg-gray-50 rounded-lg transition-all"
                      disabled={selectedPatient.status !== 'pending'}
                    >
                      標記已聯絡
                    </button>
                  )}
                  <div className="flex-1 relative">
                    <button
                      onClick={() => setShowDatePicker(!showDatePicker)}
                      className="w-full px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-all"
                    >
                      安排回診
                    </button>
                    {showDatePicker && (
                      <div className="absolute right-0 bottom-full mb-2 bg-white border border-border rounded-xl shadow-xl p-4 z-20 w-64">
                        <label className="block text-xs font-semibold text-text-primary mb-2">選擇回診日期</label>
                        <input
                          type="date"
                          min={new Date().toISOString().split('T')[0]}
                          onChange={(e) => {
                            const date = e.target.value;
                            if (date) {
                              handleScheduleAppointment(selectedPatient.id, date);
                              setShowDatePicker(false);
                            }
                          }}
                          className="w-full px-3 py-2 border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary bg-gray-50 mb-2 cursor-pointer"
                        />
                        <button
                          onClick={() => setShowDatePicker(false)}
                          className="w-full text-xs text-center text-text-secondary hover:text-text-primary py-1 border-t border-border mt-2"
                        >
                          取消
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-text-primary mb-2">追蹤備註</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  rows={4}
                  placeholder="記錄聯絡情況或其他重要資訊..."
                />
                <button 
                  onClick={handleSaveNotes}
                  className="w-full mt-3 px-4 py-2 bg-success hover:bg-green-600 text-white rounded-lg transition-all"
                >
                  儲存備註
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md p-6 border border-border flex items-center justify-center h-96">
              <div className="text-center text-text-secondary">
                <AlertTriangle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>請選擇病患以查看詳情</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}