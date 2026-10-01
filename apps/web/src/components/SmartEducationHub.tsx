import React, { useState } from 'react';
import { 
  BookOpen, 
  HelpCircle, 
  Sun, 
  Award, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Sparkles, 
  Compass,
  ArrowRight,
  Bot,
  Volume2,
  VolumeX,
  MessageCircle,
  Lightbulb,
  Send,
  RefreshCw,
  GraduationCap
} from 'lucide-react';

export const SmartEducationHub: React.FC = () => {
  // Navigation within Hub: 'tutor' | 'quiz' | 'simulator'
  const [activeSubTab, setActiveSubTab] = useState<'tutor' | 'quiz' | 'simulator'>('tutor');

  // AI Tutor State
  const [tutorQuestion, setTutorQuestion] = useState('');
  const [lastAskedQuestion, setLastAskedQuestion] = useState<string>('What makes Antarctica so unique and how do Indian scientists study it?');
  const [questionHistory, setQuestionHistory] = useState<Array<{ question: string; answer: string; level: string; model?: string }>>([]);
  const [tutorLevel, setTutorLevel] = useState<'kid' | 'high_school' | 'advanced'>('kid');
  const [tutorLoading, setTutorLoading] = useState(false);
  const [tutorSpeechActive, setTutorSpeechActive] = useState(false);
  const [tutorResponse, setTutorResponse] = useState<any>({
    response: "🐧 Namaste young explorer! I am Dr. Penguin, your AI Polar Mentor powered by live Groq LLMs! Did you know Antarctica is not just the coldest place on Earth, but also the windiest and driest desert? Ask me ANY question about glaciers, penguins, auroras, or India's brave scientists at Maitri and Bharati, and I will answer you live!",
    keyConcepts: ["Polar Desert", "Maitri & Bharati", "Extreme Temperatures", "Live Groq AI"],
    suggestedQuestions: [
      "Why is glacier ice blue?",
      "How do emperor penguins survive -50°C?",
      "How does Antarctic ice control the Indian monsoon?",
      "What do scientists at Bharati station do during 6 months of dark winter?"
    ],
    modelUsed: "Groq (openai/gpt-oss-120b Live LLM)"
  });

  // Quiz State
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizLoading, setQuizLoading] = useState(false);

  // Albedo Simulator State
  const [iceCoverage, setIceCoverage] = useState<number>(85);

  const defaultQuiz = [
    {
      question: "What is the name of India's very first permanent scientific base station in Antarctica, established in 1983?",
      options: [
        "Maitri Station",
        "Dakshin Gangotri",
        "Bharati Station",
        "Himadri Base"
      ],
      correct: 1,
      explanation: "Dakshin Gangotri was established during the 3rd Indian Antarctic Expedition in 1983. It operated until 1989-90 when it was submerged under heavy snow accumulation and designated an Antarctic Treaty historic heritage site."
    },
    {
      question: "Why do scientists drill deep ice cores in Antarctica like the 120m core drilled during 43-ISEA?",
      options: [
        "To search for liquid fresh drinking water",
        "To mine valuable minerals from bedrock",
        "To study trapped ancient atmospheric air bubbles and paleoclimate history",
        "To install deep underground radar antennas"
      ],
      correct: 2,
      explanation: "Snow compacts into glacial ice over millennia, trapping pristine bubbles of ancient atmospheric air that show exactly what greenhouse gas concentrations and temperatures were thousands of years ago!"
    },
    {
      question: "Where is India's Arctic research station 'Himadri' situated?",
      options: [
        "Svalbard archipelago, Norway (Ny-Ålesund, 79°N)",
        "Greenland Ice Sheet Summit",
        "Baffin Island, Canada",
        "Barents Sea Continental Shelf"
      ],
      correct: 0,
      explanation: "Himadri was inaugurated on 1 July 2008 at the international Arctic research village of Ny-Ålesund in the Svalbard archipelago of Norway, located at 78°55'N latitude."
    },
    {
      question: "What is the primary scientific mission of the IndARC underwater moored observatory?",
      options: [
        "Naval submarine acoustic navigation",
        "Deep seabed petroleum and gas exploration",
        "Long-term oceanographic and temperature profiling in Kongsfjorden",
        "Commercial fishing telemetry"
      ],
      correct: 2,
      explanation: "IndARC is India's first multi-sensor moored ocean observatory deployed in Kongsfjorden, Svalbard at 192m depth to continuously monitor Arctic fjord ocean dynamics and the Indian monsoon linkage."
    },
    {
      question: "What remarkable adaptation prevents emperor penguins from losing excessive body heat through their feet?",
      options: [
        "Counter-current heat exchange blood circulation in their legs",
        "Thick waterproof wool boots grown in winter",
        "Hibernating underground through polar storms",
        "Digesting snow into alcohol to warm their blood"
      ],
      correct: 0,
      explanation: "Emperor penguins have an intricate counter-current heat exchange system in their legs: warm arterial blood heading to the feet warms cold venous blood returning to the heart, keeping the feet just above freezing."
    }
  ];

  const [activeQuizQuestions, setActiveQuizQuestions] = useState(defaultQuiz);

  const handleAskTutor = async (questionToAsk?: string) => {
    const q = (questionToAsk || tutorQuestion).trim();
    if (!q || tutorLoading) return;

    const cleanQ = q;
    setLastAskedQuestion(cleanQ);
    setTutorLoading(true);
    setTutorQuestion('');

    try {
      const res = await fetch('/api/education/ask-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: cleanQ, level: tutorLevel })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setTutorResponse(data.data);
        setQuestionHistory(prev => [
          {
            question: cleanQ,
            answer: data.data.response,
            level: tutorLevel,
            model: data.data.modelUsed
          },
          ...prev.slice(0, 7) // keep last 8 questions
        ]);
      }
    } catch (e) {
      console.error('Tutor ask failed:', e);
    } finally {
      setTutorLoading(false);
    }
  };

  const handleTutorSpeech = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    if (tutorSpeechActive) {
      window.speechSynthesis.cancel();
      setTutorSpeechActive(false);
    } else {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 1.0;
      u.pitch = tutorLevel === 'kid' ? 1.2 : 1.0;
      u.onend = () => setTutorSpeechActive(false);
      window.speechSynthesis.speak(u);
      setTutorSpeechActive(true);
    }
  };

  const handleGenerateTopicQuiz = async (topic: string) => {
    setQuizLoading(true);
    try {
      const res = await fetch('/api/education/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, difficulty: 'medium' })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setActiveQuizQuestions(data.data);
        setCurrentQIndex(0);
        setSelectedOption(null);
        setShowResult(false);
        setScore(0);
        setQuizCompleted(false);
      }
    } catch (e) {
      console.error('Quiz generation failed:', e);
    } finally {
      setQuizLoading(false);
    }
  };

  const handleSelectOption = (index: number) => {
    if (showResult) return;
    setSelectedOption(index);
    setShowResult(true);

    if (index === activeQuizQuestions[currentQIndex].correct) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQIndex < activeQuizQuestions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowResult(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQIndex(0);
    setSelectedOption(null);
    setShowResult(false);
    setScore(0);
    setQuizCompleted(false);
  };

  // Albedo Calculation
  const effectiveAlbedo = Math.round((iceCoverage * 0.85 + (100 - iceCoverage) * 0.10));
  const reflectedRadiation = Math.round((effectiveAlbedo / 100) * 1000);
  const absorbedHeat = 1000 - reflectedRadiation;

  return (
    <div className="page-container py-12">
      {/* 1. KINDRED-PALETTE PAGE INTRO */}
      <div className="pb-10 border-b border-[var(--border)] mb-8">
        <div className="section-kicker">
          <span>05</span>
          <span>Learning</span>
        </div>
        <h1 className="editorial-title">
          Smart Polar <em className="font-serif italic font-normal text-[var(--signal)]">learning hub.</em>
        </h1>
        <p className="page-intro-desc">
          Inspiring students, researchers, and public learners through Dr. Penguin (AI Polar Mentor), curriculum quizzes, and real-time physical climate simulations.
        </p>
      </div>

      {/* 2. SUB-TAB PILLS */}
      <div className="flex flex-wrap items-center gap-2 py-4 mb-8 border-b border-[var(--border)]">
        {[
          { id: 'tutor', label: 'Ask Dr. Penguin (AI Tutor)', icon: Bot },
          { id: 'quiz', label: 'Interactive Quiz', icon: HelpCircle },
          { id: 'simulator', label: 'Albedo Simulator', icon: Sun }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono tracking-wider transition-all cursor-pointer ${
                isActive
                  ? 'bg-[var(--primary)] text-[var(--primary-foreground)] font-bold shadow-xs'
                  : 'bg-[var(--card)] text-[var(--foreground)] hover:bg-[var(--secondary)] border border-[var(--border)]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Sub-tab 1: AI Polar Mentor ("Ask Dr. Penguin") */}
      {activeSubTab === 'tutor' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Tutor Dialogue Box */}
          <div className="lg:col-span-8 bg-[var(--card)] rounded-2xl p-6 sm:p-8 border border-emerald-500/30 space-y-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-[var(--secondary)] border border-[var(--border)] flex items-center justify-center text-2xl shadow-xs">
                  🐧
                </div>
                <div>
                  <h3 className="text-base font-bold text-[var(--foreground)]">Dr. Penguin • AI Polar Mentor</h3>
                  <p className="text-xs text-[var(--muted-foreground)]">Ask any question about ice, wildlife, auroras, and Indian polar missions!</p>
                </div>
              </div>

              {/* Learning Level Selector */}
              <div className="flex items-center space-x-1 bg-[var(--secondary)] p-1 rounded-full border border-[var(--border)] text-[11px] font-mono">
                {[
                  { id: 'kid', label: 'Age 8-12' },
                  { id: 'high_school', label: 'High School' },
                  { id: 'advanced', label: 'College' }
                ].map(lvl => (
                  <button
                    key={lvl.id}
                    onClick={() => setTutorLevel(lvl.id as any)}
                    className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                      tutorLevel === lvl.id
                        ? 'bg-[var(--primary)] text-[var(--primary-foreground)] font-bold shadow-xs'
                        : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                    }`}
                  >
                    {lvl.label}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Response Display / Thinking State */}
            {tutorLoading ? (
              <div className="bg-[var(--secondary)]/40 rounded-[var(--radius)] p-6 border border-[var(--border)] space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--card)] text-[var(--signal)] flex items-center justify-center animate-spin border border-[var(--border)]">
                    <RefreshCw className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wider">Dr. Penguin is Consulting Live LLM...</h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[var(--card)] text-emerald-700 border border-emerald-500/30 animate-pulse font-bold">
                        Groq 120B Live
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--muted-foreground)] mt-0.5">
                      Synthesizing verified cryospheric response for: <span className="text-[var(--foreground)] font-medium">"{lastAskedQuestion}"</span>
                    </p>
                  </div>
                </div>
                <div className="h-1.5 w-full bg-[var(--border)] rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 w-2/3 animate-pulse rounded-full" />
                </div>
              </div>
            ) : (
              <div className="bg-[var(--secondary)]/30 rounded-[var(--radius)] p-5 border border-[var(--border)] space-y-4">
                {/* Asked Question Banner */}
                {lastAskedQuestion && (
                  <div className="flex items-start space-x-2.5 text-xs text-[var(--foreground)] bg-[var(--card)] p-3 rounded-[var(--radius)] border border-[var(--border)] shadow-2xs">
                    <MessageCircle className="w-4 h-4 text-[var(--signal)] flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-mono text-[var(--signal)] uppercase tracking-wider block font-bold">
                        STUDENT QUESTION:
                      </span>
                      <p className="text-xs text-[var(--foreground)] font-medium italic mt-0.5">
                        "{lastAskedQuestion}"
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs font-mono text-emerald-700 pt-1">
                  <span className="flex items-center space-x-2 font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Mentor Explanation ({tutorLevel.toUpperCase()})</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[var(--card)] text-emerald-700 border border-emerald-500/30 flex items-center space-x-1 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block mr-1" />
                      {tutorResponse.modelUsed || 'Groq (openai/gpt-oss-120b Live LLM)'}
                    </span>
                  </span>
                  <button
                    onClick={() => handleTutorSpeech(tutorResponse.response)}
                    className="flex items-center space-x-1 text-[var(--muted-foreground)] hover:text-[var(--foreground)] px-2.5 py-1 rounded bg-[var(--card)] border border-[var(--border)] transition-colors cursor-pointer shadow-2xs"
                  >
                    {tutorSpeechActive ? <VolumeX className="w-3.5 h-3.5 text-[var(--signal)]" /> : <Volume2 className="w-3.5 h-3.5" />}
                    <span>{tutorSpeechActive ? 'Stop Voice' : 'Read Aloud'}</span>
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-[var(--foreground)] leading-relaxed whitespace-pre-line font-light">
                  {tutorResponse.response}
                </p>

                {/* Key Concept Badges */}
                {tutorResponse.keyConcepts && (
                  <div className="pt-3 border-t border-[var(--border)] flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-mono text-[var(--muted-foreground)] mr-1">KEY CONCEPTS:</span>
                    {tutorResponse.keyConcepts.map((kc: string, i: number) => (
                      <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--card)] text-[var(--primary)] border border-[var(--border)] font-semibold shadow-2xs">
                        {kc}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Interactive Curiosity Questions */}
            <div>
              <div className="text-[11px] font-mono text-[var(--muted-foreground)] uppercase tracking-wider mb-2 flex items-center">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500 mr-1" />
                Click to explore follow-up questions:
              </div>
              <div className="flex flex-wrap gap-2">
                {tutorResponse.suggestedQuestions?.map((sq: string, i: number) => (
                  <button
                    key={i}
                    disabled={tutorLoading}
                    onClick={() => {
                      handleAskTutor(sq);
                    }}
                    className="text-xs text-[var(--foreground)] hover:text-[var(--signal)] bg-[var(--card)] hover:bg-[var(--secondary)] border border-[var(--border)] px-3.5 py-1.5 rounded-full text-left transition-all disabled:opacity-40 cursor-pointer shadow-2xs font-medium hover:border-[var(--signal)]"
                  >
                    💡 {sq}
                  </button>
                ))}
              </div>
            </div>

            {/* Starter Prompt Chips */}
            <div>
              <div className="text-[10px] font-mono text-[var(--muted-foreground)] uppercase tracking-wider mb-1.5">
                Popular Student Questions (Click to Ask Live):
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "Why is Antarctic ice fresh water and not salty ocean water?",
                  "Why does ice float on water and how does that help fish under ice?",
                  "How do emperor penguins keep their eggs from freezing at -60°C?",
                  "What do Indian scientists eat and do during 6 months of dark night at Bharati?"
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    disabled={tutorLoading}
                    onClick={() => handleAskTutor(chip)}
                    className="text-[11px] text-[var(--muted-foreground)] hover:text-[var(--foreground)] bg-[var(--secondary)]/60 hover:bg-[var(--secondary)] px-3 py-1 rounded-full border border-[var(--border)] transition-all text-left cursor-pointer"
                  >
                    ❄️ {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Box */}
            <div className="relative pt-2">
              <input
                type="text"
                value={tutorQuestion}
                onChange={(e) => setTutorQuestion(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAskTutor(tutorQuestion)}
                placeholder="Type ANY question here (e.g. Why don't penguins get frostbite on their feet?)..."
                className="w-full bg-[var(--card)] border border-[var(--border)] rounded-xl pl-4 pr-24 py-3 text-xs text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:border-[var(--ring)] shadow-xs"
              />
              <button
                disabled={tutorLoading || !tutorQuestion.trim()}
                onClick={() => handleAskTutor(tutorQuestion)}
                className="absolute right-2 top-1/2 translate-y-[-25%] px-4 py-1.5 rounded-lg bg-[var(--primary)] hover:bg-[var(--deep)] text-[var(--primary-foreground)] font-bold text-xs flex items-center space-x-1.5 shadow-xs disabled:opacity-40 transition-all cursor-pointer hover:shadow-xs"
              >
                <span>Ask</span>
                <Send className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Right Column: Polar Quiz & Quick Curiosity Cards (4 Cols) */}
          <div className="lg:col-span-4 space-y-5">
            {/* Session History Log */}
            {questionHistory.length > 0 && (
              <div className="bg-[var(--card)] rounded-xl p-5 border border-[var(--border)] space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[var(--foreground)] font-mono uppercase">
                    Your Inquiries This Session ({questionHistory.length})
                  </h4>
                  <span className="text-[10px] font-mono text-[var(--signal)] font-bold">Live History</span>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {questionHistory.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setLastAskedQuestion(item.question);
                        setTutorResponse({
                          response: item.answer,
                          keyConcepts: ["Session History", item.level],
                          suggestedQuestions: tutorResponse.suggestedQuestions,
                          modelUsed: item.model || 'Groq (openai/gpt-oss-120b Live LLM)'
                        });
                      }}
                      className="w-full text-left p-2.5 rounded-[var(--radius)] bg-[var(--secondary)]/40 hover:bg-[var(--secondary)] border border-[var(--border)] text-xs text-[var(--foreground)] transition-all flex items-center justify-between group cursor-pointer"
                    >
                      <span className="truncate pr-2 text-[11px] group-hover:text-[var(--signal)]">
                        💬 {item.question}
                      </span>
                      <ArrowRight className="w-3 h-3 text-[var(--muted-foreground)] group-hover:text-[var(--signal)] flex-shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-[var(--card)] rounded-[var(--radius)] p-5 border border-[var(--border)] space-y-3 shadow-xs">
              <h4 className="text-xs font-bold text-[var(--foreground)] font-mono uppercase">
                Explore Topic Quizzes
              </h4>
              <p className="text-[11px] text-[var(--muted-foreground)]">
                Click any topic to dynamically load tailored questions into the Interactive Quiz:
              </p>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    handleGenerateTopicQuiz('Antarctic Wildlife & Marine Ecosystems');
                    setActiveSubTab('quiz');
                  }}
                  className="w-full text-left p-3 rounded-[var(--radius)] bg-[var(--secondary)]/40 hover:bg-[var(--secondary)] border border-[var(--border)] text-xs text-[var(--foreground)] transition-all flex items-center justify-between cursor-pointer"
                >
                  <span className="font-medium">🦭 Antarctic Seals & Krill Food Web</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[var(--signal)]" />
                </button>
                <button
                  onClick={() => {
                    handleGenerateTopicQuiz('Deep Ice Cores & Paleoclimate');
                    setActiveSubTab('quiz');
                  }}
                  className="w-full text-left p-3 rounded-[var(--radius)] bg-[var(--secondary)]/40 hover:bg-[var(--secondary)] border border-[var(--border)] text-xs text-[var(--foreground)] transition-all flex items-center justify-between cursor-pointer"
                >
                  <span className="font-medium">🧊 Ice Cores & Climate History</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[var(--signal)]" />
                </button>
              </div>
            </div>

            <div className="bg-[var(--card)] rounded-[var(--radius)] p-5 border border-[var(--border)] text-xs text-[var(--foreground)] space-y-2 shadow-xs">
              <span className="font-bold text-[var(--signal)] font-mono block">Did You Know?</span>
              <p className="text-[11px] text-[var(--muted-foreground)] leading-relaxed font-light">
                Antarctica holds approximately 70% of Earth's fresh water and 90% of all planetary ice. If the entire Antarctic ice sheet melted, global sea levels would rise by nearly 58 meters!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Sub-tab 2: Interactive Polar Science Quiz */}
      {activeSubTab === 'quiz' && (
        <div className="bg-[var(--card)] rounded-2xl p-6 sm:p-8 border border-[var(--border)] max-w-4xl mx-auto flex flex-col justify-between min-h-[450px] shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-[var(--border)] pb-4">
              <div className="flex items-center space-x-2">
                <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-700">
                  <HelpCircle className="w-4 h-4" />
                </span>
                <span className="text-xs font-mono uppercase font-bold text-[var(--foreground)]">
                  Polar Science Quiz • Question {currentQIndex + 1} of {activeQuizQuestions.length}
                </span>
              </div>
              <span className="text-xs font-mono text-[var(--foreground)] bg-[var(--secondary)] px-3 py-1 rounded-full border border-[var(--border)] font-bold">
                Score: {score} / {activeQuizQuestions.length}
              </span>
            </div>

            {!quizCompleted ? (
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[var(--foreground)] mb-5 leading-snug">
                  {activeQuizQuestions[currentQIndex]?.question}
                </h3>

                <div className="space-y-2.5 mb-6">
                  {activeQuizQuestions[currentQIndex]?.options.map((opt, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = idx === activeQuizQuestions[currentQIndex].correct;

                    let btnStyle = "bg-[var(--card)] hover:bg-[var(--secondary)] border-[var(--border)] text-[var(--foreground)]";
                    if (showResult) {
                      if (isCorrect) {
                        btnStyle = "bg-emerald-50 border-emerald-400 text-emerald-900 font-semibold";
                      } else if (isSelected && !isCorrect) {
                        btnStyle = "bg-rose-50 border-rose-400 text-rose-900";
                      } else {
                        btnStyle = "bg-[var(--secondary)]/30 border-[var(--border)] text-[var(--muted-foreground)] opacity-50";
                      }
                    }

                    return (
                      <button
                        key={idx}
                        disabled={showResult}
                        onClick={() => handleSelectOption(idx)}
                        className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between cursor-pointer shadow-2xs hover:shadow-xs ${btnStyle}`}
                      >
                        <span>{opt}</span>
                        {showResult && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                        {showResult && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-600" />}
                      </button>
                    );
                  })}
                </div>

                {showResult && (
                  <div className="bg-[var(--secondary)]/40 rounded-xl p-4 border border-[var(--border)] mb-6 text-xs text-[var(--foreground)] leading-relaxed">
                    <span className="font-bold text-[var(--signal)] block mb-1">Scientific Explanation:</span>
                    {activeQuizQuestions[currentQIndex].explanation}
                  </div>
                )}
              </div>
            ) : (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[var(--secondary)] text-[var(--signal)] flex items-center justify-center mx-auto border border-[var(--border)] shadow-xs">
                  <Award className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-[var(--foreground)]">Quiz Completed!</h3>
                <p className="text-sm text-[var(--foreground)]">
                  You scored <strong className="text-[var(--signal)]">{score} out of {activeQuizQuestions.length}</strong>!
                </p>
                <div className="text-xs text-[var(--muted-foreground)] max-w-md mx-auto font-light">
                  {score >= 3
                    ? "Outstanding! You possess advanced knowledge of India's polar research initiatives and cryospheric science."
                    : "Great effort! Check out the AI Tutor and Scientific Catalogue to sharpen your knowledge."}
                </div>
                <button
                  onClick={handleRestartQuiz}
                  className="px-6 py-2.5 rounded-[var(--radius)] bg-[var(--primary)] hover:bg-[var(--deep)] text-[var(--primary-foreground)] font-bold text-xs shadow-xs inline-flex items-center space-x-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Try Again</span>
                </button>
              </div>
            )}
          </div>

          {!quizCompleted && showResult && (
            <div className="border-t border-[var(--border)] pt-4 flex justify-end">
              <button
                onClick={handleNextQuestion}
                className="px-5 py-2 rounded-[var(--radius)] bg-[var(--primary)] hover:bg-[var(--deep)] text-[var(--primary-foreground)] font-bold text-xs flex items-center space-x-1.5 shadow-xs cursor-pointer"
              >
                <span>{currentQIndex === activeQuizQuestions.length - 1 ? 'Finish Quiz' : 'Next Question'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Sub-tab 3: Interactive Polar Albedo Simulator */}
      {activeSubTab === 'simulator' && (
        <div className="bg-[var(--card)] rounded-2xl p-6 sm:p-8 border border-[var(--border)] max-w-4xl mx-auto space-y-6 shadow-xs">
          <div className="flex items-center space-x-2 text-[var(--signal)]">
            <Sun className="w-5 h-5" />
            <h3 className="text-base sm:text-lg font-bold text-[var(--foreground)] uppercase tracking-wider font-mono">
              Interactive Polar Albedo & Energy Balance Simulator
            </h3>
          </div>

          <p className="text-xs text-[var(--muted-foreground)] leading-relaxed font-light">
            Drag the slider to adjust polar ice cover percentage and observe how the planet's solar reflectivity (Albedo) protects global climate stability.
          </p>

          <div className="bg-[var(--secondary)]/40 p-5 rounded-xl border border-[var(--border)] space-y-3">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[var(--muted-foreground)]">Polar Ice Sheet Coverage:</span>
              <span className="text-[var(--signal)] font-bold text-sm">{iceCoverage}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={iceCoverage}
              onChange={(e) => setIceCoverage(Number(e.target.value))}
              className="w-full h-2 rounded bg-[var(--border)] appearance-none cursor-pointer accent-[var(--signal)]"
            />
            <div className="flex justify-between text-[10px] text-[var(--muted-foreground)] font-mono">
              <span>0% (Open Dark Ocean)</span>
              <span>100% (Pristine Ice Sheet)</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center font-mono">
            <div className="bg-[var(--secondary)]/30 p-4 rounded-xl border border-[var(--border)]">
              <div className="text-3xl font-extrabold text-[var(--primary)]">{reflectedRadiation} <span className="text-xs font-normal">W/m²</span></div>
              <div className="text-xs text-[var(--muted-foreground)] mt-1">Reflected to Space (Cooling)</div>
            </div>

            <div className="bg-[var(--secondary)]/30 p-4 rounded-xl border border-[var(--border)]">
              <div className="text-3xl font-extrabold text-[var(--signal)]">{absorbedHeat} <span className="text-xs font-normal">W/m²</span></div>
              <div className="text-xs text-[var(--muted-foreground)] mt-1">Absorbed in Ocean (Warming)</div>
            </div>
          </div>

          <div className="bg-[var(--secondary)]/50 rounded-xl p-4 border border-[var(--border)] text-xs text-[var(--foreground)] space-y-1.5">
            <div className="font-bold text-[var(--foreground)] font-mono flex items-center">
              <Sparkles className="w-3.5 h-3.5 text-[var(--signal)] mr-1.5" />
              The Polar Feedback Loop Explained:
            </div>
            <p className="text-xs text-[var(--muted-foreground)] leading-relaxed font-light">
              As white reflective ice melts into dark open ocean, solar absorption increases from {Math.round(1000 - (100 * 0.85 * 10))} W/m² to {Math.round(1000 - (0 * 0.85 + 100 * 0.10 * 10))} W/m², accelerating warming. Indian polar research at Maitri and Himadri monitors this balance continuously.
            </p>
          </div>
        </div>
      )}

      {/* Standardized Bottom Container */}
      <div className="bottom-box-container">
        <div className="flex items-start gap-4">
          <div className="bottom-box-icon">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-[var(--foreground)]">National Educational Curriculum Alignment & Polar Mentorship</h4>
            <p className="text-xs leading-relaxed text-[var(--muted-foreground)]">
              The Smart Education Hub links India’s school science curricula (NCERT / CBSE / State Boards) directly with active Indian polar research missions. Dr. Penguin utilizes pedagogical adaptation protocols to present cryospheric dynamics, Antarctic treaty ethics, and climate physics across age-appropriate comprehension levels.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
