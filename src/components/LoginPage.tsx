import { useState } from 'react';
import { User, UserRole } from '../store/useAuthStore';
import { Activity } from 'lucide-react';
import { API_BASE_URL } from '../config';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Register form states
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerRole, setRegisterRole] = useState<UserRole>('patient');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      try {
        // 支援使用 Email 全名或傳統名稱進行大小寫不敏感登入
        const loginAccount = email.toLowerCase().trim();
        
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: loginAccount, password }),
        });
        
        if (response.ok) {
          const userData = await response.json();
          onLogin(userData);
        } else {
          alert('登入失敗，請檢查帳號或密碼是否正確！\n(預設測試帳號為 patient1 / 1234 或 doctor1 / 1234)');
        }
      } catch (err) {
        console.error(err);
        alert('無法連線到 Java 後端伺服器！請確認 Spring Boot 是否已啟動。');
      }
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registerName && registerEmail && registerPassword && registerRole) {
      try {
        // 註冊時，同時傳送使用者的真實姓名以及完整的 Email 地址
        const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: registerName.trim(),
            email: registerEmail.toLowerCase().trim(),
            password: registerPassword,
            role: registerRole,
          }),
        });

        if (response.ok) {
          const userData = await response.json();
          alert(`註冊成功！您的登入帳號為您的 Email：${registerEmail.toLowerCase().trim()}\n已自動為您登入系統。`);
          onLogin(userData);
        } else {
          const errorData = await response.json();
          alert(`註冊失敗：${errorData.message || '未知錯誤'}`);
        }
      } catch (err) {
        console.error(err);
        alert('無法連線到 Java 後端伺服器！請確認 Spring Boot 是否已啟動。');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4 shadow-lg">
            <Activity className="w-8 h-8 text-white" strokeWidth={2.5} />
          </div>
          <h2 className="text-primary mb-2">偏頭痛個案照護系統</h2>
          <p className="text-text-secondary">專業的頭痛管理與追蹤平台</p>
        </div>

        {/* Login/Register Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-border overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-border">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-4 transition-all ${
                activeTab === 'login'
                  ? 'text-primary border-b-2 border-primary bg-blue-50'
                  : 'text-text-secondary hover:bg-gray-50'
              }`}
            >
              登入
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-4 transition-all ${
                activeTab === 'register'
                  ? 'text-primary border-b-2 border-primary bg-blue-50'
                  : 'text-text-secondary hover:bg-gray-50'
              }`}
            >
              註冊
            </button>
          </div>

          {/* Login Form */}
          {activeTab === 'login' && (
            <div className="p-8">
              <div className="mb-6">
                <h3 className="text-text-primary mb-1">登入帳號</h3>
                <p className="text-text-secondary">使用您的帳號登入系統</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block mb-2 text-text-primary">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-gray-50"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 text-text-primary">密碼</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-gray-50"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-lg transition-all shadow-md hover:shadow-lg"
                >
                  登入
                </button>
              </form>
            </div>
          )}

          {/* Register Form */}
          {activeTab === 'register' && (
            <div className="p-8">
              <div className="mb-6">
                <h3 className="text-text-primary mb-1">註冊帳號</h3>
                <p className="text-text-secondary">建立新帳號以使用系統</p>
              </div>

              <form onSubmit={handleRegister} className="space-y-5">
                <div>
                  <label className="block mb-2 text-text-primary">姓名</label>
                  <input
                    type="text"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-gray-50"
                    placeholder="你的姓名"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 text-text-primary">Email</label>
                  <input
                    type="email"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-gray-50"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 text-text-primary">密碼</label>
                  <input
                    type="password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-gray-50"
                    placeholder="至少 6 個字元"
                    minLength={6}
                    required
                  />
                  <p className="text-text-secondary mt-2">密碼需至少須包含大小寫字母和數字</p>
                </div>

                <div>
                  <label className="block mb-2 text-text-primary">角色</label>
                  <select
                    value={registerRole || ''}
                    onChange={(e) => setRegisterRole(e.target.value as UserRole)}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-gray-50 cursor-pointer"
                    required
                  >
                    <option value="patient">病人</option>
                    <option value="doctor">醫師</option>
                    <option value="caseManager">個案管理師</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-lg transition-all shadow-md hover:shadow-lg"
                >
                  註冊
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}