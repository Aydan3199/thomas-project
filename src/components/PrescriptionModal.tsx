import { useState } from 'react';
import { X, Pill, Plus, Trash2, FileText } from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
}

interface PrescriptionModalProps {
  patient: Patient;
  onClose: () => void;
  onSubmit: (prescription: PrescriptionData) => void;
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes: string;
}

interface PrescriptionData {
  medications: Medication[];
  diagnosis: string;
  instructions: string;
  nextVisit: string;
}

const commonMedications = [
  { name: '普拿疼膜衣錠 (Panadol)', defaultDosage: '500mg', defaultFrequency: '發作時或每4-6小時1錠' },
  { name: '普拿疼加強錠 (Panadol Extra)', defaultDosage: '500mg + 65mg 咖啡因', defaultFrequency: '發作時或每4-6小時1錠' },
  { name: 'EVE Quick 止痛藥 (EVE)', defaultDosage: '150mg Ibuprofen', defaultFrequency: '發作時服用(每次2錠)' },
  { name: '百服寧止痛加強錠 (Bufferin)', defaultDosage: '500mg', defaultFrequency: '發作時或每4-6小時1錠' },
  { name: '斯斯止痛膠囊 (Snooz)', defaultDosage: '500mg', defaultFrequency: '每4-6小時1次(每次1-2粒)' },
];

export function PrescriptionModal({ patient, onClose, onSubmit }: PrescriptionModalProps) {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [diagnosis, setDiagnosis] = useState('偏頭痛');
  const [instructions, setInstructions] = useState('');
  const [nextVisit, setNextVisit] = useState('');
  const [showAddMed, setShowAddMed] = useState(false);
  const [newMed, setNewMed] = useState({
    name: '',
    dosage: '',
    frequency: '',
    duration: '7天',
    notes: '',
  });

  const handleAddMedication = () => {
    if (newMed.name && newMed.dosage && newMed.frequency) {
      const medication: Medication = {
        id: Date.now().toString(),
        ...newMed,
      };
      setMedications([...medications, medication]);
      setNewMed({
        name: '',
        dosage: '',
        frequency: '',
        duration: '7天',
        notes: '',
      });
      setShowAddMed(false);
    }
  };

  const handleRemoveMedication = (id: string) => {
    setMedications(medications.filter(med => med.id !== id));
  };

  const handleQuickAdd = (commonMed: typeof commonMedications[0]) => {
    setNewMed({
      name: commonMed.name,
      dosage: commonMed.defaultDosage,
      frequency: commonMed.defaultFrequency,
      duration: '7天',
      notes: '',
    });
    setShowAddMed(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      medications,
      diagnosis,
      instructions,
      nextVisit,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-border p-6 flex items-center justify-between">
          <div>
            <h2 className="text-text-primary">開立建議成藥</h2>
            <p className="text-text-secondary">
              病患：{patient.name} · {patient.age}歲 · {patient.gender}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-text-secondary" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Diagnosis */}
          <div>
            <label className="block mb-2">診斷</label>
            <input
              type="text"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="例：偏頭痛"
              required
            />
          </div>

          {/* Medications */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center gap-2">
                <Pill className="w-5 h-5" />
                建議成藥
              </label>
              <button
                type="button"
                onClick={() => setShowAddMed(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-all"
              >
                <Plus className="w-4 h-4" />
                新增藥物
              </button>
            </div>

            {/* Common Medications Quick Add */}
            {!showAddMed && medications.length === 0 && (
              <div className="mb-4">
                <p className="text-text-secondary mb-2">常用建議成藥快速新增：</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {commonMedications.map((med, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleQuickAdd(med)}
                      className="px-3 py-2 border border-border rounded-lg hover:border-primary hover:bg-medical-blue transition-all text-left"
                    >
                      <div className="text-text-primary">{med.name}</div>
                      <div className="text-text-secondary text-sm">{med.defaultDosage}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Add Medication Form */}
            {showAddMed && (
              <div className="bg-medical-blue rounded-lg p-4 mb-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-sm">藥品名稱</label>
                    <input
                      type="text"
                      value={newMed.name}
                      onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="例：普拿疼"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm">劑量</label>
                    <input
                      type="text"
                      value={newMed.dosage}
                      onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="例：500mg"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm">頻率</label>
                    <input
                      type="text"
                      value={newMed.frequency}
                      onChange={(e) => setNewMed({ ...newMed, frequency: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="例：每日3次"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm">療程</label>
                    <input
                      type="text"
                      value={newMed.duration}
                      onChange={(e) => setNewMed({ ...newMed, duration: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="例：7天"
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-2 text-sm">備註</label>
                  <input
                    type="text"
                    value={newMed.notes}
                    onChange={(e) => setNewMed({ ...newMed, notes: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="例：飯後服用"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleAddMedication}
                    className="flex-1 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-all"
                  >
                    確認新增
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddMed(false)}
                    className="px-4 py-2 border border-border hover:bg-gray-50 rounded-lg transition-all"
                  >
                    取消
                  </button>
                </div>
              </div>
            )}

            {/* Medications List */}
            {medications.length > 0 && (
              <div className="space-y-3">
                {medications.map((med) => (
                  <div key={med.id} className="bg-white border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Pill className="w-4 h-4 text-primary" />
                          <span className="text-text-primary">{med.name}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-text-secondary">劑量：</span>
                            <span className="text-text-primary">{med.dosage}</span>
                          </div>
                          <div>
                            <span className="text-text-secondary">頻率：</span>
                            <span className="text-text-primary">{med.frequency}</span>
                          </div>
                          <div>
                            <span className="text-text-secondary">療程：</span>
                            <span className="text-text-primary">{med.duration}</span>
                          </div>
                          {med.notes && (
                            <div className="col-span-2">
                              <span className="text-text-secondary">備註：</span>
                              <span className="text-text-primary">{med.notes}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveMedication(med.id)}
                        className="p-2 text-danger hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {medications.length === 0 && !showAddMed && (
              <div className="text-center py-8 text-text-secondary">
                尚未新增任何藥物
              </div>
            )}
          </div>

          {/* Instructions */}
          <div>
            <label className="block mb-2">醫囑 / 注意事項</label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              rows={4}
              placeholder="例：請按時服藥，若症狀持續惡化請立即回診..."
            />
          </div>

          {/* Next Visit */}
          <div>
            <label className="block mb-2">下次回診日期</label>
            <input
              type="date"
              value={nextVisit}
              onChange={(e) => setNextVisit(e.target.value)}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-border hover:bg-gray-50 rounded-lg transition-all"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg transition-all shadow-md"
            >
              確認開立建議成藥
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
