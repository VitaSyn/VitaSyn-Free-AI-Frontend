import React, { useEffect, useRef, useState } from 'react';
import { SignInButton, useAuth as useClerkAuth, useUser } from '@clerk/react';
import { Eye, EyeOff, LogIn, Sparkles, ExternalLink, KeyRound, Smartphone, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useThemeLanguage } from '../../context/ThemeLanguageContext';
import { useAuth } from '../../context/AuthContext';
import { BrandLogo } from '../common/BrandLogo';

type AuthMode = 'login' | 'register' | 'forgot';
type ForgotStep = 1 | 2 | 3 | 4;

export const AuthPage: React.FC = () => {
  const { t, apiUrl, theme, toggleTheme, language, toggleLanguage } = useThemeLanguage();
  const { login } = useAuth();
  const { getToken } = useClerkAuth();
  const { isSignedIn, user: clerkUser } = useUser();
  const isClerkConfigured = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);

  const [mode, setMode] = useState<AuthMode>('login');
  const [forgotStep, setForgotStep] = useState<ForgotStep>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Login form
  const [loginInput, setLoginInput] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [resendSeconds, setResendSeconds] = useState(0);
  const clerkSyncing = useRef(false);
  const syncedClerkUser = useRef('');

  // Register form
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regAge, setRegAge] = useState('');
  const [regSex, setRegSex] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');

  // Forgot password form
  const [forgotEmail, setForgotEmail] = useState('');
  const [phoneFirst6, setPhoneFirst6] = useState('');
  const [last4Digits, setLast4Digits] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  useEffect(() => {
    if (resendSeconds <= 0) return;
    const timer = window.setTimeout(() => setResendSeconds((seconds) => Math.max(0, seconds - 1)), 1000);
    return () => window.clearTimeout(timer);
  }, [resendSeconds]);

  useEffect(() => {
    if (!isSignedIn || !clerkUser || clerkSyncing.current || syncedClerkUser.current === clerkUser.id) return;

    let cancelled = false;
    clerkSyncing.current = true;
    const exchangeClerkSession = async () => {
      try {
        const sessionToken = await getToken();
        if (!sessionToken) throw new Error(t.googleSignInFailed);
        const response = await fetch(`${apiUrl}/api/auth/google/session`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionToken }),
        });
        const data = await response.json();
        if (!response.ok || !data.success) throw new Error(data.message || t.googleSignInFailed);
        if (!cancelled) {
          syncedClerkUser.current = clerkUser.id;
          login(data.user, data.token);
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : t.googleSignInFailed);
      } finally {
        clerkSyncing.current = false;
      }
    };

    void exchangeClerkSession();
    return () => { cancelled = true; };
  }, [apiUrl, clerkUser, getToken, isSignedIn, login, t.googleSignInFailed]);

  // Switch modes
  const changeMode = (m: AuthMode) => {
    setMode(m);
    setError('');
    setSuccess('');
    setForgotStep(1);
    setForgotEmail('');
    setLast4Digits('');
    setOtp('');
    setNewPassword('');
    setConfirmNewPassword('');
  };

  // 1. Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const phone = loginInput.trim().replace(/[\s().-]/g, '');
    if (!/^\+[1-9]\d{7,14}$/.test(phone)) {
      setError(t.invalidPhone);
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`${apiUrl}/api/auth/phone/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || t.invalidPhone);
        return;
      }
      setLoginInput(phone);
      setOtp('');
      setOtpSent(true);
      setResendSeconds(30);
      setSuccess(t.otpSent);
    } catch {
      setError(language === 'ta' ? 'சேவையகத்துடன் இணைப்பு தோல்வியடைந்தது.' : 'Failed to connect to server. Check backend.');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const phone = loginInput.trim().replace(/[\s().-]/g, '');
    if (!/^\+[1-9]\d{7,14}$/.test(phone) || !/^\d{6}$/.test(otp.trim())) {
      setError(t.invalidOtp);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${apiUrl}/api/auth/phone/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code: otp.trim() }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        login(data.user, data.token);
      } else {
        setError(data.message || t.invalidOtp);
      }
    } catch {
      setError(language === 'ta' ? 'சேவையகத்துடன் இணைப்பு தோல்வியடைந்தது.' : 'Failed to connect to server. Check backend.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle Register
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPhone || !regAge || !regSex || !regPassword || !regConfirm) {
      setError(t.fillAllFields);
      return;
    }
    if (regPassword !== regConfirm) {
      setError(t.passwordMismatch);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${apiUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regName.trim(),
          email: regEmail.trim().toLowerCase(),
          phone: regPhone.trim(),
          age: Number(regAge),
          sex: regSex,
          password: regPassword,
          confirmPassword: regConfirm,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(t.registrationSuccess);
        setMode('login');
        setRegName(''); setRegEmail(''); setRegPhone('');
        setRegAge(''); setRegSex(''); setRegPassword(''); setRegConfirm('');
      } else {
        if (data.code === 'EMAIL_EXISTS') {
          setError(t.userAlreadyExistsTryLogin);
        } else {
          setError(data.message || t.fillAllFields);
        }
      }
    } catch {
      setError(language === 'ta' ? 'சேவையகத்துடன் இணைப்பு தோல்வியடைந்தது.' : 'Failed to connect to server.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Handle Forgot Password - Step 1: Verify Email
  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      setError(t.fillAllFields);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${apiUrl}/api/auth/forgot-password/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail.trim().toLowerCase() }),
      });
      const data = await res.json();
      if (data.success) {
        setPhoneFirst6(data.phoneFirst6);
        setForgotStep(2);
      } else {
        setError(t.userEmailNotFound);
      }
    } catch {
      setError(language === 'ta' ? 'சேவையகத்துடன் இணைப்பு தோல்வியடைந்தது.' : 'Failed to connect to server.');
    } finally {
      setLoading(false);
    }
  };

  // 4. Handle Forgot Password - Step 2: Verify Phone (Last 4 Digits) & Send 5-Minute OTP
  const handleVerifyPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!last4Digits.trim() || last4Digits.trim().length !== 4) {
      setError(language === 'ta' ? '4-இலக்க எண்ணை சரியாக உள்ளிடவும்.' : 'Please enter 4 digits.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${apiUrl}/api/auth/forgot-password/verify-phone`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail.trim().toLowerCase(), last4Digits: last4Digits.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(language === 'ta' ? '6-இலக்க OTP உங்கள் மின்னஞ்சலுக்கு அனுப்பப்பட்டது (5 நிமிடங்களுக்கு செல்லுபடியாகும்).' : '6-digit OTP sent to your registered email (valid for 5 minutes).');
        setForgotStep(3);
      } else {
        setError(t.invalidMobile);
      }
    } catch {
      setError(language === 'ta' ? 'சேவையகத்துடன் இணைப்பு தோல்வியடைந்தது.' : 'Failed to connect to server.');
    } finally {
      setLoading(false);
    }
  };

  // 5. Handle Forgot Password - Step 3: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim() || otp.trim().length !== 6) {
      setError(language === 'ta' ? '6-இலக்க OTP-ஐ உள்ளிடவும்.' : 'Please enter the 6-digit OTP.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${apiUrl}/api/auth/forgot-password/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail.trim().toLowerCase(), otp: otp.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setError('');
        setSuccess(language === 'ta' ? 'OTP சரிபார்க்கப்பட்டது. புதிய கடவுச்சொல்லை உள்ளிடவும்.' : 'OTP verified! Enter your new password.');
        setForgotStep(4);
      } else {
        setError(t.invalidOtp);
      }
    } catch {
      setError(language === 'ta' ? 'சேவையகத்துடன் இணைப்பு தோல்வியடைந்தது.' : 'Failed to connect to server.');
    } finally {
      setLoading(false);
    }
  };

  // 6. Handle Forgot Password - Step 4: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !confirmNewPassword) {
      setError(t.fillAllFields);
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError(t.passwordMismatch);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${apiUrl}/api/auth/forgot-password/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: forgotEmail.trim().toLowerCase(),
          otp: otp.trim(),
          newPassword,
          confirmPassword: confirmNewPassword,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(t.passwordUpdatedSuccess);
        setTimeout(() => {
          changeMode('login');
        }, 1800);
      } else {
        setError(data.message || t.invalidOtp);
      }
    } catch {
      setError(language === 'ta' ? 'சேவையகத்துடன் இணைப்பு தோல்வியடைந்தது.' : 'Failed to connect to server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[100dvh] flex flex-col overflow-hidden bg-[#fafafa] dark:bg-[#0b0f0b] text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
      {/* Top Bar */}
      <div className="page-fit-band flex items-center justify-between px-4 sm:px-6 py-2.5 border-b border-zinc-200 dark:border-[#1e2a1e]">
        <BrandLogo size="md" />
        <div className="flex items-center gap-2">
          <button
            onClick={toggleLanguage}
            className="text-xs font-bold px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:border-amber-400/50 transition-colors"
          >
            {language === 'en' ? 'தமிழ்' : 'EN'}
          </button>
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:border-amber-400/50 transition-colors text-xs"
          >
            {theme === 'dark' ? '☀' : '🌙'}
          </button>
        </div>
      </div>

      {/* Main Container — the form scrolls internally so the top bar stays put */}
      <div className="flex-1 min-h-0 flex items-start sm:items-center justify-center p-3 sm:p-4 overflow-y-auto">
        <div className="w-full max-w-md my-auto">
          {/* Header Title */}
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-600 dark:text-amber-300 text-[11px] font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.freeAiTag}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-50 leading-tight">
              {mode === 'login' ? t.loginTitle : mode === 'register' ? t.registerTitle : t.forgotTitle}
            </h1>
            <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-1">
              {mode === 'login' ? t.loginSubtitle : mode === 'register' ? t.registerSubtitle : t.forgotSubtitle}
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white dark:bg-[#121812] border border-zinc-200 dark:border-[#273526] rounded-2xl p-4 sm:p-5 shadow-sm">
            {/* Status alerts */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-medium">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 rounded-xl bg-lime-500/10 border border-lime-500/20 text-lime-700 dark:text-lime-400 text-xs font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{success}</span>
              </div>
            )}

            {/* Phone number sign-in */}
            {mode === 'login' && (
              <div className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                      {t.phoneNumberLabel}
                    </label>
                    <input
                      type="tel"
                      autoComplete="tel"
                      value={loginInput}
                      onChange={(e) => {
                        setLoginInput(e.target.value);
                        setOtpSent(false);
                        setOtp('');
                        setSuccess('');
                      }}
                      placeholder={t.phoneNumberPlaceholder}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/70 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 text-sm focus:outline-hidden focus:border-amber-500 transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading || (otpSent && resendSeconds > 0)}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-lime-600 hover:from-amber-400 hover:to-lime-500 text-zinc-950 font-bold text-sm shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                  >
                    {loading ? <span className="animate-spin">⏳</span> : <Smartphone className="w-4 h-4" />}
                    <span>{otpSent && resendSeconds > 0 ? `${t.resendIn} ${resendSeconds}s` : otpSent ? t.resendOtp : t.sendOtp}</span>
                  </button>
                </form>

                {otpSent && (
                  <form onSubmit={handlePhoneVerify} className="space-y-3 border-t border-zinc-200 dark:border-zinc-800 pt-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5" htmlFor="phone-otp">
                        {t.enterOtpLabel}
                      </label>
                      <input
                        id="phone-otp"
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder={t.otpPlaceholder}
                        maxLength={6}
                        className="w-full px-3.5 py-2.5 text-center text-lg font-bold font-mono tracking-widest rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/70 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-hidden focus:border-amber-500 transition-colors"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading || otp.length !== 6}
                      className="w-full py-3 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 font-bold text-sm transition-colors disabled:opacity-50"
                    >
                      {loading ? '...' : <><LogIn className="inline w-4 h-4 mr-2" />{t.verifyOtp}</>}
                    </button>
                  </form>
                )}

                <div className="flex items-center gap-3 text-[10px] font-semibold text-zinc-400">
                  <span className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
                  <span>{t.or}</span>
                  <span className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
                </div>

                {isClerkConfigured ? (
                  <SignInButton mode="modal">
                    <button
                      type="button"
                      className="w-full py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-100 font-semibold text-sm transition-colors flex items-center justify-center gap-3"
                    >
                      <span aria-hidden="true" className="font-bold text-base">G</span>
                      {t.signInWithGoogle}
                    </button>
                  </SignInButton>
                ) : (
                  <button
                    type="button"
                    disabled
                    title={t.googleSignInUnavailable}
                    className="w-full py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-500 font-semibold text-sm flex items-center justify-center gap-3 opacity-60 cursor-not-allowed"
                  >
                    <span aria-hidden="true" className="font-bold text-base">G</span>
                    {t.googleSignInUnavailable}
                  </button>
                )}
              </div>
            )}

            {/* 2. REGISTER FORM */}
            {mode === 'register' && (
              <form onSubmit={handleRegister} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    {t.nameLabel}
                  </label>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder={t.namePlaceholder}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/70 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 text-sm focus:outline-hidden focus:border-amber-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    {t.emailLabel}
                  </label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder={t.emailPlaceholder}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/70 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 text-sm focus:outline-hidden focus:border-amber-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    {t.phoneLabel}
                  </label>
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder={t.phonePlaceholder}
                    maxLength={15}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/70 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 text-sm focus:outline-hidden focus:border-amber-500 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      {t.ageLabel}
                    </label>
                    <input
                      type="number"
                      value={regAge}
                      onChange={(e) => setRegAge(e.target.value)}
                      placeholder={t.agePlaceholder}
                      min={1}
                      max={120}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/70 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 text-sm focus:outline-hidden focus:border-amber-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      {t.sexLabel}
                    </label>
                    <select
                      value={regSex}
                      onChange={(e) => setRegSex(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/70 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-hidden focus:border-amber-500 transition-colors"
                    >
                      <option value="">—</option>
                      <option value="male">{t.sexMale}</option>
                      <option value="female">{t.sexFemale}</option>
                      <option value="other">{t.sexOther}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    {t.passwordLabel}
                  </label>
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder={t.passwordPlaceholder}
                      className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/70 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 text-sm focus:outline-hidden focus:border-amber-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((v) => !v)}
                      className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                    >
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    {t.confirmPasswordLabel}
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={regConfirm}
                      onChange={(e) => setRegConfirm(e.target.value)}
                      placeholder={t.confirmPasswordPlaceholder}
                      className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/70 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 text-sm focus:outline-hidden focus:border-amber-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-lime-600 hover:from-amber-400 hover:to-lime-500 text-zinc-950 font-bold text-sm shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                >
                  {loading ? <span className="animate-spin">⏳</span> : <Sparkles className="w-4 h-4" />}
                  <span>{t.registerBtn}</span>
                </button>

                <p className="text-center text-xs text-zinc-600 dark:text-zinc-400 pt-2">
                  <button
                    type="button"
                    onClick={() => changeMode('login')}
                    className="text-amber-600 dark:text-amber-400 hover:underline font-semibold"
                  >
                    {t.goToLogin}
                  </button>
                </p>
              </form>
            )}

            {/* 3. FORGOT PASSWORD (4-STEP VERIFICATION FLOW) */}
            {mode === 'forgot' && (
              <div className="space-y-4">
                {/* Step indicators */}
                <div className="flex items-center justify-center gap-2 mb-3">
                  {[1, 2, 3, 4].map((s) => (
                    <div
                      key={s}
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${forgotStep === s
                          ? 'bg-amber-500 text-zinc-950 ring-2 ring-amber-400/40'
                          : forgotStep > s
                            ? 'bg-lime-500 text-zinc-950'
                            : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500'
                        }`}
                    >
                      {forgotStep > s ? '✓' : s}
                    </div>
                  ))}
                </div>

                {/* STEP 1: Enter Email ID */}
                {forgotStep === 1 && (
                  <form onSubmit={handleVerifyEmail} className="space-y-4">
                    <div className="text-xs text-zinc-700 dark:text-zinc-300 font-medium">
                      {t.forgotStep1Title}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                        {t.emailLabel}
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          placeholder={t.emailPlaceholder}
                          className="w-full px-3.5 py-2.5 pl-9 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/70 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 text-sm focus:outline-hidden focus:border-amber-500 transition-colors"
                        />
                        <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-lime-600 hover:from-amber-400 hover:to-lime-500 text-zinc-950 font-bold text-sm shadow-md transition-all cursor-pointer disabled:opacity-60"
                    >
                      {loading ? '...' : language === 'ta' ? 'மின்னஞ்சலை சரிபார்க்கவும்' : 'Verify Email'}
                    </button>
                  </form>
                )}

                {/* STEP 2: Display first 6 digits & ask for last 4 digits */}
                {forgotStep === 2 && (
                  <form onSubmit={handleVerifyPhone} className="space-y-4">
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
                      <div className="text-zinc-600 dark:text-zinc-400 font-medium">
                        {t.phoneFirst6Msg}
                      </div>
                      <div className="text-base font-bold text-amber-600 dark:text-amber-400 font-mono tracking-widest mt-0.5">
                        {phoneFirst6}****
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                        {t.phoneLast4Label}
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={last4Digits}
                          onChange={(e) => setLast4Digits(e.target.value.replace(/\D/g, '').slice(0, 4))}
                          placeholder={t.phoneLast4Placeholder}
                          maxLength={4}
                          className="w-full px-3.5 py-2.5 pl-9 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/70 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 text-sm font-mono tracking-wider focus:outline-hidden focus:border-amber-500 transition-colors"
                        />
                        <Smartphone className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-lime-600 hover:from-amber-400 hover:to-lime-500 text-zinc-950 font-bold text-sm shadow-md transition-all cursor-pointer disabled:opacity-60"
                    >
                      {loading ? '...' : t.verifyPhoneBtn}
                    </button>
                  </form>
                )}

                {/* STEP 3: Enter 6-digit OTP received via email */}
                {forgotStep === 3 && (
                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                        {t.enterOtpLabel}
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          placeholder={t.otpPlaceholder}
                          maxLength={6}
                          className="w-full px-3.5 py-2.5 pl-9 text-center text-lg font-bold font-mono tracking-widest rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/70 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-hidden focus:border-amber-500 transition-colors"
                        />
                        <KeyRound className="w-4 h-4 text-zinc-400 absolute left-3 top-3.5" />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-lime-600 hover:from-amber-400 hover:to-lime-500 text-zinc-950 font-bold text-sm shadow-md transition-all cursor-pointer disabled:opacity-60"
                    >
                      {loading ? '...' : t.verifyOtpBtn}
                    </button>
                  </form>
                )}

                {/* STEP 4: Set New Password & Confirm Password */}
                {forgotStep === 4 && (
                  <form onSubmit={handleResetPassword} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                        {t.newPasswordLabel}
                      </label>
                      <div className="relative">
                        <input
                          type={showPass ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder={t.newPasswordPlaceholder}
                          className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/70 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 text-sm focus:outline-hidden focus:border-amber-500 transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPass((v) => !v)}
                          className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                        >
                          {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                        {t.confirmNewPasswordLabel}
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirm ? 'text' : 'password'}
                          value={confirmNewPassword}
                          onChange={(e) => setConfirmNewPassword(e.target.value)}
                          placeholder={t.confirmNewPasswordPlaceholder}
                          className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/70 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 text-sm focus:outline-hidden focus:border-amber-500 transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm((v) => !v)}
                          className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                        >
                          {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-lime-600 hover:from-amber-400 hover:to-lime-500 text-zinc-950 font-bold text-sm shadow-md transition-all cursor-pointer disabled:opacity-60"
                    >
                      {loading ? '...' : t.resetPasswordBtn}
                    </button>
                  </form>
                )}

                {/* Back to login button */}
                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => changeMode('login')}
                    className="text-xs text-zinc-600 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400 inline-flex items-center gap-1 font-semibold"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>{t.backToLogin}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Company footer */}
          <div className="mt-4 text-center text-xs text-zinc-500 dark:text-zinc-500">
            <a
              href="https://vitasyn.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
            >
              <span>{t.companyName}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
