import { User } from '../App';
import { Activity, LogOut, Info, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  onNavigate: (page: 'dashboard' | 'about') => void;
}

export function Header({ user, onLogout, onNavigate }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'patient':
        return '病人';
      case 'doctor':
        return '醫師';
      case 'caseManager':
        return '個案管理師';
      default:
        return '';
    }
  };

  return (
    <header className="bg-white border-b border-border shadow-sm sticky top-0 z-50">
      <div className="max-w-full mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('dashboard')}>
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h3 className="text-primary">偏頭痛照護系統</h3>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => onNavigate('about')}
              className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors"
            >
              <Info className="w-5 h-5" />
              關於系統
            </button>

            <div className="flex items-center gap-3 px-4 py-2 bg-medical-blue rounded-lg">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="text-left">
                <div className="text-text-primary">{user.name}</div>
                <div className="text-text-secondary">{getRoleLabel(user.role || '')}</div>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 text-danger hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              登出
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-text-secondary hover:text-primary"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 px-4 py-2 bg-medical-blue rounded-lg">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-text-primary">{user.name}</div>
                  <div className="text-text-secondary">{getRoleLabel(user.role || '')}</div>
                </div>
              </div>

              <button
                onClick={() => {
                  onNavigate('about');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 px-4 py-2 text-text-secondary hover:text-primary transition-colors"
              >
                <Info className="w-5 h-5" />
                關於系統
              </button>

              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 text-danger hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                登出
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}