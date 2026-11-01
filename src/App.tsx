import React, { useState, useEffect } from 'react';
import { AuthenticateWithRedirectCallback } from '@clerk/react';
import { ThemeLanguageProvider, useThemeLanguage } from './context/ThemeLanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { WelcomeView } from './components/welcome/WelcomeView';
import { HairAssessment } from './components/hair/HairAssessment';
import { EyeAssessment } from './components/eye/EyeAssessment';
import { HistoryModal } from './components/history/HistoryModal';
import { AuthPage } from './components/auth/AuthPage';

const ProfileCompletionModal: React.FC<{ token: string }> = ({ token }) => {
  const { apiUrl, language } = useThemeLanguage();
  const { login } = useAuth();
  const copy = language === 'ta'
    ? {
      title: 'உங்கள் சுயவிவரத்தை முடிக்கவும்',
      description: 'டாஷ்போர்டைத் தொடர உங்கள் பெயர் மற்றும் வயதைச் சேர்க்கவும்.',
      name: 'பெயர்',
      age: 'வயது',
      submit: 'சமர்ப்பிக்கவும்',
      saving: 'சேமிக்கப்படுகிறது...',
      invalid: 'உங்கள் பெயரையும் 1 முதல் 120 வரையிலான சரியான வயதையும் உள்ளிடவும்.',
      failed: 'சுயவிவரத்தைச் சேமிக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.',
    }
    : {
      title: 'Complete your profile',
      description: 'Add your name and age to continue to your dashboard.',
      name: 'Name',
      age: 'Age',
      submit: 'Submit',
      saving: 'Saving...',
      invalid: 'Enter your name and a valid age from 1 to 120.',
      failed: 'Could not save your profile. Please try again.',
    };
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const parsedAge = Number(age);
  const isProfileValid = Boolean(
    name.trim() &&
    Number.isInteger(parsedAge) &&
    parsedAge >= 1 &&
    parsedAge <= 120
  );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isProfileValid) {
      setError(copy.invalid);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${apiUrl}/api/auth/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: name.trim(), age: parsedAge }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || copy.failed);
      }
      login(data.user, data.token);
    } catch (err) {
      setError(err instanceof Error ? err.message : copy.failed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-completion-title"
        className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-[#273526] dark:bg-[#121812]"
      >
        <h2 id="profile-completion-title" className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
          {copy.title}
        </h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          {copy.description}
        </p>
        {error && (
          <div role="alert" className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label htmlFor="profile-name" className="mb-1.5 block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              {copy.name}
            </label>
            <input
              id="profile-name"
              type="text"
              autoComplete="name"
              maxLength={80}
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-3 text-zinc-900 outline-none transition-colors focus:border-amber-500 dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-100"
            />
          </div>
          <div>
            <label htmlFor="profile-age" className="mb-1.5 block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              {copy.age}
            </label>
            <input
              id="profile-age"
              type="number"
              min={1}
              max={120}
              step={1}
              required
              value={age}
              onChange={(event) => setAge(event.target.value)}
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-3 text-zinc-900 outline-none transition-colors focus:border-amber-500 dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-100"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !isProfileValid}
            className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-lime-600 py-3 text-sm font-bold text-zinc-950 shadow-md shadow-amber-500/20 transition-all disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? copy.saving : copy.submit}
          </button>
        </form>
      </section>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { isAuthenticated, user, token } = useAuth();
  const [currentTab, setCurrentTab] = useState<'welcome' | 'hair' | 'eye' | 'history'>('welcome');
  // Auto-collapse sidebar on mobile and tablet screens (< 1024px)
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return false;
  });

  // Handle responsive resize (e.g. tablet orientation change)
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (window.innerWidth < 1024) {
          setIsSidebarOpen(false);
        }
      }, 150);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  if (window.location.pathname === '/sso-callback') {
    return <AuthenticateWithRedirectCallback />;
  }

  // Show auth page if not logged in
  if (!isAuthenticated) {
    return <AuthPage />;
  }

  if (user?.profileComplete === false && token) {
    return (
      <div className="flex h-[100dvh] w-screen items-center justify-center overflow-hidden bg-[#fafafa] dark:bg-[#0b0f0b]">
        <ProfileCompletionModal token={token} />
      </div>
    );
  }

  return (
    <div className="flex h-[100dvh] w-screen overflow-hidden bg-[#fafafa] dark:bg-[#0b0f0b] text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
      {/* ChatGPT-style Collapsible Sidebar */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        onNewAssessment={() => setCurrentTab('welcome')}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Top Header */}
        <Header
          currentTab={currentTab}
          onOpenMobileSidebar={() => setIsSidebarOpen(true)}
          onResetToWelcome={() => setCurrentTab('welcome')}
        />

        {/* Dynamic Workspace — definite height so pages can fit the first screen */}
        <main className="flex-1 min-h-0 overflow-hidden p-2 sm:p-3 md:p-4">
          {currentTab === 'welcome' && (
            <WelcomeView
              onStartHair={() => setCurrentTab('hair')}
              onStartEye={() => setCurrentTab('eye')}
            />
          )}
          {currentTab === 'hair' && <HairAssessment />}
          {currentTab === 'eye' && <EyeAssessment />}
          {currentTab === 'history' && <HistoryModal />}
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeLanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeLanguageProvider>
  );
};

export default App;
