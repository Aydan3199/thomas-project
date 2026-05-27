import { useState, useEffect } from 'react';
import { X, Calendar, Activity, Pill, FileText, TrendingDown, AlertCircle } from 'lucide-react';
import { API_BASE_URL } from '../config';

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

export function PatientRecordModal({ patient, onClose }: PatientRecordModalProps) {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [questionnaires, setQuestionnaires] = useState<QuestionnaireScore[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        setLoading(true);
        // 1. Fetch diaries
        const diariesRes = await fetch(`${API_BASE_URL}/api/diaries/user/${patient.id}`);
        if (diariesRes.ok) {
          const diariesData = await diariesRes.json();
          setDiaries(diariesData);
        }
        
        // 2. Fetch questionnaires
        const questionnairesRes = await fetch(`${API_BASE_URL}/api/questionnaires/patient/${patient.id}`);
        if (questionnairesRes.ok) {
          const rawQData = await questionnairesRes.json();
          
          // Map to QuestionnaireScore interface
          const mappedScores: QuestionnaireScore[] = rawQData.map((q: any) => {
            const dateObj = new Date(q.completedAt);
            const dateStr = isNaN(dateObj.getTime()) ? '近期' : dateObj.toISOString().split('T')[0];
            
            const qId = q.questionnaireId.toLowerCase();
            let name = q.questionnaireId.toUpperCase();
            let maxScore = 100;
            let interpretation = '正常';
            const score = q.score;

            if (qId === 'midas') {
              maxScore = 27;
              if (score > 20) interpretation = '重度失能 (Grade IV)';
              else if (score > 10) interpretation = '中度失能 (Grade III)';
              else if (score > 5) interpretation = '輕度失能 (Grade II)';
              else interpretation = '無或極輕微失能 (Grade I)';
            } else if (qId === 'psqi') {
              maxScore = 21;
              if (score > 8) interpretation = '睡眠品質極差';
              else if (score > 5) interpretation = '睡眠品質不佳';
              else interpretation = '睡眠品質優良';
            } else if (qId === 'hads-anxiety' || qId === 'hads_anxiety' || qId.includes('anxiety')) {
              name = 'HADS-焦慮';
              maxScore = 21;
              if (score > 10) interpretation = '焦慮症狀明顯';
              else if (score > 7) interpretation = '輕度焦慮';
              else interpretation = '正常';
            } else if (qId === 'hads-depression' || qId === 'hads_depression' || qId.includes('depression')) {
              name = 'HADS-憂鬱';
              maxScore = 21;
              if (score > 10) interpretation = '憂鬱症狀明顯';
              else if (score > 7) interpretation = '輕度憂鬱';
              else interpretation = '正常';
            } else if (qId === 'pss') {
              maxScore = 40;
              if (score > 26) interpretation = '高壓力狀態';
              else if (score > 13) interpretation = '中等壓力狀態';
              else interpretation = '低壓力狀態';
            } else if (qId === 'bdi') {
              maxScore = 63;
              if (score > 29) interpretation = '重度憂鬱';
              else if (score > 19) interpretation = '中度憂鬱';
              else if (score > 13) interpretation = '輕度憂鬱';
              else interpretation = '無或極輕微憂鬱';
            } else if (qId === 'fss') {
              maxScore = 63;
              if (score >= 36) interpretation = '重度疲勞';
              else interpretation = '正常範圍';
            } else if (qId === 'allodynia') {
              maxScore = 24;
              if (score > 8) interpretation = '重度觸物痛';
              else if (score > 5) interpretation = '中度觸物痛';
              else if (score > 2) interpretation = '輕度觸物痛';
              else interpretation = '無觸物痛';
            } else if (qId === 'wpi') {
              maxScore = 19;
              if (score > 7) interpretation = '廣泛全身疼痛明顯';
              else interpretation = '正常';
            }
            
            return {
              name,
              score,
              maxScore,
              date: dateStr,
              interpretation
            };
          });
          
          setQuestionnaires(mappedScores);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPatientData();
  }, [patient.id]);

  // Calculate dynamic summaries
  const currentMonthStr = new Date().toISOString().slice(0, 7); // yyyy-MM
  const headacheDaysThisMonth = diaries.filter(d => d.date && d.date.startsWith(currentMonthStr)).length;
  
  const avgPainIntensity = diaries.length > 0
    ? (diaries.reduce((sum, d) => sum + d.intensity, 0) / diaries.length).toFixed(1)
    : "0.0";

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
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-text-secondary">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-4"></div>
              <p>正在載入病患完整病歷數據...</p>
            </div>
          ) : (
            <>
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
                    <div className="text-primary">{headacheDaysThisMonth} 天 (本月)</div>
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
                    <div className="text-primary">{avgPainIntensity} / 10</div>
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
                  {questionnaires.length === 0 ? (
                    <div className="text-center py-8 text-text-secondary bg-white border border-border rounded-lg col-span-2 shadow-sm">
                      該病患目前尚無量表評估記錄。
                    </div>
                  ) : (
                    questionnaires.map((score, idx) => (
                      <div key={idx} className="bg-white border border-border rounded-lg p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-text-primary font-medium">{score.name}</span>
                          <span className="text-text-secondary text-sm">{score.date}</span>
                        </div>
                        <div className="mb-2">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-primary font-semibold">{score.score} / {score.maxScore}</span>
                            <span className="text-text-secondary text-sm">
                              {Math.round((score.score / score.maxScore) * 100)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full"
                              style={{ width: `${(score.score / score.maxScore) * 100}%` }}
                            />
                          </div>
                        </div>
                        <div className="text-text-secondary text-sm">{score.interpretation}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Headache Diary */}
              <div>
                <h3 className="text-text-primary mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  頭痛日誌記錄
                </h3>
                <div className="space-y-3">
                  {diaries.length === 0 ? (
                    <div className="text-center py-8 text-text-secondary bg-white border border-border rounded-lg shadow-sm">
                      該病患目前尚無頭痛日記記錄。
                    </div>
                  ) : (
                    diaries.map((entry) => (
                      <div key={entry.id} className="bg-white border border-border rounded-lg p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-text-secondary text-sm">
                              <Calendar className="w-4 h-4" />
                              {entry.date} {entry.time}
                            </div>
                            <div className="flex items-center gap-2 text-danger text-sm font-semibold">
                              <Activity className="w-4 h-4" />
                              強度：{entry.intensity}/10
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-text-secondary">症狀：</span>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {entry.symptoms.map((symptom, idx) => (
                                <span key={idx} className="px-2.5 py-1 bg-medical-blue text-primary rounded-full text-xs font-medium">
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
                    ))
                  )}
                </div>
              </div>

              {/* Clinical Notes Section */}
              <div>
                <h3 className="text-text-primary mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  臨床建議
                </h3>
                <div className="bg-yellow-50/50 border border-warning/20 rounded-xl p-5 space-y-2">
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-text-primary font-medium">建議追蹤要點：</p>
                      <ul className="list-disc list-inside text-text-secondary space-y-1.5 mt-2.5 text-sm">
                        {diaries.length > 0 && parseFloat(avgPainIntensity) >= 7 ? (
                          <li className="text-danger font-medium">病患平均頭痛強度偏高（{avgPainIntensity}/10），建議調整預防性藥物治療方案</li>
                        ) : (
                          <li>頭痛頻率有增加趨勢，建議調整預防性藥物</li>
                        )}
                        {questionnaires.some(q => q.name.includes('PSQI') && q.score > 5) ? (
                          <li className="text-warning font-medium">PSQI 分數顯示睡眠品質不佳，可能誘發發作，建議進行睡眠衛教</li>
                        ) : (
                          <li>PSQI 分數顯示睡眠品質不佳，可能影響頭痛控制</li>
                        )}
                        {questionnaires.some(q => q.name.includes('焦慮') && q.score > 7) ? (
                          <li className="text-warning font-medium">HADS 焦慮量表分數偏高，建議安排心理諮商或給予支持</li>
                        ) : (
                          <li>焦慮分數偏高，建議評估心理治療或藥物介入</li>
                        )}
                        <li>建議 2 週後回診追蹤</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-border p-6">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg transition-all shadow-md font-medium"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  );
}
