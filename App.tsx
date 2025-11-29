import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import { getUser } from './services/storage';
import { UserSettings } from './types';

// Pages
import Onboarding from './components/Onboarding';
import Setup from './components/Setup';
import HomePage from './components/HomePage';
import CalendarPage from './components/CalendarPage';
import StatsPage from './components/StatsPage';
import EducationPage from './components/EducationPage';
import ProfilePage from './components/ProfilePage';
import DailyLogPage from './components/DailyLogPage';
import ChatBot from './components/ChatBot';

const App: React.FC = () => {
  const [user, setUser] = useState<UserSettings | null>(null);
  const [currentView, setCurrentView] = useState<string>('loading');
  const [showLogForDate, setShowLogForDate] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const loadedUser = getUser();
    if (loadedUser) {
      setUser(loadedUser);
      setCurrentView('home');
    } else {
      setCurrentView('onboarding');
    }
  }, []);

  const handleUserUpdate = (newUser: UserSettings) => {
    setUser(newUser);
    setCurrentView('home');
  };

  const navigateTo = (view: string) => {
    setCurrentView(view);
    setShowLogForDate(null); // Reset detail view
  };

  if (currentView === 'loading') return <div className="h-screen flex items-center justify-center bg-rose-50 text-rose-500">Cargando...</div>;
  if (currentView === 'onboarding') return <Onboarding onComplete={() => setCurrentView('setup')} />;
  if (currentView === 'setup') return <Setup onComplete={handleUserUpdate} />;

  // Main App Flow
  const renderContent = () => {
    if (showLogForDate) {
      return (
        <DailyLogPage 
          date={showLogForDate} 
          onClose={() => setShowLogForDate(null)} 
          onSave={() => setShowLogForDate(null)}
        />
      );
    }

    switch (currentView) {
      case 'home':
        return (
          <HomePage 
            user={user!} 
            onLogToday={() => setShowLogForDate(new Date().toISOString().split('T')[0])} 
            onNavigate={navigateTo}
            onOpenChat={() => setShowChat(true)}
          />
        );
      case 'calendar':
        return <CalendarPage user={user!} onDateSelect={setShowLogForDate} />;
      case 'stats':
        return <StatsPage user={user!} />;
      case 'education':
        return <EducationPage />;
      case 'profile':
        return <ProfilePage user={user!} onLogout={() => {
             setUser(null);
             setCurrentView('onboarding');
        }} onUpdateUser={setUser} />;
      default:
        return <HomePage user={user!} onLogToday={() => {}} onNavigate={navigateTo} onOpenChat={() => setShowChat(true)} />;
    }
  };

  return (
    <>
      <Layout activeTab={currentView} onTabChange={navigateTo}>
        {renderContent()}
      </Layout>
      {showChat && <ChatBot onClose={() => setShowChat(false)} user={user} />}
    </>
  );
};

export default App;