import { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';

interface FSSQuestionnaireProps {
  onBack: () => void;
  onComplete: () => void;
}

export function FSSQuestionnaire({ onBack, onComplete }: FSSQuestionnaireProps) {
  const [answers, setAnswers] = useState<number[]>(Array(9).fill(-1));

  const questions = [
    '我的動機較低',
    '運動會使我疲倦',
    '我容易疲倦',
    '疲倦會干擾我的身體功能',
    '疲倦經常造成問題',
    '疲倦阻止我持續的身體活動',
    '疲倦會干擾我執行某些職責和責任',
    '疲倦是我最使人困擾的三個症狀之一',
    '疲倦會干擾我的工作、家庭或社交生活',
  ];

  const options = ['完全不同意', '不同意', '有點不同意', '中立', '有點同意', '同意', '完全同意'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answers.some((a) => a === -1)) {
      alert('請回答所有問題');
      return;
    }

    const total = answers.reduce((sum, val) => sum + (val + 1), 0);
    const average = (total / 9).toFixed(1);
    const level = parseFloat(average) >= 4 ? '顯著疲勞' : '正常範圍';

    alert(`FSS 評估結果：\n\n平均分數：${average}\n評估：${level}\n\n評估結果將儲存至系統。`);
    onComplete();
  };

  const getAverage = () => {
    const validAnswers = answers.filter((a) => a >= 0);
    if (validAnswers.length === 0) return 0;
    const total = validAnswers.reduce((sum, val) => sum + (val + 1), 0);
    return (total / validAnswers.length).toFixed(1);
  };

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
          <h2 className="text-text-primary">FSS 疲勞嚴重度量表</h2>
          <p className="text-text-secondary">Fatigue Severity Scale</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 border border-border">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-medical-blue p-4 rounded-lg">
            <p className="text-text-primary">請根據過去一週的情況，選擇最符合您的選項（1-7分）</p>
          </div>

          {questions.map((question, index) => (
            <div key={index} className="space-y-3 pb-4 border-b border-border last:border-b-0">
              <label className="block text-text-primary">
                {index + 1}. {question}
              </label>
              <div className="grid grid-cols-7 gap-2">
                {options.map((option, optionIndex) => (
                  <button
                    key={optionIndex}
                    type="button"
                    onClick={() => {
                      const newAnswers = [...answers];
                      newAnswers[index] = optionIndex;
                      setAnswers(newAnswers);
                    }}
                    className={`p-3 rounded-lg border-2 transition-all text-center ${
                      answers[index] === optionIndex
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white text-text-secondary border-border hover:border-primary'
                    }`}
                    title={option}
                  >
                    {optionIndex + 1}
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>完全不同意</span>
                <span>完全同意</span>
              </div>
            </div>
          ))}

          {/* Score Display */}
          <div className="bg-gray-50 p-6 rounded-lg border-2 border-border">
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">平均分數</span>
              <span className="text-primary">{getAverage()}/7</span>
            </div>
            <p className="text-text-secondary mt-2">平均分數 ≥ 4 表示顯著疲勞</p>
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
