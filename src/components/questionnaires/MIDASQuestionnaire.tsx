import { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';

interface MIDASQuestionnaireProps {
  onBack: () => void;
  onComplete: (score: number) => void;
}

export function MIDASQuestionnaire({ onBack, onComplete }: MIDASQuestionnaireProps) {
  const [answers, setAnswers] = useState<(number | '')[]>(Array(5).fill(''));

  const questions = [
    '在過去三個月中，因為頭痛您有幾天無法工作或上學？',
    '在過去三個月中，因為頭痛您的工作或學業效率減少一半以上的天數有幾天？（不包括第1題的天數）',
    '在過去三個月中，因為頭痛您有幾天無法處理家務？',
    '在過去三個月中，因為頭痛您處理家務的效率減少一半以上的天數有幾天？（不包括第3題的天數）',
    '在過去三個月中，因為頭痛您有幾天無法參加家庭、社交或休閒活動？',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answers.some((a) => a === '')) {
      alert('請填寫所有問題的天數');
      return;
    }
    const total = answers.reduce((sum, val) => sum + (val === '' ? 0 : val), 0);
    alert(`您的 MIDAS 總分為：${total}\n\n評估結果將儲存至系統。`);
    onComplete(total);
  };

  const getGrade = () => {
    const total = answers.reduce((sum, val) => sum + (val === '' ? 0 : val), 0);
    if (total <= 5) return { grade: 'I', level: '輕微或無失能', color: 'text-success' };
    if (total <= 10) return { grade: 'II', level: '輕度失能', color: 'text-warning' };
    if (total <= 20) return { grade: 'III', level: '中度失能', color: 'text-warning' };
    return { grade: 'IV', level: '嚴重失能', color: 'text-danger' };
  };

  const grade = getGrade();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          返回
        </button>
        <div>
          <h2 className="text-text-primary">MIDAS 偏頭痛失能評估量表</h2>
          <p className="text-text-secondary">Migraine Disability Assessment</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 border border-border">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-medical-blue p-4 rounded-lg">
            <p className="text-text-primary">
              請回想過去三個月的情況，回答以下問題。請填入天數（如果沒有，請填 0）
            </p>
          </div>

          {questions.map((question, index) => (
            <div key={index} className="space-y-2">
              <label className="block text-text-primary">
                {index + 1}. {question}
              </label>
              <input
                type="number"
                min="0"
                max="90"
                value={answers[index]}
                onChange={(e) => {
                  const newAnswers = [...answers];
                  newAnswers[index] = e.target.value === '' ? '' : parseInt(e.target.value);
                  setAnswers(newAnswers);
                }}
                className="w-full md:w-48 px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="天數"
                required
              />
            </div>
          ))}

          {/* Score Display */}
          <div className="bg-gray-50 p-6 rounded-lg border-2 border-border">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-text-primary">總分</h4>
              <span className="text-primary">{answers.reduce((sum, val) => sum + (val === '' ? 0 : val), 0)} 天</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">評級</span>
              <span className={`${grade.color}`}>
                Grade {grade.grade} - {grade.level}
              </span>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-2 border border-border rounded-lg hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-all shadow-md"
            >
              <Save className="w-5 h-5" />
              儲存問卷
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
