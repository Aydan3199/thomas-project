import { useState, useEffect } from 'react';
import { User } from '../store/useAuthStore';
import { Header } from './Header';
import { API_BASE_URL } from '../config';
import { PatientRecordModal } from './PatientRecordModal';
import { PrescriptionModal } from './PrescriptionModal';
import { Users, TrendingUp, FileText, Search } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { toast } from 'sonner';

interface DoctorDashboardProps {
  user: User;
  onLogout: () => void;
  onNavigate: (page: 'dashboard' | 'about') => void;
}

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  lastVisit: string;
  midasScore: number;
  headacheDays: number;
  riskLevel: 'low' | 'medium' | 'high';
}

const patientTrendData = [
  { month: '6月', avgMidas: 14, avgHeadacheDays: 9 },
  { month: '7月', avgMidas: 15, avgHeadacheDays: 10 },
  { month: '8月', avgMidas: 13, avgHeadacheDays: 8 },
  { month: '9月', avgMidas: 16, avgHeadacheDays: 11 },
  { month: '10月', avgMidas: 14, avgHeadacheDays: 9 },
  { month: '11月', avgMidas: 15, avgHeadacheDays: 10 },
];

export function DoctorDashboard({ user, onLogout, onNavigate }: DoctorDashboardProps) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/users/patients`)
      .then(res => res.json())
      .then(data => setPatients(data))
      .catch(err => console.error("Failed to fetch patients", err))
      .finally(() => setIsLoading(false));
  }, []);

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPatientsCount = patients.length;
  const totalCompletedQ = patients.reduce((sum, p: any) => sum + (p.completedCount || 0), 0);
  const totalExpectedQ = totalPatientsCount * 8;
  const completionRate = totalExpectedQ > 0 
    ? Math.round((totalCompletedQ / totalExpectedQ) * 100) 
    : 0;

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'text-danger bg-red-100';
      case 'medium':
        return 'text-warning bg-yellow-100';
      case 'low':
        return 'text-success bg-green-100';
      default:
        return 'text-text-secondary bg-gray-100';
    }
  };

  const getRiskLabel = (level: string) => {
    switch (level) {
      case 'high':
        return '高風險';
      case 'medium':
        return '中風險';
      case 'low':
        return '低風險';
      default:
        return '未評估';
    }
  };

  const patientDetailData = selectedPatient
    ? [
        { date: '11/18', intensity: 7, duration: 5 },
        { date: '11/20', intensity: 8, duration: 6 },
        { date: '11/22', intensity: 6, duration: 4 },
        { date: '11/24', intensity: 7, duration: 5 },
        { date: '11/25', intensity: 5, duration: 3 },
      ]
    : [];

  const handleViewRecord = () => {
    if (selectedPatient) {
      setShowRecordModal(true);
    }
  };

  const handleOpenPrescription = () => {
    if (selectedPatient) {
      setShowPrescriptionModal(true);
    }
  };

  const handlePrescriptionSubmit = async (prescription: any) => {
    if (!selectedPatient || !user) return;
    try {
        await fetch(`${API_BASE_URL}/api/prescriptions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                doctorId: user.id,
                patientId: selectedPatient.id,
                medicationDetails: prescription.medication,
                instructions: prescription.notes || prescription.instructions
            })
        });
        toast.success('建議成藥已成功保存至實體後端！');
    } catch (err) {
        console.error("Save prescription failed", err);
        toast.error('無法連線到伺服器保存建議成藥');
    }
    setShowPrescriptionModal(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onLogout={onLogout} onNavigate={onNavigate} />

      <div className="max-w-full mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-text-primary mb-2">醫師後台</h1>
          <p className="text-text-secondary">病患管理與趨勢分析</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border border-border">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="text-text-secondary">總註冊病患數</div>
            <h3 className="text-primary">{patients.length} 人</h3>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-border">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-danger" />
              </div>
            </div>
            <div className="text-text-secondary">高風險病患 ({'>'}10天頭痛)</div>
            <h3 className="text-danger">{patients.filter(p => p.riskLevel === 'high').length} 人</h3>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-border">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-success" />
              </div>
            </div>
            <div className="text-text-secondary">本月問卷完成率</div>
            <h3 className="text-success">{totalPatientsCount > 0 ? `${completionRate}%` : '0%'}</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Patient List */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-border">
            <div className="mb-4">
              <h3 className="text-text-primary mb-4">病患列表</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="搜尋病患姓名..."
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {isLoading ? (
                  <div className="text-center text-text-secondary py-8">載入病患清單中...</div>
              ) : filteredPatients.length === 0 ? (
                  <div className="text-center text-text-secondary py-8">查無符合條件的病患</div>
              ) : (
                filteredPatients.map((patient) => (
                  <button
                    key={patient.id}
                    onClick={() => setSelectedPatient(patient)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      selectedPatient?.id === patient.id
                        ? 'bg-medical-blue border-primary'
                        : 'bg-white border-border hover:border-primary'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="text-text-primary">{patient.name}</h4>
                        <p className="text-text-secondary">
                          {patient.age}歲 · {patient.gender}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full ${getRiskColor(patient.riskLevel)}`}>
                        {getRiskLabel(patient.riskLevel)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-text-secondary">
                      <span>MIDAS: {patient.midasScore}</span>
                      <span>頭痛天數: {patient.headacheDays}</span>
                    </div>
                    <div className="text-text-secondary mt-2">
                      最後就診: {patient.lastVisit}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Patient Detail or Overall Trend */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-border">
            {selectedPatient ? (
              <>
                <h3 className="text-text-primary mb-4">{selectedPatient.name} - 頭痛趨勢</h3>
                <div className="mb-4 p-4 bg-medical-blue rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-text-secondary">MIDAS 分數</div>
                      <div className="text-primary">{selectedPatient.midasScore}</div>
                    </div>
                    <div>
                      <div className="text-text-secondary">月頭痛天數</div>
                      <div className="text-primary">{selectedPatient.headacheDays}</div>
                    </div>
                    <div>
                      <div className="text-text-secondary">年齡</div>
                      <div className="text-primary">{selectedPatient.age}歲</div>
                    </div>
                    <div>
                      <div className="text-text-secondary">風險等級</div>
                      <div className={getRiskColor(selectedPatient.riskLevel).split(' ')[0]}>
                        {getRiskLabel(selectedPatient.riskLevel)}
                      </div>
                    </div>
                  </div>
                </div>

                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={patientDetailData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="date" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="intensity" stroke="#3b82f6" name="疼痛強度" />
                    <Line type="monotone" dataKey="duration" stroke="#06b6d4" name="持續時間（小時）" />
                  </LineChart>
                </ResponsiveContainer>

                <div className="mt-4 space-y-2">
                  <button
                    className="w-full px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-all"
                    onClick={handleViewRecord}
                  >
                    查看完整病歷
                  </button>
                  <button
                    className="w-full px-4 py-2 border border-border hover:bg-gray-50 rounded-lg transition-all"
                    onClick={handleOpenPrescription}
                  >
                    開立建議成藥
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-text-primary mb-4">整體趨勢分析</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={patientTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Bar dataKey="avgMidas" fill="#3b82f6" name="平均 MIDAS 分數" />
                    <Bar dataKey="avgHeadacheDays" fill="#06b6d4" name="平均頭痛天數" />
                  </BarChart>
                </ResponsiveContainer>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Patient Record Modal */}
      {showRecordModal && selectedPatient && (
        <PatientRecordModal
          patient={selectedPatient}
          onClose={() => setShowRecordModal(false)}
        />
      )}

      {/* Prescription Modal */}
      {showPrescriptionModal && selectedPatient && (
        <PrescriptionModal
          patient={selectedPatient}
          onClose={() => setShowPrescriptionModal(false)}
          onSubmit={handlePrescriptionSubmit}
        />
      )}
    </div>
  );
}