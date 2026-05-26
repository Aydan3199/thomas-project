import { useState, useEffect } from 'react';
import { Plus, Calendar, Clock, Activity, Edit2, Trash2 } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { API_BASE_URL } from '../config';

interface DiaryEntry {
  id?: string;
  userId?: string;
  date: string;
  time: string;
  intensity: number;
  symptoms: string[];
  medication: string;
  notes: string;
}

export function HeadacheDiary() {
  const currentUser = useAuthStore((state) => state.currentUser);
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (currentUser?.id) {
      setIsLoading(true);
      fetch(`${API_BASE_URL}/api/diaries/user/${currentUser.id}`)
        .then(res => res.json())
        .then(data => setEntries(data))
        .catch(err => console.error("Failed to fetch diaries:", err))
        .finally(() => setIsLoading(false));
    }
  }, [currentUser]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    intensity: 5,
    symptoms: [] as string[],
    medication: '',
    notes: '',
  });

  const symptomOptions = [
    '搏動性疼痛',
    '壓迫性疼痛',
    '噁心',
    '嘔吐',
    '畏光',
    '怕吵',
    '頭暈',
    '視覺異常',
  ];

  const handleSymptomToggle = (symptom: string) => {
    setFormData((prev) => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter((s) => s !== symptom)
        : [...prev.symptoms, symptom],
    }));
  };

  const handleEdit = (entry: DiaryEntry) => {
    setEditingId(entry.id || null);
    setFormData({
      date: entry.date,
      time: entry.time,
      intensity: entry.intensity,
      symptoms: entry.symptoms,
      medication: entry.medication,
      notes: entry.notes,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string | undefined) => {
    if (!id) return;
    if (confirm('確定要刪除這筆記錄嗎？')) {
      try {
        await fetch(`${API_BASE_URL}/api/diaries/${id}`, { method: 'DELETE' });
        setEntries(entries.filter(entry => entry.id !== id));
      } catch (err) {
        console.error("Failed to delete", err);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    
    const entryData: DiaryEntry = {
      ...formData,
      userId: currentUser.id,
    };

    if (editingId) {
      entryData.id = editingId;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/diaries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entryData)
      });
      const savedEntry = await res.json();
      
      if (editingId) {
        setEntries(entries.map(entry => entry.id === editingId ? savedEntry : entry));
      } else {
        setEntries([savedEntry, ...entries]);
      }
    } catch (err) {
      console.error("Failed to save", err);
    }
    
    setShowForm(false);
    setEditingId(null);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      intensity: 5,
      symptoms: [],
      medication: '',
      notes: '',
    });
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      intensity: 5,
      symptoms: [],
      medication: '',
      notes: '',
    });
  };

  return (
    <div className="space-y-6">
      {/* Add Entry Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-text-primary">頭痛日誌</h2>
          <p className="text-text-secondary">記錄您的頭痛狀況</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-all shadow-md hover:shadow-lg"
        >
          <Plus className="w-5 h-5" />
          新增記錄
        </button>
      </div>

      {/* Entry Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-border">
          <h3 className="mb-6 text-text-primary">
            {editingId ? '編輯頭痛記錄' : '新增頭痛記錄'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date */}
              <div>
                <label className="block mb-2">日期</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              {/* Time */}
              <div>
                <label className="block mb-2">時間</label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
            </div>

            {/* Intensity */}
            <div>
              <label className="block mb-2">疼痛強度：{formData.intensity} / 10</label>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.intensity}
                onChange={(e) => setFormData({ ...formData, intensity: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-text-secondary mt-1">
                <span>輕微</span>
                <span>嚴重</span>
              </div>
            </div>

            {/* Symptoms */}
            <div>
              <label className="block mb-3">症狀（可多選）</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {symptomOptions.map((symptom) => (
                  <button
                    key={symptom}
                    type="button"
                    onClick={() => handleSymptomToggle(symptom)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      formData.symptoms.includes(symptom)
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white text-text-secondary border-border hover:border-primary'
                    }`}
                  >
                    {symptom}
                  </button>
                ))}
              </div>
            </div>

            {/* Medication */}
            <div>
              <label className="block mb-2">用藥</label>
              <input
                type="text"
                value={formData.medication}
                onChange={(e) => setFormData({ ...formData, medication: e.target.value })}
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="例：止痛藥 500mg"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block mb-2">備註</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                rows={3}
                placeholder="記錄任何可能的誘發因素或其他資訊"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={handleCancelForm}
                className="px-6 py-2 border border-border rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-all shadow-md"
              >
                {editingId ? '更新' : '儲存'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Entries List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center text-text-secondary py-8">載入中...</div>
        ) : entries.length === 0 ? (
          <div className="text-center bg-white rounded-xl shadow-md p-8 border border-border">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <div className="text-text-secondary text-lg">尚無紀錄</div>
            <p className="text-gray-400 mt-1">點擊上方「新增記錄」開始追蹤您的頭痛狀況</p>
          </div>
        ) : (
          entries.map((entry) => (
            <div key={entry.id} className="bg-white rounded-xl shadow-md p-6 border border-border hover:shadow-lg transition-shadow">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-text-secondary">
                  <Calendar className="w-5 h-5" />
                  {entry.date}
                </div>
                <div className="flex items-center gap-2 text-text-secondary">
                  <Clock className="w-5 h-5" />
                  {entry.time}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-danger" />
                <span className="text-danger">疼痛強度：{entry.intensity}/10</span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-text-secondary">症狀：</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {entry.symptoms.map((symptom, idx) => (
                    <span key={idx} className="px-3 py-1 bg-medical-blue text-primary rounded-full">
                      {symptom}
                    </span>
                  ))}
                </div>
              </div>

              {entry.medication && (
                <div>
                  <span className="text-text-secondary">用藥：</span>
                  <span className="ml-2 text-text-primary">{entry.medication}</span>
                </div>
              )}

              {entry.notes && (
                <div>
                  <span className="text-text-secondary">備註：</span>
                  <span className="ml-2 text-text-primary">{entry.notes}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-4 pt-4 border-t border-border">
              <button
                onClick={() => handleEdit(entry)}
                className="flex items-center gap-2 px-4 py-2 text-primary hover:bg-medical-blue rounded-lg transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                編輯
              </button>
              <button
                onClick={() => handleDelete(entry.id)}
                className="flex items-center gap-2 px-4 py-2 text-danger hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                刪除
              </button>
            </div>
          </div>
          ))
        )}
      </div>
    </div>
  );
}