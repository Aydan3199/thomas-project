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
                       // Find the latest response by date simply or take first
                       const lastResponse = qs[qs.length - 1]; 
                       return { ...q, completed: true, lastCompleted: lastResponse.completedAt.split('T')[0] };
                   }
                   return q;
               }));
          })
          .catch(err => console.error("Failed to load questionnaires", err));
    }
  }, [currentUser]);

  const handleComplete = async (questionnaireId: string) => {
    if (!currentUser) return;
    
    // Simplistic completion saving (can be extended to include actual scores)
    try {
        await fetch(`${API_BASE_URL}/api/questionnaires`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                patientId: currentUser.id,
                questionnaireId: questionnaireId,
                score: 0,
                details: 'Completed via UI'
            })
        });
        
        setQuestionnaires((prev) =>
          prev.map((q) =>
            q.id === questionnaireId
              ? { ...q, completed: true, lastCompleted: new Date().toISOString().split('T')[0] }
              : q
          )
        );
    } catch(err) {
        console.error("Save questionnaire error", err);
    }
    
    setSelectedQuestionnaire(null);
  };

  if (selectedQuestionnaire === 'midas') {
    return <MIDASQuestionnaire onBack={() => setSelectedQuestionnaire(null)} onComplete={() => handleComplete('midas')} />;
  }
  if (selectedQuestionnaire === 'hads') {
    return <HADSQuestionnaire onBack={() => setSelectedQuestionnaire(null)} onComplete={() => handleComplete('hads')} />;
  }
  if (selectedQuestionnaire === 'bdi') {
    return <BDIQuestionnaire onBack={() => setSelectedQuestionnaire(null)} onComplete={() => handleComplete('bdi')} />;
  }
  if (selectedQuestionnaire === 'psqi') {
    return <PSQIQuestionnaire onBack={() => setSelectedQuestionnaire(null)} onComplete={() => handleComplete('psqi')} />;
  }
  if (selectedQuestionnaire === 'fss') {
    return <FSSQuestionnaire onBack={() => setSelectedQuestionnaire(null)} onComplete={() => handleComplete('fss')} />;
  }
  if (selectedQuestionnaire === 'wpi') {
    return <WPIQuestionnaire onBack={() => setSelectedQuestionnaire(null)} onComplete={() => handleComplete('wpi')} />;
  }
  if (selectedQuestionnaire === 'allodynia') {
    return <AllodyniaQuestionnaire onBack={() => setSelectedQuestionnaire(null)} onComplete={() => handleComplete('allodynia')} />;
  }
  if (selectedQuestionnaire === 'pss') {
    return <PSSQuestionnaire onBack={() => setSelectedQuestionnaire(null)} onComplete={() => handleComplete('pss')} />;
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
