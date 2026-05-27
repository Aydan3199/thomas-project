import { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';

interface PSQIQuestionnaireProps {
  onBack: () => void;
  onComplete: (score: number) => void;
}

export function PSQIQuestionnaire({ onBack, onComplete }: PSQIQuestionnaireProps) {
  const [bedTime, setBedTime] = useState('23:00');
  const [fallAsleepTime, setFallAsleepTime] = useState('30');
  const [wakeTime, setWakeTime] = useState('07:00');
  const [sleepHours, setSleepHours] = useState('7');
  const [answers, setAnswers] = useState<number[]>(Array(7).fill(-1));

  const questions = [
    {
      text: '過去一個月，您無法在 30 分鐘內入睡的頻率？',
      options: ['沒有', '少於一週一次', '一週一至兩次', '一週三次或以上'],
    },
    {
      text: '過去一個月，您半夜或清晨醒來的頻率？',
      options: ['沒有', '少於一週一次', '一週一至兩次', '一週三次或以上'],
    },
    {
      text: '過去一個月，您因需要上廁所而起床的頻率？',
      options: ['沒有', '少於一週一次', '一週一至兩次', '一週三次或以上'],
    },
    {
      text: '過去一個月，您因呼吸不順而睡不好的頻率？',
      options: ['沒有', '少於一週一次', '一週一至兩次', '一週三次或以上'],
    },
    {
      text: '過去一個月，您整體的睡眠品質如何？',
      options: ['非常好', '還算好', '不太好', '非常不好'],
    },
    {
      text: '過去一個月，您需要使用藥物幫助睡眠的頻率？',
      options: ['沒有', '少於一週一次', '一週一至兩次', '一週三次或以上'],
    },
    {
      text: '過去一個月，您白天因睡眠問題而難以保持清醒的頻率？',
      options: ['沒有', '少於一週一次', '一週一至兩次', '一週三次或以上'],
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bedTime || !fallAsleepTime || !wakeTime || !sleepHours) {
      alert('請填寫所有睡眠基本資訊（如就寢時間、入睡時間、起床時間與睡眠時數）');
      return;
    }
    if (answers.some((a) => a === -1)) {
      alert('請回答所有問題');
      return;
    }

    const total = answers.reduce((sum, val) => sum + val, 0);
    const quality = total > 5 ? '睡眠品質不佳' : '睡眠品質良好';

    alert(`PSQI 評估結果：\n\n總分：${total}\n評估：${quality}\n\n評估結果將儲存至系統。`);
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
          <h2 className="text-text-primary">PSQI 匹茲堡睡眠品質指數</h2>
          <p className="text-text-secondary">Pittsburgh Sleep Quality Index</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 border border-border">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-medical-blue p-4 rounded-lg">
            <p className="text-text-primary">以下問題是關於您過去一個月的睡眠習慣</p>
          </div>

          {/* Basic sleep info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">通常就寢時間</label>
              <input
                type="time"
                value={bedTime}
                onChange={(e) => setBedTime(e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block mb-2">入睡所需時間（分鐘）</label>
              <input
                type="number"
                value={fallAsleepTime}
                onChange={(e) => setFallAsleepTime(e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block mb-2">通常起床時間</label>
              <input
                type="time"
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block mb-2">實際睡眠時數</label>
              <input
                type="number"
                value={sleepHours}
                onChange={(e) => setSleepHours(e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                step="0.5"
              />
            </div>
          </div>

          {questions.map((question, index) => (
            <div key={index} className="space-y-3 pb-4 border-b border-border last:border-b-0">
              <label className="block text-text-primary">{question.text}</label>
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
          <div className="bg-gray-50 p-6 rounded-lg border-2 border-border">
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">總分</span>
              <span className="text-primary">{getScore()}/21</span>
            </div>
            <p className="text-text-secondary mt-2">分數 {'>'} 5 表示睡眠品質不佳</p>
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
