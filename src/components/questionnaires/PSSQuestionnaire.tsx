import { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';

interface PSSQuestionnaireProps {
  onBack: () => void;
  onComplete: (score: number) => void;
}

export function PSSQuestionnaire({ onBack, onComplete }: PSSQuestionnaireProps) {
  const [answers, setAnswers] = useState<number[]>(Array(10).fill(-1));

  const questions = [
    '過去一個月，您有多常因為某些意料之外的事情而感到心煩？',
    '過去一個月，您有多常覺得無法控制生活中重要的事情？',
    '過去一個月，您有多常感到緊張或壓力？',
    '過去一個月，您有多常有信心能處理個人的問題？',
    '過去一個月，您有多常覺得事情都在您的掌控之中？',
    '過去一個月，您有多常發現自己無法應付所有必須做的事情？',
    '過去一個月，您有多常能夠控制生活中令人惱怒的事情？',
    '過去一個月，您有多常覺得您在掌控全局？',
    '過去一個月，您有多常因為事情超出您的控制範圍而生氣？',
    '過去一個月，您有多常覺得困難堆積如山，以致於您無法克服它們？',
  ];

  const options = ['從不', '幾乎不', '有時候', '相當經常', '非常經常'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answers.some((a) => a === -1)) {
      alert('請回答所有問題');
      return;
    }

    // Reverse scoring for items 3, 4, 6, 7
    const reverseItems = [3, 4, 6, 7];
    let total = 0;
    answers.forEach((answer, index) => {
      if (reverseItems.includes(index)) {
        total += 4 - answer;
      } else {
        total += answer;
      }
    });

    let level = '';
    if (total <= 13) level = '低壓力';
    else if (total <= 26) level = '中度壓力';
    else level = '高壓力';

    alert(`PSS 評估結果：\n\n總分：${total}\n程度：${level}\n\n評估結果將儲存至系統。`);
    onComplete(total);
  };

  const getScore = () => {
    const reverseItems = [3, 4, 6, 7];
    let total = 0;
    answers.forEach((answer, index) => {
      if (answer >= 0) {
        if (reverseItems.includes(index)) {
          total += 4 - answer;
        } else {
          total += answer;
        }
      }
    });
    return total;
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
          <h2 className="text-text-primary">PSS 知覺壓力量表</h2>
          <p className="text-text-secondary">Perceived Stress Scale</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 border border-border">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-medical-blue p-4 rounded-lg">
            <p className="text-text-primary">
              請根據過去一個月的情況回答以下問題
            </p>
          </div>

          {questions.map((question, index) => (
            <div key={index} className="space-y-3 pb-4 border-b border-border last:border-b-0">
              <label className="block text-text-primary">
                {index + 1}. {question}
              </label>
              <div className="grid grid-cols-5 gap-2">
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
                  >
                    <div className="hidden md:block">{option}</div>
                    <div className="md:hidden">{optionIndex}</div>
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-text-secondary md:hidden">
                <span>從不</span>
                <span>非常經常</span>
              </div>
            </div>
          ))}

          {/* Score Display */}
          <div className="bg-gray-50 p-6 rounded-lg border-2 border-border">
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">總分</span>
              <span className="text-primary">{getScore()}/40</span>
            </div>
            <p className="text-text-secondary mt-2">0-13：低壓力 | 14-26：中度壓力 | 27-40：高壓力</p>
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
