import { useState, useEffect } from 'react';
import { FileText, ChevronRight, CheckCircle, Circle } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { API_BASE_URL } from '../config';
import { MIDASQuestionnaire } from './questionnaires/MIDASQuestionnaire';
import { HADSQuestionnaire } from './questionnaires/HADSQuestionnaire';
import { BDIQuestionnaire } from './questionnaires/BDIQuestionnaire';
import { PSQIQuestionnaire } from './questionnaires/PSQIQuestionnaire';
import { FSSQuestionnaire } from './questionnaires/FSSQuestionnaire';
import { WPIQuestionnaire } from './questionnaires/WPIQuestionnaire';
import { AllodyniaQuestionnaire } from './questionnaires/AllodyniaQuestionnaire';
import { PSSQuestionnaire } from './questionnaires/PSSQuestionnaire';

interface Questionnaire {
  id: string;
  name: string;
  fullName: string;
  description: string;
  completed: boolean;
  lastCompleted?: string;
}

export function QuestionnaireList() {
  const currentUser = useAuthStore((state) => state.currentUser);
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState<string | null>(null);
  const [customDate, setCustomDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([
    {
      id: 'midas',
      name: 'MIDAS',
      fullName: 'Migraine Disability Assessment',
      description: '偏頭痛失能評估量表',
      completed: false,
    },
    {
      id: 'hads',
      name: 'HADS',
      fullName: 'Hospital Anxiety and Depression Scale',
      description: '醫院焦慮憂鬱量表',
      completed: false,
    },
    {
      id: 'bdi',
      name: 'BDI',
      fullName: 'Beck Depression Inventory',
      description: '貝克憂鬱量表',
      completed: false,
    },
    {
      id: 'psqi',
      name: 'PSQI',
      fullName: 'Pittsburgh Sleep Quality Index',
      description: '匹茲堡睡眠品質指數',
      completed: false,
    },
    {
      id: 'fss',
      name: 'FSS',
      fullName: 'Fatigue Severity Scale',
      description: '疲勞嚴重度量表',
      completed: false,
    },
    {
      id: 'wpi',
      name: 'WPI',
      fullName: 'Widespread Pain Index',
      description: '廣泛疼痛指數',
      completed: false,
    },
    {
      id: 'allodynia',
      name: 'Allodynia',
      fullName: 'Allodynia Questionnaire',
      description: '異位性疼痛問卷',
      completed: false,
    },
    {
      id: 'pss',
      name: 'PSS',
      fullName: 'Perceived Stress Scale',
      description: '知覺壓力量表',
      completed: false,
    },
  ]);

  useEffect(() => {
    if (currentUser?.id) {
        fetch(`${API_BASE_URL}/api/questionnaires/patient/${currentUser.id}`)
          .then(res => res.json())
          .then((responses: any[]) => {
               setQuestionnaires(prev => prev.map(q => {
                   const qs = responses.filter(r => r.questionnaireId === q.id);
                   if (qs.length > 0) {
                       const lastResponse = qs[qs.length - 1]; 
                       return { ...q, completed: true, lastCompleted: lastResponse.completedAt.split('T')[0] };
                   }
                   return q;
               }));
          })
          .catch(err => console.error("Failed to load questionnaires", err));
    }
  }, [currentUser]);

  // Reset customDate to today whenever selectedQuestionnaire changes
  useEffect(() => {
    setCustomDate(new Date().toISOString().split('T')[0]);
  }, [selectedQuestionnaire]);

  const handleComplete = async (questionnaireId: string, score: number = 0, targetListId?: string, completionDate?: string) => {
    if (!currentUser) return;
    
    const displayId = targetListId || questionnaireId;
    const finalDate = completionDate || new Date().toISOString().split('T')[0];
    const completedAtStr = `${finalDate}T12:00:00`; // standard LocalDateTime string
    
    try {
        await fetch(`${API_BASE_URL}/api/questionnaires`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                patientId: currentUser.id,
                questionnaireId: questionnaireId,
                score: score,
                details: 'Completed via UI',
                completedAt: completedAtStr
            })
        });
        
        setQuestionnaires((prev) =>
          prev.map((q) =>
            q.id === displayId
              ? { ...q, completed: true, lastCompleted: finalDate }
              : q
          )
        );
    } catch(err) {
        console.error("Save questionnaire error", err);
    }
    
    setSelectedQuestionnaire(null);
  };

  const renderQuestionnaireWithDatePicker = (component: React.ReactNode) => {
    return (
      <div className="space-y-4">
        {/* Date Selector Banner */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
          <div className="text-sm text-primary font-medium flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-primary rounded-full animate-pulse"></span>
            您可以指定此問卷的填寫日期（預設為今天）：
          </div>
          <input
            type="date"
            max={new Date().toISOString().split('T')[0]}
            value={customDate}
            onChange={(e) => setCustomDate(e.target.value)}
            className="px-4 py-2 border border-border rounded-lg text-sm bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer shadow-inner font-medium"
          />
        </div>
        {component}
      </div>
    );
  };

  if (selectedQuestionnaire === 'midas') {
    return renderQuestionnaireWithDatePicker(
      <MIDASQuestionnaire onBack={() => setSelectedQuestionnaire(null)} onComplete={(score) => handleComplete('midas', score, undefined, customDate)} />
    );
  }
  if (selectedQuestionnaire === 'hads') {
    return renderQuestionnaireWithDatePicker(
      <HADSQuestionnaire 
        onBack={() => setSelectedQuestionnaire(null)} 
        onComplete={async (anxiety, depression) => {
          await handleComplete('hads-anxiety', anxiety, 'hads', customDate);
          await handleComplete('hads-depression', depression, 'hads', customDate);
        }} 
      />
    );
  }
  if (selectedQuestionnaire === 'bdi') {
    return renderQuestionnaireWithDatePicker(
      <BDIQuestionnaire onBack={() => setSelectedQuestionnaire(null)} onComplete={(score) => handleComplete('bdi', score, undefined, customDate)} />
    );
  }
  if (selectedQuestionnaire === 'psqi') {
    return renderQuestionnaireWithDatePicker(
      <PSQIQuestionnaire onBack={() => setSelectedQuestionnaire(null)} onComplete={(score) => handleComplete('psqi', score, undefined, customDate)} />
    );
  }
  if (selectedQuestionnaire === 'fss') {
    return renderQuestionnaireWithDatePicker(
      <FSSQuestionnaire onBack={() => setSelectedQuestionnaire(null)} onComplete={(score) => handleComplete('fss', score, undefined, customDate)} />
    );
  }
  if (selectedQuestionnaire === 'wpi') {
    return renderQuestionnaireWithDatePicker(
      <WPIQuestionnaire onBack={() => setSelectedQuestionnaire(null)} onComplete={(score) => handleComplete('wpi', score, undefined, customDate)} />
    );
  }
  if (selectedQuestionnaire === 'allodynia') {
    return renderQuestionnaireWithDatePicker(
      <AllodyniaQuestionnaire onBack={() => setSelectedQuestionnaire(null)} onComplete={(score) => handleComplete('allodynia', score, undefined, customDate)} />
    );
  }
  if (selectedQuestionnaire === 'pss') {
    return renderQuestionnaireWithDatePicker(
      <PSSQuestionnaire onBack={() => setSelectedQuestionnaire(null)} onComplete={(score) => handleComplete('pss', score, undefined, customDate)} />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-text-primary mb-2">健康量表</h2>
        <p className="text-text-secondary">定期填寫量表有助於醫師評估您的整體健康狀況</p>
      </div>

      {/* Progress Summary */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-text-primary">完成進度</h3>
          <span className="text-primary">
            {questionnaires.filter((q) => q.completed).length} / {questionnaires.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-primary h-3 rounded-full transition-all"
            style={{ width: `${(questionnaires.filter((q) => q.completed).length / questionnaires.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Questionnaires Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {questionnaires.map((questionnaire) => (
          <button
            key={questionnaire.id}
            onClick={() => setSelectedQuestionnaire(questionnaire.id)}
            className="bg-white rounded-xl shadow-md p-6 border border-border hover:shadow-lg hover:border-primary transition-all text-left group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-medical-blue rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="text-text-primary group-hover:text-primary transition-colors">{questionnaire.name}</h4>
                  <p className="text-text-secondary">{questionnaire.fullName}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-text-secondary group-hover:text-primary transition-colors" />
            </div>

            <p className="text-text-secondary mb-3">{questionnaire.description}</p>

            <div className="flex items-center justify-between">
              {questionnaire.completed ? (
                <div className="flex items-center gap-2 text-success">
                  <CheckCircle className="w-5 h-5" />
                  <span>已完成</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-text-secondary">
                  <Circle className="w-5 h-5" />
                  <span>待填寫</span>
                </div>
              )}
              {questionnaire.lastCompleted && (
                <span className="text-text-secondary">
                  {questionnaire.lastCompleted}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
