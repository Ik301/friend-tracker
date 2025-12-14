import { useState } from 'react';
import { AppProvider } from './context/AppContext';
import Dashboard from './components/Dashboard';
import CategoryManager from './components/CategoryManager';
import NotificationPanel from './components/NotificationPanel';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <AppProvider>
      <div className="min-h-screen bg-[#0a0a0a]">
        {/* Navigation */}
        <nav className="bg-[#111111] border-b border-[#222222]">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    currentView === 'dashboard'
                      ? 'bg-white text-black'
                      : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setCurrentView('categories')}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    currentView === 'categories'
                      ? 'bg-white text-black'
                      : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
                  }`}
                >
                  Categories
                </button>
              </div>
              <button
                onClick={() => setShowNotifications(true)}
                className="relative p-2 text-gray-400 hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-all"
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
        </nav>

        {/* Main Content */}
        <main className="py-6">
          {currentView === 'dashboard' && <Dashboard />}
          {currentView === 'categories' && <CategoryManager />}
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
