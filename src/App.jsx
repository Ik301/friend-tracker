import { useState, useEffect } from 'react';
import { AppProvider } from './context/AppContext';
import Dashboard from './components/Dashboard';
import CategoryManager from './components/CategoryManager';
import NotificationPanel from './components/NotificationPanel';
import Settings from './components/Settings';
import Login from './components/Login';
import { getCurrentUserId, clearUserId } from './utils/localStorage';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [showNotifications, setShowNotifications] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserIdState] = useState(null);

  useEffect(() => {
    const storedUserId = getCurrentUserId();
    if (storedUserId) {
      setUserIdState(storedUserId);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (code) => {
    setUserIdState(code);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout? Your data will remain saved.')) {
      clearUserId();
      setIsLoggedIn(false);
      setUserIdState(null);
      setCurrentView('dashboard');
    }
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <AppProvider>
      <div className="min-h-screen bg-[#2d1810]">
        {/* Navigation */}
        <nav className="bg-[#3d241a] border-b border-[#774936]">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    currentView === 'dashboard'
                      ? 'bg-[#edc4b3] text-[#2d1810]'
                      : 'text-[#c38e70] hover:text-[#edc4b3] hover:bg-[#4a2f1f]'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setCurrentView('categories')}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    currentView === 'categories'
                      ? 'bg-[#edc4b3] text-[#2d1810]'
                      : 'text-[#c38e70] hover:text-[#edc4b3] hover:bg-[#4a2f1f]'
                  }`}
                >
                  Categories
                </button>
                <button
                  onClick={() => setCurrentView('settings')}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    currentView === 'settings'
                      ? 'bg-[#edc4b3] text-[#2d1810]'
                      : 'text-[#c38e70] hover:text-[#edc4b3] hover:bg-[#4a2f1f]'
                  }`}
                >
                  Settings
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#b07d62] text-sm">Code: {userId}</span>
                <button
                  onClick={handleLogout}
                  className="text-[#c38e70] hover:text-[#edc4b3] hover:bg-[#4a2f1f] px-3 py-2 rounded-lg transition-all text-sm"
                >
                  Logout
                </button>
                <button
                  onClick={() => setShowNotifications(true)}
                  className="relative p-2 text-[#c38e70] hover:text-[#edc4b3] hover:bg-[#4a2f1f] rounded-lg transition-all"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="py-6">
          {currentView === 'dashboard' && <Dashboard />}
          {currentView === 'categories' && <CategoryManager />}
          {currentView === 'settings' && <Settings />}
        </main>

        {/* Notification Panel */}
        {showNotifications && (
          <NotificationPanel
            isOpen={showNotifications}
            onClose={() => setShowNotifications(false)}
          />
        )}
      </div>
    </AppProvider>
  );
}

export default App;
