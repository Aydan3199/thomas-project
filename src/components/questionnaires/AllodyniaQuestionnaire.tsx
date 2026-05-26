import { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';

interface AllodyniaQuestionnaireProps {
  onBack: () => void;
  onComplete: () => void;
}

export function AllodyniaQuestionnaire({ onBack, onComplete }: AllodyniaQuestionnaireProps) {
  const [answers, setAnswers] = useState<number[]>(Array(12).fill(-1));

  const questions = [
    '頭痛發作時，梳頭是否會讓您感到疼痛或不舒服？',
    '頭痛發作時，綁馬尾或戴帽子是否會讓您感到疼痛或不舒服？',
    '頭痛發作時，刮鬍子是否會讓您感到疼痛或不舒服？',
    '頭痛發作時，戴眼鏡或隱形眼鏡是否會讓您感到疼痛或不舒服？',
    '頭痛發作時，戴耳環或項鍊是否會讓您感到疼痛或不舒服？',
    '頭痛發作時，洗臉或洗頭是否會讓您感到疼痛或不舒服？',
    '頭痛發作時，碰觸臉部或頭部是否會讓您感到疼痛或不舒服？',
    '頭痛發作時，淋浴時水滴打在臉上是否會讓您感到疼痛或不舒服？',
    '頭痛發作時，冷空氣吹到臉上是否會讓您感到疼痛或不舒服？',
    '頭痛發作時，躺在枕頭上是否會讓您感到疼痛或不舒服？',
    '頭痛發作時，頭部靠在椅背上是否會讓您感到疼痛或不舒服？',
    '頭痛發作時，洗熱水澡是否會讓您感到疼痛或不舒服？',
  ];

  const options = ['否', '是'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answers.some((a) => a === -1)) {
      alert('請回答所有問題');
      return;
    }

    const score = answers.reduce((sum, val) => sum + val, 0);
    let severity = '';
    if (score === 0) severity = '無異位性疼痛';
    else if (score <= 2) severity = '輕度異位性疼痛';
    else if (score <= 6) severity = '中度異位性疼痛';
    else severity = '嚴重異位性疼痛';

    alert(`Allodynia 評估結果：\n\n總分：${score}/12\n程度：${severity}\n\n評估結果將儲存至系統。`);
    onComplete();
  };

  const getScore = () => {
    return answers.reduce((sum, val) => sum + (val >= 0 ? val : 0), 0);
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
          <h2 className="text-text-primary">Allodynia 異位性疼痛問卷</h2>
          <p className="text-text-secondary">Allodynia Symptom Checklist</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 border border-border">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-medical-blue p-4 rounded-lg">
            <p className="text-text-primary">
              異位性疼痛是指一般不會引起疼痛的刺激卻會引起疼痛的現象。請回答以下問題：
            </p>
          </div>

          {questions.map((question, index) => (
            <div key={index} className="space-y-3 pb-4 border-b border-border last:border-b-0">
              <label className="block text-text-primary">
                {index + 1}. {question}
              </label>
              <div className="grid grid-cols-2 gap-3">
                {options.map((option, optionIndex) => (
                  <button
                    key={optionIndex}
                    type="button"
                    onClick={() => {
                      const newAnswers = [...answers];
                      newAnswers[index] = optionIndex;
                      setAnswers(newAnswers);
                    }}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      answers[index] === optionIndex
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white text-text-secondary border-border hover:border-primary'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Score Display */}
          <div className="bg-gray-50 p-6 rounded-lg border-2 border-border">
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">總分</span>
              <span className="text-primary">{getScore()}/12</span>
            </div>
            <p className="text-text-secondary mt-2">0：無 | 1-2：輕度 | 3-6：中度 | 7-12：嚴重</p>
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
