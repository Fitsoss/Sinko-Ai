import React, { useState, useCallback, useEffect } from 'react';
import { PreviewFrame } from './components/PreviewFrame';
import { ChatInterface } from './components/ChatInterface';
import { generateWebsite } from './services/geminiService';
import { authService } from './services/authService';
import { ChatMessage, GeneratedSite, AppState, User } from './types';
import { Button } from './components/Button';

// --- MODALS (UPDATED FOR DARK THEME) ---

const ModalLayout = ({ title, onClose, children }: { title: string, onClose: () => void, children?: React.ReactNode }) => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[60] flex items-center justify-center p-6 animate-fade-in" onClick={onClose}>
        <div className="max-w-2xl w-full bg-[#0f0f0f] shadow-[0_0_50px_rgba(0,0,0,0.5)] p-12 border border-gray-800 relative text-white" onClick={e => e.stopPropagation()}>
            <button onClick={onClose} className="absolute top-8 right-8 p-2 hover:bg-white/10 rounded-full transition-colors text-gray-500 hover:text-white">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h2 className="font-serif text-5xl italic tracking-wide mb-12 text-white">{title}</h2>
            <div className="space-y-6 text-gray-400 font-light leading-relaxed text-lg">
                {children}
            </div>
        </div>
    </div>
);

const AboutModal = ({ onClose }: { onClose: () => void }) => (
    <ModalLayout title="About Sinko." onClose={onClose}>
        <p>
            Sinko is an experimental interface exploring the intersection of generative AI and high-end design principles.
        </p>
        <p>
            We believe that the future of web creation isn't about drag-and-drop, but about conversation and intent. 
            By stripping away the UI clutter, we allow you to focus purely on the aesthetic and structural goals of your project.
        </p>
        <div className="pt-8 border-t border-gray-800 mt-8 flex gap-12">
                <div>
                <h4 className="text-xs uppercase tracking-widest font-bold text-white mb-2">Version</h4>
                <span className="font-mono text-sm text-gray-500">2.0.4 (Dark)</span>
                </div>
                <div>
                <h4 className="text-xs uppercase tracking-widest font-bold text-white mb-2">Stack</h4>
                <span className="font-mono text-sm text-gray-500">Gemini 3 / React</span>
                </div>
        </div>
    </ModalLayout>
);

const ConceptModal = ({ onClose }: { onClose: () => void }) => (
    <ModalLayout title="The Concept." onClose={onClose}>
        <p>
            Traditional web builders force you to think in "blocks". Sinko forces you to think in <strong className="text-white">identity</strong> and <strong className="text-white">purpose</strong>.
        </p>
        <p>
            Our AI doesn't just assemble code; it interprets the "vibe". Whether you need "Brutalist Corporate" or "Soft Editorial", Sinko translates abstract adjectives into concrete CSS properties.
        </p>
        <p className="italic text-white mt-4 border-l-2 border-white pl-4">
            "Design is intelligence made visible."
        </p>
    </ModalLayout>
);

const StructureModal = ({ onClose }: { onClose: () => void }) => (
    <ModalLayout title="The Structure." onClose={onClose}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-4">
            <div>
                <h3 className="font-serif text-2xl mb-2 text-white">01. Generator</h3>
                <p className="text-sm">
                    Powered by Google's Gemini 3 Flash, our engine generates semantic, accessible HTML5 markup in real-time.
                </p>
            </div>
            <div>
                <h3 className="font-serif text-2xl mb-2 text-white">02. Styling</h3>
                <p className="text-sm">
                    Utility-first architecture using Tailwind CSS ensures that every generated pixel is responsive and lightweight.
                </p>
            </div>
            <div>
                <h3 className="font-serif text-2xl mb-2 text-white">03. Context</h3>
                <p className="text-sm">
                    The chat interface maintains a sliding window of context, allowing for iterative refinements.
                </p>
            </div>
            <div>
                <h3 className="font-serif text-2xl mb-2 text-white">04. Export</h3>
                <p className="text-sm">
                    Your data belongs to you. Export to raw HTML or push directly to GitHub repositories.
                </p>
            </div>
        </div>
    </ModalLayout>
);

// --- LANDING PAGE COMPONENT (RE-DESIGNED) ---
const LandingPage = ({ 
    onEnter, 
    onAbout,
    onConcept,
    onStructure
}: { 
    onEnter: () => void, 
    onAbout: () => void,
    onConcept: () => void,
    onStructure: () => void
}) => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans overflow-x-hidden selection:bg-white selection:text-black">
      {/* Nav */}
      <nav className="fixed top-0 w-full px-8 md:px-16 py-8 flex justify-between items-center z-50 mix-blend-difference">
        <div className="flex items-center gap-4">
             <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center">
                <span className="font-serif italic text-lg">S</span>
             </div>
             <span className="text-xs uppercase tracking-[0.3em] font-medium hidden md:inline">Sinko AI / Agency</span>
        </div>

        {/* Navigation moved to top */}
        <div className="hidden md:flex space-x-12 text-[10px] font-bold tracking-widest uppercase text-gray-400">
          <button onClick={onConcept} className="hover:text-white transition-colors">Concept</button>
          <button onClick={onStructure} className="hover:text-white transition-colors">Structure</button>
          <button onClick={onAbout} className="hover:text-white transition-colors">About</button>
        </div>

        <div className="flex items-center gap-8">
            <button onClick={onEnter} className="bg-white text-black px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-transform shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                Work with AI
            </button>
        </div>
      </nav>

      <main className="relative min-h-screen flex flex-col justify-center px-4 md:px-16 pt-20">
         
         {/* Top Section / Title - Reduced Size */}
         <div className="relative z-10 text-center mb-8 md:mb-12">
            <p className="text-[10px] uppercase tracking-[0.5em] text-gray-500 mb-4 animate-fade-in">Neural Design System</p>
            <h1 className="font-serif text-[10vw] md:text-[8vw] leading-[0.9] font-normal text-white mix-blend-exclusion animate-slide-up">
               SINKO<span className="italic font-light opacity-50">AI</span>
            </h1>
         </div>

         {/* Layout Grid */}
         <div className="grid grid-cols-1 md:grid-cols-12 gap-8 relative z-10 w-full max-w-[1800px] mx-auto pb-20">
             
             {/* Left Text Block */}
             <div className="md:col-span-4 flex flex-col justify-end pb-12 animate-slide-up" style={{animationDelay: '0.2s'}}>
                 <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 mb-6">The Touch of Intelligence</h2>
                 <p className="text-xl md:text-2xl font-light text-gray-200 leading-relaxed mb-8 font-serif italic">
                     Combining neural networks and elegance. Transforming natural language into digital experiences through pure structure.
                 </p>
                 <div>
                    <button onClick={onEnter} className="group flex items-center gap-4 text-xs uppercase tracking-widest hover:text-gray-400 transition-colors">
                        <span>Explore Builder</span>
                        <div className="w-12 h-[1px] bg-white group-hover:w-20 transition-all"></div>
                    </button>
                 </div>
             </div>

             {/* Middle/Right Image Composition */}
             <div className="md:col-span-8 relative h-[60vh] md:h-[80vh]">
                 
                 {/* Main Large Image */}
                 <div className="absolute right-0 top-0 w-[90%] h-[90%] overflow-hidden rounded-sm grayscale contrast-125 brightness-75 hover:brightness-100 transition-all duration-1000">
                    <img 
                        src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" 
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-[2s]" 
                        alt="Abstract Dark Form" 
                    />
                    {/* View Demo Website Button on Image */}
                    <div className="absolute bottom-8 left-8 z-30">
                        <button 
                            onClick={onEnter}
                            className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-full hover:bg-white hover:text-black transition-all group"
                        >
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="text-[10px] uppercase tracking-widest font-bold">View Demo Site</span>
                            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </button>
                    </div>

                    <div className="absolute top-8 right-8 text-right">
                        <p className="text-white text-xs uppercase tracking-widest">Menu</p>
                    </div>
                 </div>

                 {/* Overlapping Small Image */}
                 <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-black p-2 z-20">
                    <div className="w-full h-full overflow-hidden grayscale relative group">
                        <img 
                            src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2574&auto=format&fit=crop" 
                            className="w-full h-full object-cover" 
                            alt="AI Detail" 
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={onEnter}>
                            <span className="text-xs uppercase tracking-widest text-white border border-white px-4 py-2 rounded-full">Enter Studio</span>
                        </div>
                    </div>
                 </div>
                 
                 {/* Decorative Circle/Graphic */}
                 <div className="absolute top-1/2 left-1/4 w-32 h-32 border border-white/20 rounded-full animate-pulse hidden md:block pointer-events-none"></div>

             </div>
         </div>
         
         <div className="fixed bottom-8 left-8 hidden lg:block">
            <p className="text-[10px] text-gray-600 uppercase tracking-widest">Timeless Natural Code</p>
         </div>

      </main>
    </div>
  );
};

// --- AUTH / LOGIN MODAL (UPDATED DARK) ---
const AuthModal = ({ onSuccess, onClose }: { onSuccess: (user: User) => void, onClose: () => void }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
      setError('');
      try {
          if (isLogin) {
              const user = authService.login(email, password);
              onSuccess(user);
          } else {
              const user = authService.register(email, password);
              onSuccess(user);
          }
      } catch (err: any) {
          setError(err.message);
      }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-fade-in">
       <div className="bg-[#111] p-8 md:p-12 w-full max-w-md shadow-2xl border border-gray-800 relative">
          <div className="flex justify-between items-start mb-8">
             <h2 className="font-serif text-3xl italic text-white">{isLogin ? 'Welcome back.' : 'Join Sinko.'}</h2>
             <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">✕</button>
          </div>
          
          {error && (
              <div className="mb-4 p-3 bg-red-900/20 border border-red-900 text-red-400 text-xs">
                  {error}
              </div>
          )}

          <div className="space-y-6">
             <div className="space-y-1">
               <label className="text-xs uppercase tracking-widest font-medium text-gray-500">Email</label>
               <input 
                 type="email" 
                 value={email}
                 onChange={e => setEmail(e.target.value)}
                 className="w-full border-b border-gray-700 py-2 focus:outline-none focus:border-white transition-colors bg-transparent font-medium text-white placeholder-gray-700" 
                 placeholder="name@example.com" 
               />
             </div>
             <div className="space-y-1">
               <label className="text-xs uppercase tracking-widest font-medium text-gray-500">Password</label>
               <input 
                 type="password" 
                 value={password}
                 onChange={e => setPassword(e.target.value)}
                 className="w-full border-b border-gray-700 py-2 focus:outline-none focus:border-white transition-colors bg-transparent font-medium text-white placeholder-gray-700" 
                 placeholder="••••••••" 
               />
             </div>
             
             <button onClick={handleSubmit} className="w-full bg-white text-black py-4 text-xs font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors mt-4">
               {isLogin ? 'Enter Studio' : 'Create Account'}
             </button>

             <div className="text-center pt-2">
                 <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="text-xs text-gray-500 hover:text-white underline">
                     {isLogin ? "New here? Create an account" : "Already have an account? Login"}
                 </button>
             </div>
          </div>
       </div>
    </div>
  )
}

// --- GITHUB MODAL (UPDATED DARK) ---
const GithubModal = ({ onClose, onUpload }: { onClose: () => void, onUpload: (repo: string) => void }) => {
    const [repoName, setRepoName] = useState('');
    const [loading, setLoading] = useState(false);

    const handleUpload = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            onUpload(repoName);
        }, 2000);
    }

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#111] p-8 w-full max-w-md shadow-xl rounded-2xl border border-gray-800">
                <h3 className="font-serif text-2xl mb-6 text-white">Deploy to GitHub</h3>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest font-medium text-gray-500">Repository Name</label>
                        <input 
                            value={repoName}
                            onChange={(e) => setRepoName(e.target.value)}
                            className="w-full border border-gray-700 rounded-lg p-3 text-sm focus:outline-none focus:border-white transition-colors bg-transparent text-white" 
                            placeholder="my-portfolio-2024"
                        />
                    </div>
                    <div className="flex justify-end gap-3 mt-8">
                        <button onClick={onClose} className="text-xs uppercase tracking-widest px-4 py-2 hover:bg-white/10 rounded-lg text-white">Cancel</button>
                        <Button onClick={handleUpload} isLoading={loading} disabled={!repoName}>
                            Push
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

// --- MAIN APP (UPDATED CONTAINER STYLES) ---
const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [view, setView] = useState<'landing' | 'app'>('landing');
  
  // Modal States
  const [showAuth, setShowAuth] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showConcept, setShowConcept] = useState(false);
  const [showStructure, setShowStructure] = useState(false);
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentSite, setCurrentSite] = useState<GeneratedSite | null>(null);
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  
  // GitHub State
  const [showGithubModal, setShowGithubModal] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  // Check login on mount
  useEffect(() => {
      const user = authService.getCurrentUser();
      if (user) {
          setCurrentUser(user);
          setView('app'); // Auto skip landing if logged in
      }
  }, []);

  const handleSendMessage = useCallback(async (prompt: string) => {
    const userMsg: ChatMessage = { role: 'user', content: prompt };
    setMessages(prev => [...prev, userMsg]);
    setAppState(AppState.GENERATING);

    try {
      const result = await generateWebsite(prompt);
      setCurrentSite(result);
      
      const assistantMsg: ChatMessage = { 
        role: 'assistant', 
        content: result.explanation || "I've drafted a design based on your requirements.",
        site: result
      };
      
      setMessages(prev => [...prev, assistantMsg]);
      setAppState(AppState.SUCCESS);

    } catch (error) {
      console.error(error);
      const errorMsg: ChatMessage = { 
        role: 'assistant', 
        content: "I encountered a creative block. Please try refining your request." 
      };
      setMessages(prev => [...prev, errorMsg]);
      setAppState(AppState.ERROR);
    }
  }, []);

  const downloadCode = () => {
    if (!currentSite) return;
    const blob = new Blob([currentSite.html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sinko_design.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleGithubUpload = (repo: string) => {
      setShowGithubModal(false);
      setUploadStatus(`Uploaded to ${repo}`);
      setTimeout(() => setUploadStatus(null), 4000);
  };

  const handleLoginSuccess = (user: User) => {
      setCurrentUser(user);
      setShowAuth(false);
      setView('app');
  };
  
  const handleLogout = () => {
      authService.logout();
      setCurrentUser(null);
      setView('landing');
      setMessages([]);
      setCurrentSite(null);
  };

  // View Controller
  if (view === 'landing') {
    return (
      <>
        <LandingPage 
            onEnter={() => setShowAuth(true)} 
            onAbout={() => setShowAbout(true)}
            onConcept={() => setShowConcept(true)}
            onStructure={() => setShowStructure(true)}
        />
        {showAuth && <AuthModal onSuccess={handleLoginSuccess} onClose={() => setShowAuth(false)} />}
        {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
        {showConcept && <ConceptModal onClose={() => setShowConcept(false)} />}
        {showStructure && <StructureModal onClose={() => setShowStructure(false)} />}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans p-4 md:p-6 flex flex-col h-screen overflow-hidden">
      
      {/* App Header */}
      <header className="h-16 flex items-center justify-between mb-4 md:mb-6 px-2">
        <div className="flex items-center gap-4">
          <div className="font-serif text-2xl font-bold italic tracking-tighter cursor-pointer hover:opacity-70 transition-opacity" onClick={() => setView('landing')}>sinko.</div>
          <div className="h-6 w-[1px] bg-gray-800 mx-2"></div>
          <span className="text-xs uppercase tracking-widest text-gray-500">
              User: {currentUser?.name}
          </span>
        </div>
        
        <div className="flex items-center gap-4">
           {uploadStatus && (
               <div className="bg-white text-black px-4 py-2 text-xs uppercase tracking-widest rounded-full animate-fade-in">
                   {uploadStatus}
               </div>
           )}
           
           {currentSite && (
             <div className="flex bg-[#111] p-1 rounded-full border border-gray-800 shadow-sm">
                <button 
                  onClick={() => setViewMode('preview')}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${viewMode === 'preview' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
                >
                  Preview
                </button>
                <button 
                  onClick={() => setViewMode('code')}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${viewMode === 'code' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
                >
                  Code
                </button>
             </div>
           )}
           
           <div className="flex gap-2">
             <Button 
                variant="secondary" 
                disabled={!currentSite}
                onClick={() => setShowGithubModal(true)}
             >
               Deploy
             </Button>
             
             <Button variant="primary" onClick={downloadCode} disabled={!currentSite}>
               Export
             </Button>
             
             <button onClick={handleLogout} className="ml-2 p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white" title="Logout">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
             </button>
           </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <main className="flex-1 flex flex-col md:flex-row gap-6 min-h-0">
        
        {/* Left: Chat / Controls */}
        <section className="w-full md:w-[400px] flex-shrink-0 flex flex-col h-full">
           <ChatInterface 
             messages={messages} 
             onSendMessage={handleSendMessage} 
             appState={appState}
           />
        </section>

        {/* Right: Preview Area */}
        <section className="flex-1 h-full min-w-0 flex flex-col">
          {viewMode === 'preview' ? (
            <PreviewFrame html={currentSite?.html || ''} />
          ) : (
            <div className="w-full h-full bg-[#111] rounded-3xl border border-gray-800 p-0 overflow-hidden flex flex-col shadow-2xl">
               <div className="bg-[#1a1a1a] px-6 py-4 flex items-center justify-between border-b border-gray-800 text-gray-500 text-xs tracking-wider uppercase">
                 <span>source_code.html</span>
                 <button onClick={() => navigator.clipboard.writeText(currentSite?.html || '')} className="hover:text-white">Copy</button>
               </div>
               <pre className="flex-1 overflow-auto p-6 text-sm font-mono text-gray-300 leading-relaxed scrollbar-thin scrollbar-thumb-gray-800">
                 <code>{currentSite?.html}</code>
               </pre>
            </div>
          )}
        </section>

      </main>

      {/* Modals */}
      {showGithubModal && (
          <GithubModal 
            onClose={() => setShowGithubModal(false)} 
            onUpload={handleGithubUpload}
          />
      )}
      
    </div>
  );
};

export default App;