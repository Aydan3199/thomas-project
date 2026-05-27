import { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';

interface BDIQuestionnaireProps {
  onBack: () => void;
  onComplete: (score: number) => void;
}

export function BDIQuestionnaire({ onBack, onComplete }: BDIQuestionnaireProps) {
  const [answers, setAnswers] = useState<number[]>(Array(10).fill(-1));

  const questions = [
    {
      text: '悲傷',
      options: ['我不感到悲傷', '我感到悲傷', '我總是感到悲傷，無法擺脫', '我如此悲傷或不快樂，以致於無法忍受'],
    },
    {
      text: '悲觀',
      options: ['我對未來不感到特別氣餒', '我對未來感到氣餒', '我對未來感到沒有什麼可期待', '我覺得未來是沒有希望的，事情不會好轉'],
    },
    {
      text: '失敗感',
      options: ['我不覺得自己是失敗的', '我覺得自己比一般人失敗', '回顧過去，我看到很多失敗', '我覺得自己是一個完全失敗的人'],
    },
    {
      text: '失去樂趣',
      options: ['我從事情中得到的滿足與以往相同', '我不像從前那樣享受事物', '我從任何事物中得到的真正滿足很少', '我對任何事物都不滿意或感到厭煩'],
    },
    {
      text: '罪惡感',
      options: ['我不特別感到罪惡', '我在很多時候感到罪惡', '我在大部分時候感到罪惡', '我總是感到罪惡'],
    },
    {
      text: '懲罰感',
      options: ['我不覺得自己正在受懲罰', '我覺得自己可能會受懲罰', '我預期會受懲罰', '我覺得自己正在受懲罰'],
    },
    {
      text: '自我厭惡',
      options: ['我對自己的感覺與以往相同', '我對自己失去信心', '我對自己感到失望', '我厭惡自己'],
    },
    {
      text: '自我批評',
      options: ['我不比平常更批評或責怪自己', '我比過去更批評自己', '我為自己所有的過錯而責備自己', '我為發生的所有壞事而責備自己'],
    },
    {
      text: '疲倦',
      options: ['我不比平常更感到疲倦', '我比過去更容易疲倦', '做任何事都會讓我疲倦', '我太疲倦以致無法做任何事'],
    },
    {
      text: '失去興趣',
      options: ['我對人的興趣沒有失去', '我對人的興趣比過去少', '我對人的興趣大部分已失去', '我對人已完全失去興趣'],
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answers.some((a) => a === -1)) {
      alert('請回答所有問題');
      return;
    }

    const total = answers.reduce((sum, val) => sum + val, 0);
    let level = '';
    if (total <= 13) level = '輕微或無憂鬱';
    else if (total <= 19) level = '輕度憂鬱';
    else if (total <= 28) level = '中度憂鬱';
    else level = '嚴重憂鬱';

    alert(`BDI 評估結果：\n\n總分：${total}\n程度：${level}\n\n評估結果將儲存至系統。`);
    onComplete(total);
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
          <h2 className="text-text-primary">BDI 貝克憂鬱量表</h2>
          <p className="text-text-secondary">Beck Depression Inventory (簡化版)</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 border border-border">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-medical-blue p-4 rounded-lg">
            <p className="text-text-primary">請選擇最能描述您過去兩週感受的選項</p>
          </div>

          {questions.map((question, index) => (
            <div key={index} className="space-y-3 pb-4 border-b border-border last:border-b-0">
              <label className="block text-text-primary">
                {index + 1}. {question.text}
              </label>
              <div className="space-y-2">
                {question.options.map((option, optionIndex) => (
                  <button
                    key={optionIndex}
                    type="button"
                    onClick={() => {
                      const newAnswers = [...answers];
                      newAnswers[index] = optionIndex;
                      setAnswers(newAnswers);
                    }}
                    className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                      answers[index] === optionIndex
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white text-text-secondary border-border hover:border-primary'
                    }`}
                  >
                    {optionIndex}. {option}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Score Display */}
          <div className="bg-gray-50 p-6 rounded-lg border-2 border-border">
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">總分</span>
              <span className="text-primary">{getScore()}/39</span>
            </div>
            <p className="text-text-secondary mt-2">0-13：輕微或無 | 14-19：輕度 | 20-28：中度 | 29-63：嚴重</p>
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
