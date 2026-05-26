import { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';

interface WPIQuestionnaireProps {
  onBack: () => void;
  onComplete: () => void;
}

export function WPIQuestionnaire({ onBack, onComplete }: WPIQuestionnaireProps) {
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);

  const bodyAreas = [
    { id: 'shoulder-left', label: '左肩' },
    { id: 'shoulder-right', label: '右肩' },
    { id: 'arm-left', label: '左上臂' },
    { id: 'arm-right', label: '右上臂' },
    { id: 'forearm-left', label: '左前臂' },
    { id: 'forearm-right', label: '右前臂' },
    { id: 'hip-left', label: '左臀部' },
    { id: 'hip-right', label: '右臀部' },
    { id: 'thigh-left', label: '左大腿' },
    { id: 'thigh-right', label: '右大腿' },
    { id: 'calf-left', label: '左小腿' },
    { id: 'calf-right', label: '右小腿' },
    { id: 'jaw-left', label: '左下顎' },
    { id: 'jaw-right', label: '右下顎' },
    { id: 'chest', label: '胸部' },
    { id: 'abdomen', label: '腹部' },
    { id: 'upper-back', label: '上背' },
    { id: 'lower-back', label: '下背' },
    { id: 'neck', label: '頸部' },
  ];

  const toggleArea = (areaId: string) => {
    setSelectedAreas((prev) =>
      prev.includes(areaId) ? prev.filter((id) => id !== areaId) : [...prev, areaId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const score = selectedAreas.length;
    alert(`WPI 評估結果：\n\n廣泛疼痛指數：${score}/19\n\n評估結果將儲存至系統。`);
    onComplete();
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
          <h2 className="text-text-primary">WPI 廣泛疼痛指數</h2>
          <p className="text-text-secondary">Widespread Pain Index</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 border border-border">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-medical-blue p-4 rounded-lg">
            <p className="text-text-primary">
              請選擇過去一週內您曾經感到疼痛的身體部位
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {bodyAreas.map((area) => (
              <button
                key={area.id}
                type="button"
                onClick={() => toggleArea(area.id)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedAreas.includes(area.id)
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-text-secondary border-border hover:border-primary'
                }`}
              >
                {area.label}
              </button>
            ))}
          </div>

          {/* Score Display */}
          <div className="bg-gray-50 p-6 rounded-lg border-2 border-border">
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">已選擇部位數</span>
              <span className="text-primary">{selectedAreas.length}/19</span>
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
