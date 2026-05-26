import { X, Calendar, Activity, Pill, FileText, TrendingDown, AlertCircle } from 'lucide-react';

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

interface DiaryEntry {
  id: string;
  date: string;
  time: string;
  intensity: number;
  symptoms: string[];
  medication: string;
  notes: string;
}

interface QuestionnaireScore {
  name: string;
  score: number;
  maxScore: number;
  date: string;
  interpretation: string;
}

interface PatientRecordModalProps {
  patient: Patient;
  onClose: () => void;
}

const mockDiaryEntries: DiaryEntry[] = [
  {
    id: '1',
    date: '2024-11-25',
    time: '14:30',
    intensity: 7,
    symptoms: ['搏動性疼痛', '噁心', '畏光'],
    medication: '止痛藥 500mg',
    notes: '工作壓力大',
  },
  {
    id: '2',
    date: '2024-11-23',
    time: '09:15',
    intensity: 5,
    symptoms: ['搏動性疼痛', '頭暈'],
    medication: '止痛藥 250mg',
    notes: '睡眠不足',
  },
  {
    id: '3',
    date: '2024-11-20',
    time: '18:45',
    intensity: 8,
    symptoms: ['搏動性疼痛', '噁心', '嘔吐', '畏光'],
    medication: '止痛藥 500mg + 止吐藥',
    notes: '天氣變化',
  },
];

const mockQuestionnaireScores: QuestionnaireScore[] = [
  {
    name: 'MIDAS',
    score: 18,
    maxScore: 100,
    date: '2024-11-15',
    interpretation: '中度失能'
  },
  {
    name: 'HADS-焦慮',
    score: 12,
    maxScore: 21,
    date: '2024-11-15',
    interpretation: '輕度焦慮'
  },
  {
    name: 'HADS-憂鬱',
    score: 8,
    maxScore: 21,
    date: '2024-11-15',
    interpretation: '正常'
  },
  {
    name: 'PSQI',
    score: 9,
    maxScore: 21,
    date: '2024-11-15',
    interpretation: '睡眠品質不佳'
  },
];

export function PatientRecordModal({ patient, onClose }: PatientRecordModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-border p-6 flex items-center justify-between">
          <div>
            <h2 className="text-text-primary">{patient.name} - 完整病歷</h2>
            <p className="text-text-secondary">
              {patient.age}歲 · {patient.gender} · 最後就診：{patient.lastVisit}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-text-secondary" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Patient Summary */}
          <div className="bg-medical-blue rounded-xl p-6">
            <h3 className="text-text-primary mb-4">病患概要</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-text-secondary">MIDAS 分數</div>
                <div className="text-primary">{patient.midasScore}</div>
              </div>
              <div>
                <div className="text-text-secondary">月頭痛天數</div>
                <div className="text-primary">{patient.headacheDays} 天</div>
              </div>
              <div>
                <div className="text-text-secondary">風險等級</div>
                <div className={
                  patient.riskLevel === 'high' ? 'text-danger' :
                  patient.riskLevel === 'medium' ? 'text-warning' :
                  'text-success'
                }>
                  {patient.riskLevel === 'high' ? '高風險' :
                   patient.riskLevel === 'medium' ? '中風險' :
                   '低風險'}
                </div>
              </div>
              <div>
                <div className="text-text-secondary">平均疼痛強度</div>
                <div className="text-primary">6.7 / 10</div>
              </div>
            </div>
          </div>

          {/* Questionnaire Scores */}
          <div>
            <h3 className="text-text-primary mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              量表評估結果
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockQuestionnaireScores.map((score, idx) => (
                <div key={idx} className="bg-white border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-text-primary">{score.name}</span>
                    <span className="text-text-secondary">{score.date}</span>
                  </div>
                  <div className="mb-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-primary">{score.score} / {score.maxScore}</span>
                      <span className="text-text-secondary">
                        {Math.round((score.score / score.maxScore) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${(score.score / score.maxScore) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-text-secondary">{score.interpretation}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Headache Diary */}
          <div>
            <h3 className="text-text-primary mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              頭痛日誌記錄
            </h3>
            <div className="space-y-3">
              {mockDiaryEntries.map((entry) => (
                <div key={entry.id} className="bg-white border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-text-secondary">
                        <Calendar className="w-4 h-4" />
                        {entry.date} {entry.time}
                      </div>
                      <div className="flex items-center gap-2 text-danger">
                        <Activity className="w-4 h-4" />
                        強度：{entry.intensity}/10
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-text-secondary">症狀：</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {entry.symptoms.map((symptom, idx) => (
                          <span key={idx} className="px-2 py-1 bg-medical-blue text-primary rounded-full text-sm">
                            {symptom}
                          </span>
                        ))}
                      </div>
                    </div>
                    {entry.medication && (
                      <div>
                        <span className="text-text-secondary">用藥：</span>
                        <span className="ml-2 text-text-primary">{entry.medication}</span>
                      </div>
                    )}
                    {entry.notes && (
                      <div>
                        <span className="text-text-secondary">備註：</span>
                        <span className="ml-2 text-text-primary">{entry.notes}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Clinical Notes Section */}
          <div>
            <h3 className="text-text-primary mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              臨床建議
            </h3>
            <div className="bg-yellow-50 border border-warning/30 rounded-lg p-4 space-y-2">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-text-primary">建議追蹤要點：</p>
                  <ul className="list-disc list-inside text-text-secondary space-y-1 mt-2">
                    <li>頭痛頻率有增加趨勢，建議調整預防性藥物</li>
                    <li>PSQI 分數顯示睡眠品質不佳，可能影響頭痛控制</li>
                    <li>焦慮分數偏高，建議評估心理治療或藥物介入</li>
                    <li>建議 2 週後回診追蹤</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-border p-6">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg transition-all shadow-md"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  );
}
