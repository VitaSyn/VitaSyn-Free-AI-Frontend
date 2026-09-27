export type Language = 'en' | 'ta';

export interface Translations {
  appName: string;
  freeAiTag: string;
  companyName: string;
  officialWebsite: string;
  dashboard: string;
  navHair: string;
  navEye: string;
  navHistory: string;
  navLogout: string;
  lightMode: string;
  darkMode: string;
  languageName: string;

  // Auth
  loginTitle: string;
  loginSubtitle: string;
  phoneNumberLabel: string;
  phoneNumberPlaceholder: string;
  sendOtp: string;
  sendingOtp: string;
  verifyOtp: string;
  resendOtp: string;
  resendIn: string;
  otpSent: string;
  signInWithGoogle: string;
  googleSignInUnavailable: string;
  or: string;
  invalidPhone: string;
  googleSignInFailed: string;
  registerTitle: string;
  registerSubtitle: string;
  nameLabel: string;
  namePlaceholder: string;
  emailOrPhoneLabel: string;
  emailOrPhonePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  ageLabel: string;
  agePlaceholder: string;
  sexLabel: string;
  sexMale: string;
  sexFemale: string;
  sexOther: string;
  passwordLabel: string;
  loginPasswordPlaceholder: string;
  passwordPlaceholder: string;
  confirmPasswordLabel: string;
  confirmPasswordPlaceholder: string;
  loginBtn: string;
  registerBtn: string;
  forgotPassword: string;
  goToRegister: string;
  goToLogin: string;
  forgotTitle: string;
  forgotSubtitle: string;
  backToLogin: string;
  userNotFound: string;
  invalidCredential: string;
  emailAlreadyExists: string;
  passwordMismatch: string;
  fillAllFields: string;
  registrationSuccess: string;
  loggedInAs: string;

  // Forgot password multi-step
  forgotStep1Title: string;
  phoneFirst6Msg: string;
  phoneLast4Label: string;
  phoneLast4Placeholder: string;
  verifyPhoneBtn: string;
  enterOtpLabel: string;
  otpPlaceholder: string;
  verifyOtpBtn: string;
  newPasswordLabel: string;
  newPasswordPlaceholder: string;
  confirmNewPasswordLabel: string;
  confirmNewPasswordPlaceholder: string;
  resetPasswordBtn: string;
  passwordUpdatedSuccess: string;
  invalidMobile: string;
  invalidOtp: string;
  userEmailNotFound: string;
  userAlreadyExistsTryLogin: string;

  // Welcome Screen
  welcomeTitle: string;
  welcomeSubtitle: string;
  hairCardTitle: string;
  hairCardDesc: string;
  eyeCardTitle: string;
  eyeCardDesc: string;
  startBtn: string;

  // Hair Assessment
  hairTitle: string;
  hairSubtitle: string;
  uploadTitle: string;
  uploadDesc: string;
  choosePhoto: string;
  photoDescriptionLabel: string;
  photoDescriptionPlaceholder: string;
  verifyImageBtn: string;
  verifyingImage: string;
  hairVerifiedTitle: string;
  hairNotDetectedTitle: string;
  hairNotDetectedDesc: string;
  reuploadBtn: string;
  continueToQuestions: string;
  tapToChangePhoto: string;
  selectedPhotoLabel: string;
  hairStep2Title: string;
  hairStep2Desc: string;
  hairAiBanner: string;
  hairReportEval: string;
  hairClinicalConsult: string;

  // Hair Questions
  qDrynessTitle: string;
  qDrynessDry: string;
  qDrynessNormal: string;
  qDrynessOily: string;

  qGrowthTitle: string;
  qGrowthFast: string;
  qGrowthMedium: string;
  qGrowthSlow: string;

  qItchingTitle: string;
  qDandruffTitle: string;
  qLiceTitle: string;

  yes: string;
  no: string;
  submitHairAnalysis: string;
  generatingAiReport: string;

  // Eye Assessment
  eyeTitle: string;
  eyeSubtitle: string;
  eyeBanner: string;
  phase1Title: string;
  phase1Desc: string;
  stage: string;
  of: string;
  colorScoreLabel: string;
  tapDifferentTile: string;
  correctTileSelected: string;

  phase2Title: string;
  phase2Desc: string;
  distanceTip: string;
  sentenceLevel: string;
  canYouReadPrompt: string;
  canReadBtn: string;
  cannotReadBtn: string;

  phase3Title: string;
  eyePhase3Desc: string;
  dryEyesPrompt: string;
  havePowerPrompt: string;
  powerTypePrompt: string;
  powerPositive: string;
  powerNegative: string;
  submitEyeAnalysis: string;
  eyeColorRating: string;
  eyeAcuityTier: string;
  eyeClinicalConsult: string;
  eyeReportEval: string;
  colorDiscriminationLabel: string;
  readingAcuityLabel: string;

  // Sentences for Acuity
  sentVeryBig: string;
  sentBig: string;
  sentMedium: string;
  sentSmall: string;
  sentVerySmall: string;

  // Reports
  reportTitle: string;
  overallScore: string;
  conditionBadge: string;
  keyFindings: string;
  recommendedDos: string;
  thingsToAvoid: string;
  expertRecommendations: string;
  lifestyleTip: string;
  medicalDisclaimer: string;
  printReport: string;
  retakeTest: string;
  close: string;
  historyTitle: string;
  noHistory: string;
  historyDbSubtitle: string;
  scoreLabel: string;
  viewLabel: string;
  allFilter: string;

  // Skip & Back controls
  skipToReading: string;
  backToUpload: string;
  backToReadingTest: string;
  aiConsulting: string;
  aiAnalyzing: string;

  // Pre-Test Instructions
  preTestTitle: string;
  preTestSubtitle: string;
  preTestInstructions: string[];
  preTestStartBtn: string;
  preTestSkipBtn: string;

  // Color Test Timer
  colorTimerLabel: string;
  colorStageComplete: string;

  // Reading Test - Eye Selection
  readingEyeSelectionTitle: string;
  readingEyeSelectionDesc: string;
  leftEyeBtn: string;
  rightEyeBtn: string;
  bothEyesBtn: string;
  leftEyeLabel: string;
  rightEyeLabel: string;
  bothEyesLabel: string;
  readingStage: string;
  readingStageOf: string;
  readingProgressLabel: string;
  readingCanRead: string;
  readingCannotRead: string;
  readingComplete: string;
  readingNextEye: string;
  readingCoverEyeTip: string;
  readingWords: string[];

  // Questionnaire - New Questions
  screenTimePrompt: string;
  screenTimeBelow1hr: string;
  screenTime1to3hr: string;
  screenTimeAbove3hr: string;
  phoneAtNightPrompt: string;
  eyeIrritationPrompt: string;
  wateryEyesPrompt: string;
  headachePrompt: string;
  blurryVisionPrompt: string;

  // Common
  next: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: 'VitaSyn Free AI',
    freeAiTag: 'Free Health AI',
    companyName: 'VitaSyn Pvt Ltd',
    officialWebsite: 'Visit Official Website',
    dashboard: 'Dashboard',
    navHair: 'Hair Analysis',
    navEye: 'Eye Checkup',
    navHistory: 'Past Reports',
    navLogout: 'Sign Out',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    languageName: 'தமிழ் (Tamil)',

    // Auth
    loginTitle: 'Welcome Back',
    loginSubtitle: 'Sign in to access your free health AI assessments',
    phoneNumberLabel: 'Phone number',
    phoneNumberPlaceholder: '+91 98765 43210',
    sendOtp: 'Send OTP',
    sendingOtp: 'Sending...',
    verifyOtp: 'Verify and sign in',
    resendOtp: 'Resend OTP',
    resendIn: 'Resend in',
    otpSent: 'Verification code sent by SMS.',
    signInWithGoogle: 'Continue with Google',
    googleSignInUnavailable: 'Google sign-in is not configured',
    or: 'OR',
    invalidPhone: 'Enter a valid phone number with country code, such as +919876543210.',
    googleSignInFailed: 'Could not complete Google sign-in. Please try again.',
    registerTitle: 'Create Account',
    registerSubtitle: 'Join VitaSyn Free AI — start your free health screening today',
    nameLabel: 'Full Name',
    namePlaceholder: 'Enter your full name',
    emailOrPhoneLabel: 'Email ID or Phone Number',
    emailOrPhonePlaceholder: 'Enter email or 10-digit phone number',
    emailLabel: 'Email Address',
    emailPlaceholder: 'Enter your email address',
    phoneLabel: 'Phone Number',
    phonePlaceholder: '10-digit mobile number',
    ageLabel: 'Age',
    agePlaceholder: 'Your age',
    sexLabel: 'Sex',
    sexMale: 'Male',
    sexFemale: 'Female',
    sexOther: 'Other',
    passwordLabel: 'Password',
    loginPasswordPlaceholder: 'Enter your password',
    passwordPlaceholder: 'Create a strong password',
    confirmPasswordLabel: 'Confirm Password',
    confirmPasswordPlaceholder: 'Re-enter your password',
    loginBtn: 'Sign In',
    registerBtn: 'Create Account',
    forgotPassword: 'Forgot Password?',
    goToRegister: "Don't have an account? Register",
    goToLogin: 'Already have an account? Sign In',
    forgotTitle: 'Reset Password',
    forgotSubtitle: 'Verify your registered email and mobile number to reset password',
    backToLogin: 'Back to Sign In',
    userNotFound: 'user not found. register first.',
    invalidCredential: 'invalid credential.',
    emailAlreadyExists: 'user with same email already exist, try login.',
    passwordMismatch: 'Passwords do not match. Please re-enter.',
    fillAllFields: 'Please fill in all required fields.',
    registrationSuccess: 'Registration successful! Please sign in.',
    loggedInAs: 'Signed in as',

    // Forgot password flow
    forgotStep1Title: 'Step 1: Enter your registered email address',
    phoneFirst6Msg: 'Your registered mobile number begins with:',
    phoneLast4Label: 'Enter the last 4 digits of your registered mobile number:',
    phoneLast4Placeholder: 'e.g. 3210',
    verifyPhoneBtn: 'Verify Mobile & Send 6-Digit OTP',
    enterOtpLabel: 'Enter the 6-digit verification code:',
    otpPlaceholder: 'e.g. 123456',
    verifyOtpBtn: 'Verify OTP',
    newPasswordLabel: 'New Password',
    newPasswordPlaceholder: 'Enter new password',
    confirmNewPasswordLabel: 'Confirm New Password',
    confirmNewPasswordPlaceholder: 'Re-enter new password',
    resetPasswordBtn: 'Update Password & Sign In',
    passwordUpdatedSuccess: 'Password updated successfully! Redirecting to login...',
    invalidMobile: 'invalid mobile number.',
    invalidOtp: 'Enter a valid 6-digit verification code.',
    userEmailNotFound: 'user with email id not found, register first.',
    userAlreadyExistsTryLogin: 'user with same email already exist, try login.',

    welcomeTitle: 'Intelligent Health AI Assessment',
    welcomeSubtitle:
      'Empowering your daily wellness with smart AI vision analysis and personalized consultation reports.',
    hairCardTitle: 'Scalp & Hair AI Health Scan',
    hairCardDesc:
      'Upload a scalp photo. AI verifies hair texture, analyzes symptoms (dryness, growth, dandruff, lice), and generates a personalized care plan.',
    eyeCardTitle: 'Clinical Eye Checkup & Vision AI',
    eyeCardDesc:
      'Test your color discrimination across 10 dynamic stages, measure reading acuity from very big to micro sentences, and receive tailored ocular wellness guidance.',
    startBtn: 'Start Assessment',

    hairTitle: 'Scalp & Hair AI Analysis',
    hairSubtitle: 'Smart AI Vision Check & Personalized Care Consultation',
    uploadTitle: 'Step 1: Upload Scalp or Hair Photo',
    uploadDesc: 'Upload a clear, well-lit close-up photo of your hair or scalp area for AI verification.',
    choosePhoto: 'Drag & drop or browse image',
    photoDescriptionLabel: 'Scalp Condition / Any Concerns (Optional)',
    photoDescriptionPlaceholder: 'e.g., experiencing thinning along crown, sudden shedding after fever, or excessive oiliness...',
    verifyImageBtn: 'Verify Photo with AI',
    verifyingImage: 'AI is analyzing your photo for hair and scalp features...',
    hairVerifiedTitle: 'Hair & Scalp Successfully Verified!',
    hairNotDetectedTitle: 'No Human Hair Detected',
    hairNotDetectedDesc:
      'AI could not recognize human hair or scalp features in the uploaded image. Please provide a clear, focused photograph of human hair or scalp.',
    reuploadBtn: 'Upload Another Photo',
    continueToQuestions: 'Continue to Hair Symptom Questions',
    tapToChangePhoto: 'Tap to change',
    selectedPhotoLabel: 'Selected Scalp Photo',
    hairStep2Title: 'Step 2: Scalp Health Assessment',
    hairStep2Desc: 'Answer the following clinical questions to generate a tailored diagnosis.',
    hairAiBanner: 'VitaSyn AI Vision & Health Evaluation',
    hairReportEval: 'Evaluated with VitaSyn AI Vision & Health Intelligence',
    hairClinicalConsult: 'AI Clinical Consultation',

    qDrynessTitle: '1. What is your scalp and hair moisture level?',
    qDrynessDry: 'Dry & Rough',
    qDrynessNormal: 'Balanced / Normal',
    qDrynessOily: 'Oily & Greasy',

    qGrowthTitle: '2. How would you describe your hair growth speed?',
    qGrowthFast: 'Fast (Requires frequent trims)',
    qGrowthMedium: 'Medium / Average',
    qGrowthSlow: 'Slow / Stagnant',

    qItchingTitle: '3. Do you experience frequent scalp itching or irritation?',
    qDandruffTitle: '4. Do you notice visible dandruff flakes (white or yellow)?',
    qLiceTitle: '5. Is there any suspicion or presence of head lice or nits?',

    yes: 'Yes',
    no: 'No',
    submitHairAnalysis: 'Generate AI Hair & Scalp Report',
    generatingAiReport: 'AI is preparing your personalized consultation report...',

    eyeTitle: 'Interactive Eye Checkup',
    eyeSubtitle: '10-Stage Color Discrimination, Reading Acuity & Vision Wellness',
    eyeBanner: 'Clinical Vision & Color Perception AI',
    phase1Title: 'Part 1: Color Differentiation Test (10 Stages)',
    phase1Desc: 'Find and tap the single tile with a slightly different shade. Difficulty increases on each stage!',
    stage: 'Stage',
    of: 'of',
    colorScoreLabel: 'Color Points',
    tapDifferentTile: 'Tap the one tile that has a different color shade',
    correctTileSelected: 'Spot on! Advancing to next stage...',

    phase2Title: 'Part 2: Visual Acuity & Reading Scale',
    phase2Desc: 'Assess how clearly you can read sentences at standard screen distance (approx. arm length).',
    distanceTip: 'Sit comfortably at an arm length (~50 cm) from your display.',
    sentenceLevel: 'Sentence Size Tier',
    canYouReadPrompt: 'Can you read the sentence above crisply without squinting?',
    canReadBtn: 'Yes, I can read it clearly',
    cannotReadBtn: 'No, it is blurry or unreadable',

    phase3Title: 'Part 3: Ocular Symptoms Questionnaire',
    eyePhase3Desc: 'Answer these final ocular symptom questions to synthesize your AI report.',
    dryEyesPrompt: 'Do your eyes often feel dry, gritty, burning, or tired after screen time?',
    havePowerPrompt: 'Do you wear prescription spectacles or contact lenses for vision power?',
    powerTypePrompt: 'Is your prescription power Positive (+) or Negative (-)?',
    powerPositive: 'Positive (+) [Reading / Hyperopia]',
    powerNegative: 'Negative (-) [Distance / Myopia]',
    submitEyeAnalysis: 'Generate AI Eye Wellness Report',
    eyeColorRating: 'Color Discrimination Rating',
    eyeAcuityTier: 'Visual Acuity Reading Tier',
    eyeClinicalConsult: 'AI Ocular Wellness Consultation',
    eyeReportEval: 'Evaluated with VitaSyn AI Clinical Metrics',
    colorDiscriminationLabel: 'Color Discrimination',
    readingAcuityLabel: 'Reading Acuity',

    sentVeryBig: 'Health is a state of complete physical, mental, and social well-being.',
    sentBig: 'Clear vision allows us to appreciate the subtle beauty of nature every day.',
    sentMedium: 'Taking regular breaks from digital screens protects your eyes from strain.',
    sentSmall: 'Hydration and blink exercises help maintain your tear film and corneal clarity.',
    sentVerySmall: 'VitaSyn Free AI promotes preventative wellness through accessible intelligence.',

    reportTitle: 'Assessment & Consultation Report',
    overallScore: 'Overall Wellness Index',
    conditionBadge: 'Primary Evaluation',
    keyFindings: 'Clinical Insights & Indicators',
    recommendedDos: 'Daily Best Practices (Do)',
    thingsToAvoid: "Precautions & Triggers (Don't)",
    expertRecommendations: 'Personalized Care Blueprint',
    lifestyleTip: 'Holistic Lifestyle & Nutrition Tip',
    medicalDisclaimer:
      'Medical Disclaimer: This report is an AI wellness screening generated by VitaSyn Free AI. It does not substitute professional medical diagnosis. Please consult a qualified practitioner for personalized medical therapy.',
    printReport: 'Print / Save PDF',
    retakeTest: 'Take Another Test',
    close: 'Close',
    historyTitle: 'Saved Assessment Records',
    noHistory: 'No assessments recorded yet. Take a Hair or Eye test to view your records here!',
    historyDbSubtitle: 'Saved assessment records from your health screenings',
    scoreLabel: 'Index',
    viewLabel: 'View',
    allFilter: 'All',

    skipToReading: 'Skip to Reading Test →',
    backToUpload: 'Back to Upload',
    backToReadingTest: 'Back to Reading Test',
    aiConsulting: 'AI is preparing your report...',
    aiAnalyzing: 'AI is analyzing your photo...',

    // Pre-Test Instructions
    preTestTitle: 'Eye Checkup Instructions',
    preTestSubtitle: 'Please read the following instructions carefully before starting the test',
    preTestInstructions: [
      'Sit comfortably at arm\'s length (~50 cm) from your screen',
      'Ensure good lighting without glare on the screen',
      'Do not wear sunglasses or tinted lenses during the test',
      'Test each eye separately as instructed',
      'The color test has 10 stages with 10-second timers',
      'The reading test has 3 modes: Left Eye, Right Eye, Both Eyes',
      'Each reading mode has 5 text size stages',
      'Answer honestly for accurate AI assessment'
    ],
    preTestStartBtn: 'Start Test',
    preTestSkipBtn: 'Skip Instructions',

    // Color Test Timer
    colorTimerLabel: 'Time Remaining',
    colorStageComplete: 'Stage Complete!',

    // Reading Test - Eye Selection
    readingEyeSelectionTitle: 'Select Eye Test Mode',
    readingEyeSelectionDesc: 'Choose which eye to test. Each mode has 5 stages of decreasing text size.',
    leftEyeBtn: 'Left Eye Test',
    rightEyeBtn: 'Right Eye Test',
    bothEyesBtn: 'Both Eyes Test',
    leftEyeLabel: 'Left Eye',
    rightEyeLabel: 'Right Eye',
    bothEyesLabel: 'Both Eyes',
    readingStage: 'Stage',
    readingStageOf: 'of',
    readingProgressLabel: 'Reading Index',
    readingCanRead: 'Yes, I can read it',
    readingCannotRead: 'No, it\'s blurry',
    readingComplete: 'Test Complete!',
    readingNextEye: 'Next Eye Test',
    readingCoverEyeTip: 'Keep this eye open and read the words aloud. Cover the other eye with your palm.',
    readingWords: [
      'VISION',
      'LIGHT',
      'FOCUS',
      'BRIGHT',
      'READING',
      'CLEARLY',
      'BLINKING',
      'DISTANT',
      'PREVENT',
      'PROTECTED',
      'GLARE',
      'SHARPEN',
      'NEAR',
      'LIGHTER',
      'CONTRAST',
    ],

    // Questionnaire - New Questions
    screenTimePrompt: 'What is your average daily screen time?',
    screenTimeBelow1hr: 'Below 1 hour',
    screenTime1to3hr: '1 to 3 hours',
    screenTimeAbove3hr: 'Above 3 hours',
    phoneAtNightPrompt: 'Do you use your phone in bed at night?',
    eyeIrritationPrompt: 'Did you experience eye irritation during the test?',
    wateryEyesPrompt: 'Did your eyes water during the test?',
    headachePrompt: 'Do you get headaches after prolonged screen use?',
    blurryVisionPrompt: 'Do you experience blurry vision after prolonged screen use?',

    // Common
    next: 'Next',
  },

  ta: {
    appName: 'VitaSyn Free AI',
    freeAiTag: 'இலவச சுகாதார AI',
    companyName: 'VitaSyn Pvt Ltd',
    officialWebsite: 'அதிகாரப்பூர்வ வலைத்தளம்',
    dashboard: 'முகப்புப் பக்கம்',
    navHair: 'முடி பரிசோதனை',
    navEye: 'கண் பரிசோதனை',
    navHistory: 'கடந்த அறிக்கைகள்',
    navLogout: 'வெளியேறு',
    lightMode: 'பகல் முறை',
    darkMode: 'இரவு முறை',
    languageName: 'English',

    // Auth - Tamil
    loginTitle: 'மீண்டும் வரவேற்கிறோம்',
    loginSubtitle: 'உங்கள் இலவச சுகாதார AI பரிசோதனைகளை அணுக உள்நுழையவும்',
    phoneNumberLabel: 'தொலைபேசி எண்',
    phoneNumberPlaceholder: '+91 98765 43210',
    sendOtp: 'OTP அனுப்பு',
    sendingOtp: 'அனுப்பப்படுகிறது...',
    verifyOtp: 'சரிபார்த்து உள்நுழையவும்',
    resendOtp: 'OTP மீண்டும் அனுப்பு',
    resendIn: 'மீண்டும் அனுப்ப',
    otpSent: 'சரிபார்ப்புக் குறியீடு SMS மூலம் அனுப்பப்பட்டது.',
    signInWithGoogle: 'Google மூலம் தொடரவும்',
    googleSignInUnavailable: 'Google உள்நுழைவு அமைக்கப்படவில்லை',
    or: 'அல்லது',
    invalidPhone: '+919876543210 போன்ற நாட்டுக் குறியீட்டுடன் சரியான தொலைபேசி எண்ணை உள்ளிடவும்.',
    googleSignInFailed: 'Google உள்நுழைவை முடிக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.',
    registerTitle: 'கணக்கு உருவாக்கவும்',
    registerSubtitle: 'VitaSyn Free AI-ல் இணைந்து இன்றே இலவச சுகாதார பரிசோதனையைத் தொடங்குங்கள்',
    nameLabel: 'முழு பெயர்',
    namePlaceholder: 'உங்கள் முழு பெயரை உள்ளிடவும்',
    emailOrPhoneLabel: 'மின்னஞ்சல் அல்லது தொலைபேசி எண்',
    emailOrPhonePlaceholder: 'மின்னஞ்சல் அல்லது 10-இலக்க தொலைபேசி எண் உள்ளிடவும்',
    emailLabel: 'மின்னஞ்சல் முகவரி',
    emailPlaceholder: 'உங்கள் மின்னஞ்சல் முகவரியை உள்ளிடவும்',
    phoneLabel: 'தொலைபேசி எண்',
    phonePlaceholder: '10-இலக்க மொபைல் எண்',
    ageLabel: 'வயது',
    agePlaceholder: 'உங்கள் வயது',
    sexLabel: 'பாலினம்',
    sexMale: 'ஆண்',
    sexFemale: 'பெண்',
    sexOther: 'மற்றவை',
    passwordLabel: 'கடவுச்சொல்',
    loginPasswordPlaceholder: 'கடவுச்சொல்லை உள்ளிடவும்',
    passwordPlaceholder: 'வலுவான கடவுச்சொல் உருவாக்கவும்',
    confirmPasswordLabel: 'கடவுச்சொல் உறுதிப்படுத்தவும்',
    confirmPasswordPlaceholder: 'கடவுச்சொல்லை மீண்டும் உள்ளிடவும்',
    loginBtn: 'உள்நுழைய',
    registerBtn: 'கணக்கு உருவாக்கவும்',
    forgotPassword: 'கடவுச்சொல் மறந்துவிட்டதா?',
    goToRegister: 'கணக்கு இல்லையா? பதிவு செய்யவும்',
    goToLogin: 'ஏற்கனவே கணக்கு உள்ளதா? உள்நுழையவும்',
    forgotTitle: 'கடவுச்சொல் மீட்டமைவு',
    forgotSubtitle: 'பதிவுசெய்த மின்னஞ்சல் மற்றும் மொபைல் எண்ணை சரிபார்த்து கடவுச்சொல்லை மீட்டமைக்கவும்',
    backToLogin: 'உள்நுழைவுக்கு திரும்பவும்',
    userNotFound: 'பயனர் கண்டறியப்படவில்லை. முதலில் பதிவு செய்யவும்.',
    invalidCredential: 'தவறான சான்றுகள். கடவுச்சொல்லை சரிபார்க்கவும்.',
    emailAlreadyExists: 'இந்த மின்னஞ்சலில் ஏற்கனவே கணக்கு உள்ளது, உள்நுழைய முயற்சிக்கவும்.',
    passwordMismatch: 'கடவுச்சொற்கள் பொருந்தவில்லை. மீண்டும் உள்ளிடவும்.',
    fillAllFields: 'அனைத்து தேவையான புலங்களையும் நிரப்பவும்.',
    registrationSuccess: 'கணக்கு வெற்றிகரமாக உருவாக்கப்பட்டது! தயவுசெய்து உள்நுழையவும்.',
    loggedInAs: 'உள்நுழைந்துள்ளீர்கள்',

    // Forgot password flow - Tamil
    forgotStep1Title: 'படி 1: உங்கள் பதிவுசெய்த மின்னஞ்சலை உள்ளிடவும்',
    phoneFirst6Msg: 'உங்கள் பதிவுசெய்த மொபைல் எண் ஆரம்பம்:',
    phoneLast4Label: 'உங்கள் மொபைல் எண்ணின் கடைசி 4 இலக்கங்களை உள்ளிடவும்:',
    phoneLast4Placeholder: 'எ.கா. 3210',
    verifyPhoneBtn: 'மொபைலை சரிபார்த்து 6-இலக்க OTP அனுப்பவும்',
    enterOtpLabel: '6 இலக்க சரிபார்ப்புக் குறியீட்டை உள்ளிடவும்:',
    otpPlaceholder: 'எ.கா. 123456',
    verifyOtpBtn: 'OTP சரிபார்க்கவும்',
    newPasswordLabel: 'புதிய கடவுச்சொல்',
    newPasswordPlaceholder: 'புதிய கடவுச்சொல்லை உள்ளிடவும்',
    confirmNewPasswordLabel: 'புதிய கடவுச்சொல் உறுதிப்படுத்தவும்',
    confirmNewPasswordPlaceholder: 'புதிய கடவுச்சொல்லை மீண்டும் உள்ளிடவும்',
    resetPasswordBtn: 'கடவுச்சொல்லை மாற்றி உள்நுழையவும்',
    passwordUpdatedSuccess: 'கடவுச்சொல் வெற்றிகரமாக மாற்றப்பட்டது! உள்நுழைவுக்கு செல்கிறது...',
    invalidMobile: 'தவறான மொபைல் எண்.',
    invalidOtp: 'சரியான 6 இலக்க சரிபார்ப்புக் குறியீட்டை உள்ளிடவும்.',
    userEmailNotFound: 'மின்னஞ்சல் கொண்ட பயனர் காணப்படவில்லை, முதலில் பதிவு செய்யவும்.',
    userAlreadyExistsTryLogin: 'இந்த மின்னஞ்சலில் ஏற்கனவே கணக்கு உள்ளது, உள்நுழைய முயற்சிக்கவும்.',

    welcomeTitle: 'அதிநவீன AI நல்வாழ்வு பரிசோதனை',
    welcomeSubtitle:
      'AI-ஆல் இயக்கப்படும் வல்லமைமிக்க பரிசோதனை மூலம் உங்கள் முடி மற்றும் கண் ஆரோக்கியத்தை உடனடியாக அறியுங்கள்.',
    hairCardTitle: 'முடி & உச்சந்தலை AI பரிசோதனை',
    hairCardDesc:
      'உச்சந்தலை புகைப்படத்தை பதிவேற்றுங்கள். AI முடியை உறுதிசெய்து, வறட்சி, பொடுகு, பேன் போன்ற அறிகுறிகளை ஆராய்ந்து தனிப்பயனாக்கப்பட்ட தீர்வளிக்கும்.',
    eyeCardTitle: 'முழுமையான கண் நலம் & பார்வை AI',
    eyeCardDesc:
      '10 நிலைகளில் வண்ண வேறுபாட்டை கண்டறியுங்கள், பெரியது முதல் சிறிய அளவிலான வாக்கியங்களை வாசித்து பார்வைத் திறனை அறிந்திடுங்கள்.',
    startBtn: 'பரிசோதனையைத் தொடங்கு',

    hairTitle: 'முடி & உச்சந்தலை AI பரிசோதனை',
    hairSubtitle: 'AI பார்வை சரிபார்ப்பு & தனிப்பயன் பராமரிப்பு ஆலோசனை',
    uploadTitle: 'படி 1: உச்சந்தலை அல்லது முடி புகைப்படத்தை பதிவேற்றவும்',
    uploadDesc: 'தெளிவான வெளிச்சத்தில் எடுக்கப்பட்ட உங்கள் முடி அல்லது உச்சந்தலை புகைப்படத்தை தேர்ந்தெடுக்கவும்.',
    choosePhoto: 'படத்தை இழுத்து விடவும் அல்லது தேர்ந்தெடுக்கவும்',
    photoDescriptionLabel: 'உச்சந்தலை நிலை அல்லது ஏதேனும் பிரச்சனைகள் (விருப்பத்தேர்வு)',
    photoDescriptionPlaceholder: 'எ.கா: முடி உதிர்தல், வறட்சி, அதிக எண்ணெய் பசை அல்லது அரிப்பு...',
    verifyImageBtn: 'AI மூலம் படத்தை சரிபார்',
    verifyingImage: 'AI உங்கள் புகைப்படத்தில் முடி மற்றும் உச்சந்தலை அம்சங்களை பகுப்பாய்கிறது...',
    hairVerifiedTitle: 'முடி மற்றும் உச்சந்தலை வெற்றிகரமாக உறுதி செய்யப்பட்டது!',
    hairNotDetectedTitle: 'மனித முடி கண்டறியப்படவில்லை',
    hairNotDetectedDesc:
      'பதிவேற்றப்பட்ட படத்தில் மனித முடி அல்லது உச்சந்தலை கண்டறியப்படவில்லை. தயவுசெய்து தெளிவான முடி புகைப்படத்தை மீண்டும் பதிவேற்றவும்.',
    reuploadBtn: 'வேறு படத்தை பதிவேற்றவும்',
    continueToQuestions: 'அடுத்த கேள்விகளுக்குச் செல்லவும்',
    tapToChangePhoto: 'மாற்ற தொடவும்',
    selectedPhotoLabel: 'தேர்ந்தெடுக்கப்பட்ட உச்சந்தலை புகைப்படம்',
    hairStep2Title: 'படி 2: உச்சந்தலை நலம் வினாவிடை',
    hairStep2Desc: 'தனிப்பயனாக்கப்பட்ட நோயறிதலைப் பெற பின்வரும் கேள்விகளுக்குப் பதிலளிக்கவும்.',
    hairAiBanner: 'அதிநவீன AI பார்வை சரிபார்ப்பு & நல்வாழ்வு அறிக்கை',
    hairReportEval: 'VitaSyn AI பார்வை & சுகாதார நுண்ணறிவு மூலம் மதிப்பிடப்பட்டது',
    hairClinicalConsult: 'AI மருத்துவ ஆலோசனை',

    qDrynessTitle: '1. உங்கள் உச்சந்தலை மற்றும் முடியின் ஈரப்பதம் எப்படி உள்ளது?',
    qDrynessDry: 'வறண்ட & சொரசொரப்பான முடி',
    qDrynessNormal: 'சீரான / இயல்பான முடி',
    qDrynessOily: 'அதிக எண்ணெய் பசை கொண்ட முடி',

    qGrowthTitle: '2. உங்கள் முடி வளரும் வேகம் எவ்வாறு உள்ளது?',
    qGrowthFast: 'வேகமாக வளர்கிறது',
    qGrowthMedium: 'நடுத்தர வேகம்',
    qGrowthSlow: 'மிக மெதுவாக வளர்கிறது',

    qItchingTitle: '3. உங்கள் உச்சந்தலையில் அடிக்கடி அரிப்பு அல்லது எரிச்சல் ஏற்படுகிறதா?',
    qDandruffTitle: '4. கண்ணுக்குத் தெரியும் பொடுகு செதில்கள் (வெள்ளை அல்லது மஞ்சள்) உள்ளதா?',
    qLiceTitle: '5. தலையில் பேன் அல்லது ஈறுகள் உள்ளதா?',

    yes: 'ஆம்',
    no: 'இல்லை',
    submitHairAnalysis: 'AI முடி & உச்சந்தலை அறிக்கையை உருவாக்கு',
    generatingAiReport: 'AI உங்கள் தனிப்பயன் ஆலோசனை அறிக்கையை தயாரிக்கிறது...',

    eyeTitle: 'ஊடாடும் கண் பரிசோதனை',
    eyeSubtitle: '10 நிலை வண்ண வேறுபாடு, பார்வை வாசிப்பு அளவு & கண் நலம்',
    eyeBanner: 'AI வண்ண & பார்வை பரிசோதனை',
    phase1Title: 'பகுதி 1: வண்ண வேறுபாடு கண்டறியும் தேர்வு (10 நிலைகள்)',
    phase1Desc: 'கொடுக்கப்பட்ட 16 கட்டங்களில் சற்று மாறுபட்ட நிறமுடைய ஒரு கட்டத்தை தொட்டு தேர்ந்தெடுக்கவும்!',
    stage: 'நிலை',
    of: 'இல்',
    colorScoreLabel: 'வண்ண புள்ளிகள்',
    tapDifferentTile: 'மாறுபட்ட நிறமுடைய கட்டத்தை தொடவும்',
    correctTileSelected: 'சரியான தேர்வு! அடுத்த நிலைக்கு செல்கிறது...',

    phase2Title: 'பகுதி 2: பார்வைத் திறன் & வாக்கிய வாசிப்பு அளவு',
    phase2Desc: 'திரையிலிருந்து ஒரு கை தொலைவில் அமர்ந்து வாக்கியங்களை எவ்வளவு தெளிவாக படிக்க முடிகிறது என சோதிக்கவும்.',
    distanceTip: 'திரையிலிருந்து சுமார் 50 செ.மீ (ஒரு கை தூரம்) தள்ளி அமரவும்.',
    sentenceLevel: 'வாக்கிய அளவு படிநிலை',
    canYouReadPrompt: 'மேலே உள்ள வாக்கியத்தை கண்களைச் சுருக்காமல் தெளிவாகப் படிக்க முடிகிறதா?',
    canReadBtn: 'ஆம், என்னால் தெளிவாகப் படிக்க முடிகிறது',
    cannotReadBtn: 'இல்லை, மங்கலாக உள்ளது / படிக்க முடியவில்லை',

    phase3Title: 'பகுதி 3: கண் ஆரோக்கிய வினாவிடை',
    eyePhase3Desc: 'உங்கள் AI அறிக்கையை உருவாக்க இந்த கண் அறிகுறி கேள்விகளுக்கு பதிலளிக்கவும்.',
    dryEyesPrompt: 'திரையைப் பார்த்த பிறகு உங்கள் கண்கள் அடிக்கடி வறண்டு அல்லது சோர்வாக உணர்கிறீர்களா?',
    havePowerPrompt: 'நீங்கள் பார்வை குறைபாட்டிற்காக கண்ணாடி அல்லது லென்ஸ் அணிகிறீர்களா?',
    powerTypePrompt: 'உங்கள் கண்ணாடி பவர் பாசிட்டிவ் (+) அல்லது நெகட்டிவ் (-)?',
    powerPositive: 'பாசிட்டிவ் (+) [அருகில் பார்ப்பதற்கு]',
    powerNegative: 'நெகட்டிவ் (-) [தொலைவில் பார்ப்பதற்கு]',
    submitEyeAnalysis: 'AI கண் நல அறிக்கையைப் பெறுங்கள்',
    eyeColorRating: 'வண்ண பாகுபாடு மதிப்பீடு',
    eyeAcuityTier: 'பார்வை வாசிப்பு அடுக்கு',
    eyeClinicalConsult: 'AI கண் நல்வாழ்வு மருத்துவ ஆலோசனை',
    eyeReportEval: 'VitaSyn AI மருத்துவ அளவீடுகள் மூலம் மதிப்பிடப்பட்டது',
    colorDiscriminationLabel: 'வண்ண பாகுபாடு',
    readingAcuityLabel: 'பார்வைத் திறன்',

    sentVeryBig: 'ஆரோக்கியமே மிகச்சிறந்த செல்வம் மற்றும் வாழ்வின் மகிழ்ச்சியாகும்.',
    sentBig: 'தெளிவான பார்வை இயற்கையின் பேரழகை நாள்தோறும் ரசிக்க உதவுகிறது.',
    sentMedium: 'கணினி திரையிலிருந்து சிறிது இடைவெளி எடுப்பது கண்களுக்கு ஓய்வளிக்கும்.',
    sentSmall: 'நீர்ச்சத்து மற்றும் கண் இமைக்கும் பயிற்சி பார்வைத் தெளிவை பாதுகாக்கும்.',
    sentVerySmall: 'VitaSyn Free AI எளிய முறையில் நல்வாழ்வு ஆலோசனைகளை இலவசமாக வழங்குகிறது.',

    reportTitle: 'AI ஆலோசனை மற்றும் பரிசோதனை அறிக்கை',
    overallScore: 'ஒட்டுமொத்த நல்வாழ்வு மதிப்பெண்',
    conditionBadge: 'முதன்மை மதிப்பீடு',
    keyFindings: 'மருத்துவ நுண்ணறிவு & காரணங்கள்',
    recommendedDos: 'தினசரி செய்ய வேண்டியவை',
    thingsToAvoid: 'தவிர்க்க வேண்டியவை',
    expertRecommendations: 'தனிப்பயனாக்கப்பட்ட பராமரிப்பு குறிப்புகள்',
    lifestyleTip: 'வாழ்க்கை முறை & உணவு ஆலோசனை',
    medicalDisclaimer:
      'மருத்துவ மறுப்புரை: இந்த அறிக்கை VitaSyn Free AI உருவாக்கிய ஆரோக்கிய வழிகாட்டல் மட்டுமே. தீவிர அறிகுறிகளுக்கு தகுதிவாய்ந்த மருத்துவரை அணுகவும்.',
    printReport: 'அச்சிடு / PDF சேமி',
    retakeTest: 'மீண்டும் பரிசோதிக்கவும்',
    close: 'மூடு',
    historyTitle: 'சேமிக்கப்பட்ட பரிசோதனை பதிவுகள்',
    noHistory: 'இதுவரை எந்தப் பதிவுகளும் இல்லை. உங்கள் பதிவுகளைக் காண முடி அல்லது கண் பரிசோதனையைத் தொடங்குங்கள்!',
    historyDbSubtitle: 'உங்கள் சுகாதார பரிசோதனைகளிலிருந்து சேமிக்கப்பட்ட பதிவுகள்',
    scoreLabel: 'மதிப்பெண்',
    viewLabel: 'பார்',
    allFilter: 'அனைத்தும்',

    skipToReading: 'வாசிப்பு சோதனைக்கு தவிர்க்கவும் →',
    backToUpload: 'பதிவேற்றத்திற்கு திரும்பவும்',
    backToReadingTest: 'வாசிப்பு சோதனைக்கு திரும்பவும்',
    aiConsulting: 'AI உங்கள் அறிக்கையை தயாரிக்கிறது...',
    aiAnalyzing: 'AI உங்கள் புகைப்படத்தை பகுப்பாய்கிறது...',

    // Pre-Test Instructions
    preTestTitle: 'கண் பரிசோதனை வழிமுறைகள்',
    preTestSubtitle: 'பரிசோதனையைத் தொடங்குவதற்கு முன் பின்வரும் வழிமுறைகளை கவனமாகப் படிக்கவும்',
    preTestInstructions: [
      'உங்கள் திரையிலிருந்து ஒரு கை தூரத்தில் (~50 செ.மீ) சமநிலையாக அமரவும்',
      'திரையில் ஒளிப்பிரதிபிம்பம் இல்லாமல் நல்ல வெளிச்சம் இருப்பதை உறுதிசெய்யவும்',
      'பரிசோதனை காலத்தில் சன் கிளாஸ்கள் அல்லது நிற வண்ணமுள்ள லென்ஸ்களை அணியாதீர்கள்',
      'வழிமுறைகளைப் பின்பற்றி ஒவ்வொரு கணையும் தனித்தனியாகப் பரிசோதிக்கவும்',
      'வண்ண பரிசோதனையில் 10 நிலைகள் உள்ளன, ஒவ்வொரு நிலைக்கும் 10 வினாடிகள்',
      'வாசிப்பு பரிசோதனையில் 3 பயன்முறைகள் உள்ளன: இடது கண், வலது கண், இரு கண்களும்',
      'ஒவ்வொரு வாசிப்பு பயன்முறையிலும் வாக்கிய அளவு குறையும் வரிசையில் 5 நிலைகள் உள்ளன',
      'சரியான AI மதிப்பீட்டிற்காக கேள்விகளுக்கு நேராகப் பதிலளிக்கவும்'
    ],
    preTestStartBtn: 'பரிசோதனையைத் தொடங்கு',
    preTestSkipBtn: 'வழிமுறைகளைத் தவிர்க்கவும்',

    // Color Test Timer
    colorTimerLabel: 'மீதமுள்ள நேரம்',
    colorStageComplete: 'நிலை முடிந்தது!',

    // Reading Test - Eye Selection
    readingEyeSelectionTitle: 'கண் பரிசோதனை பயன்முறையைத் தேர்வு செய்யவும்',
    readingEyeSelectionDesc: 'எந்த கண் பரிசோதிக்க வேண்டும் என்பதைத் தேர்வு செய்யவும். ஒவ்வொரு பயன்முறையிலும் வாக்கிய அளவு குறைவடைந்து 5 நிலைகள் உள்ளன.',
    leftEyeBtn: 'இடது கண் பரிசோதனை',
    rightEyeBtn: 'வலது கண் பரிசோதனை',
    bothEyesBtn: 'இரு கண்களும் பரிசோதனை',
    leftEyeLabel: 'இடது கண்',
    rightEyeLabel: 'வலது கண்',
    bothEyesLabel: 'இரு கண்களும்',
    readingStage: 'நிலை',
    readingStageOf: 'இல்',
    readingProgressLabel: 'வாசிப்பு மதிப்பெண்',
    readingCanRead: 'ஆம், என்னால் படிக்க முடிகிறது',
    readingCannotRead: 'இல்லை, மங்கலாக உள்ளது',
    readingComplete: 'பரிசோதனை முடிந்தது!',
    readingNextEye: 'அடுத்த கண் பரிசோதனை',
    readingCoverEyeTip: 'இந்தக் கண்ணைத் திறந்து வைத்து சொற்களைப் படித்துச் சொல்லவும். மற்ற கண்ணை உங்கள் கைத்தட்டால் மூடவும்.',
    readingWords: [
      'பார்வை',
      'வெளிச்சம்',
      'கவனம்',
      'ஒளி',
      'வாசிப்பு',
      'தெளிவாக',
      'இமைத்தல்',
      'தொலைவில்',
      'தடுக்க',
      'காப்பு',
      'விரல்',
      'கூர்மை',
      'அருகில்',
      'மெல்லிய',
      'வேறுபாடு',
    ],

    // Questionnaire - New Questions
    screenTimePrompt: 'உங்கள் சராசரி நாளாந்த திரை பயன்படுத்தும் நேரம் எவ்வளவு?',
    screenTimeBelow1hr: '1 மணிக்குறினும் குறைவு',
    screenTime1to3hr: '1 முதல் 3 மணி வரை',
    screenTimeAbove3hr: '3 மணிக்கு மேல்',
    phoneAtNightPrompt: 'இரவு நேரம் படுக்கையில் பேசியைப் பயன்படுத்துகிறீர்களா?',
    eyeIrritationPrompt: 'பரிசோதனை போது கண் எரிச்சல் ஏற்பட்டதா?',
    wateryEyesPrompt: 'பரிசோதனை போது கண்கள் தண்ணீராயிருந்ததா?',
    headachePrompt: 'நீண்ட நேரம் திரையைப் பயன்படுத்திய பிறகு தலைவலி வருகிறதா?',
    blurryVisionPrompt: 'நீண்ட நேரம் திரையைப் பயன்படுத்திய பிறகு மங்கலான பார்வை ஏற்படுகிறதா?',

    // Common
    next: 'அடுத்து',
  },
};
