import { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';

interface HADSQuestionnaireProps {
  onBack: () => void;
  onComplete: () => void;
}

export function HADSQuestionnaire({ onBack, onComplete }: HADSQuestionnaireProps) {
  const [answers, setAnswers] = useState<number[]>(Array(14).fill(-1));

  const questions = [
    { text: '我感到緊張或緊繃', type: 'A', options: ['完全沒有', '偶爾', '經常', '幾乎總是'] },
    { text: '我仍然能享受過去喜歡的事物', type: 'D', options: ['確實如此', '不太如此', '只有一點點', '完全不能'] },
    { text: '我有一種害怕的感覺，好像將有可怕的事情要發生', type: 'A', options: ['完全沒有', '有一點', '確實有，但不太嚴重', '非常嚴重'] },
    { text: '我能夠開懷大笑並看到事物有趣的一面', type: 'D', options: ['和過去一樣', '不如過去那麼多', '現在少很多', '完全不能'] },
    { text: '我腦海中充滿擔憂的想法', type: 'A', options: ['只是偶爾', '有時候', '大部分時間', '非常頻繁'] },
    { text: '我感到愉快', type: 'D', options: ['從未如此', '不常如此', '有時如此', '大部分時候'] },
    { text: '我能夠輕鬆坐下來並感到放鬆', type: 'A', options: ['確實如此', '通常如此', '不太如此', '完全不能'] },
    { text: '我感覺行動遲緩', type: 'D', options: ['從未如此', '有時如此', '經常如此', '幾乎總是'] },
    { text: '我有一種害怕的感覺，好像胃裡有蝴蝶在飛', type: 'A', options: ['完全沒有', '偶爾', '相當頻繁', '非常頻繁'] },
    { text: '我對自己的外表失去興趣', type: 'D', options: ['仍然關心', '不如過去關心', '可能不太關心', '完全不關心'] },
    { text: '我感到坐立不安，好像必須不斷活動', type: 'A', options: ['完全沒有', '不太如此', '相當嚴重', '非常嚴重'] },
    { text: '我期待享受事物', type: 'D', options: ['和過去一樣', '比過去少一點', '比過去少很多', '幾乎沒有'] },
    { text: '我突然感到驚慌', type: 'A', options: ['完全沒有', '不太頻繁', '相當頻繁', '非常頻繁'] },
    { text: '我能夠享受一本好書、廣播或電視節目', type: 'D', options: ['經常如此', '有時如此', '不太如此', '很少如此'] },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answers.some((a) => a === -1)) {
      alert('請回答所有問題');
      return;
    }

    const anxietyScore = answers
      .filter((_, idx) => questions[idx].type === 'A')
      .reduce((sum, val) => sum + val, 0);
    
    const depressionScore = answers
      .filter((_, idx) => questions[idx].type === 'D')
      .reduce((sum, val) => sum + val, 0);

    alert(
      `HADS 評估結果：\n\n焦慮分數 (A)：${anxietyScore}\n憂鬱分數 (D)：${depressionScore}\n\n評估結果將儲存至系統。`
    );
    onComplete();
  };

  const getAnxietyScore = () => {
    return answers
      .filter((_, idx) => questions[idx].type === 'A')
      .reduce((sum, val) => sum + (val >= 0 ? val : 0), 0);
  };

  const getDepressionScore = () => {
    return answers
      .filter((_, idx) => questions[idx].type === 'D')
      .reduce((sum, val) => sum + (val >= 0 ? val : 0), 0);
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
          <h2 className="text-text-primary">HADS 醫院焦慮憂鬱量表</h2>
          <p className="text-text-secondary">Hospital Anxiety and Depression Scale</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 border border-border">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-medical-blue p-4 rounded-lg">
            <p className="text-text-primary">
              請選擇最能描述您過去一週感受的選項
            </p>
          </div>

          {questions.map((question, index) => (
            <div key={index} className="space-y-3 pb-4 border-b border-border last:border-b-0">
              <label className="block text-text-primary">
                {index + 1}. {question.text}
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {question.options.map((option, optionIndex) => (
                  <button
                    key={optionIndex}
                    type="button"
                    onClick={() => {
                      const newAnswers = [...answers];
                      newAnswers[index] = optionIndex;
                      setAnswers(newAnswers);
                    }}
                    className={`p-3 rounded-lg border-2 transition-all text-left ${
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
          <div className="bg-gray-50 p-6 rounded-lg border-2 border-border space-y-3">
            <h4 className="text-text-primary">評分</h4>
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">焦慮分數 (A)</span>
              <span className="text-primary">{getAnxietyScore()}/21</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">憂鬱分數 (D)</span>
              <span className="text-primary">{getDepressionScore()}/21</span>
            </div>
            <p className="text-text-secondary">0-7：正常 | 8-10：邊緣 | 11-21：異常</p>
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
