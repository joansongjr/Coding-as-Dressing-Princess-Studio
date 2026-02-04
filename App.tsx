
import React, { useState, useEffect } from 'react';
import { processNaturalLanguageCommand, generateAestheticImage } from './geminiService';
import MarkdownRenderer from './components/MarkdownRenderer';
import FileExplorer from './components/FileExplorer';
import { FileEntry, AnalysisResult } from './types';

const App: React.FC = () => {
  const [command, setCommand] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [visualImage, setVisualImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const [files, setFiles] = useState<FileEntry[]>([
    { id: '1', name: 'main.py', language: 'python', content: '# Welcome to Princess Studio\n# Your logic will materialize here...' },
    { id: '2', name: 'styles.css', language: 'css', content: '/* Royal aesthetic definitions */' },
    { id: '3', name: 'README.md', language: 'markdown', content: '# Project Rose\nA high-fashion coding journey.' }
  ]);
  const [activeFileId, setActiveFileId] = useState('1');

  const activeFile = files.find(f => f.id === activeFileId) || files[0];

  useEffect(() => {
    const initPrincess = async () => {
      try {
        const pajamaPrompt = "A beautiful anime girl wearing elegant white silk pajamas, messy hair, waking up in a royal bedroom, Princess Maker 4 style, soft morning light.";
        const imageUrl = await generateAestheticImage(pajamaPrompt);
        setVisualImage(imageUrl);
      } catch (err) {
        console.error("Failed to load initial princess", err);
      } finally {
        setIsInitializing(false);
      }
    };
    initPrincess();
  }, []);

  const handleExecute = async () => {
    if (!command.trim()) return;
    
    setIsAnalyzing(true);
    setError(null);

    try {
      const data = await processNaturalLanguageCommand(command);
      setResult(data);

      setFiles(prev => prev.map(f => 
        f.id === activeFileId ? { ...f, content: data.generatedCode } : f
      ));

      const imageUrl = await generateAestheticImage(data.imagePrompt);
      setVisualImage(imageUrl);
    } catch (err: any) {
      setError(err.message || "魔法裁缝店暂时休止，请稍后再试。");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#fffaf5] text-[#3e2723] overflow-hidden">
      {/* Header */}
      <header className="h-14 bg-white border-b border-[#e2d1c3] flex items-center justify-between px-6 shrink-0 z-30">
        <div className="flex items-center gap-6">
          <div className="text-xl font-black italic tracking-tighter serif text-[#d4af37]">Princess Studio</div>
          <div className="h-4 w-[1px] bg-[#e2d1c3]"></div>
          <div className="hidden md:flex items-center gap-3">
             <span className="text-[9px] tracking-[0.2em] font-bold text-gray-400 uppercase">Aesthetic IDE v2.5</span>
             <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400/20"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-400/20"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-green-400/20"></div>
             </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <div className="text-[10px] font-serif italic text-[#8d6e63]">Princess Maker 4 Mode Active</div>
           <div className="w-8 h-8 rounded-full border border-[#e2d1c3] flex items-center justify-center overflow-hidden bg-[#fdf2f2]">
              <span className="text-[8px] font-bold text-[#d4af37]">USER</span>
           </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Sidebar */}
        <FileExplorer 
          files={files} 
          activeFileId={activeFileId} 
          onFileSelect={setActiveFileId} 
        />

        {/* Workspace Area */}
        <main className="flex-1 flex flex-col overflow-hidden bg-white">
          
          {/* Input Bar */}
          <div className="p-4 border-b border-[#e2d1c3] bg-white flex items-center gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleExecute()}
                placeholder="在此输入您的魔法蓝图，例如：创建一个优雅的登录界面逻辑..."
                className="w-full pl-4 pr-12 py-2.5 text-sm border border-[#e2d1c3] bg-[#fdfdfd] rounded serif italic focus:outline-none focus:ring-1 focus:ring-[#d4af37] transition-all"
              />
              <div className="absolute right-3 top-2.5 opacity-20 pointer-events-none">
                <kbd className="text-[10px] border px-1 rounded font-sans">Enter</kbd>
              </div>
            </div>
            <button
              onClick={handleExecute}
              disabled={isAnalyzing || isInitializing}
              className="px-8 py-2.5 bg-[#d4af37] text-white font-bold uppercase tracking-[0.2em] text-[10px] rounded hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {isAnalyzing ? '裁缝制作中...' : '开始魔法'}
            </button>
          </div>

          {/* Vertical Scrollable Content */}
          <div className="flex-1 overflow-y-auto bg-[#fafafa]">
            
            {/* TOP MODULE: The Princess (Magic Mirror) */}
            <section className="p-8 border-b border-[#e2d1c3] bg-gradient-to-b from-white to-[#fffaf5] flex flex-col items-center">
              <div className="text-[9px] font-bold tracking-[0.5em] text-[#d4af37] uppercase mb-6 italic">— Magic Mirror View / 视觉预览 —</div>
              
              <div className="flex flex-col lg:flex-row items-center justify-center gap-12 w-full max-w-6xl">
                {/* Image Card */}
                <div className="pm-card p-1.5 ornate-border shadow-2xl relative">
                  {isInitializing ? (
                    <div className="w-48 h-64 bg-gray-50 flex items-center justify-center animate-pulse">
                      <span className="text-[10px] italic text-gray-300">Summoning...</span>
                    </div>
                  ) : (
                    <img 
                      src={visualImage || ''} 
                      alt="Princess" 
                      className="max-h-[50vh] min-h-[300px] object-contain rounded shadow-inner"
                    />
                  )}
                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-white/40 backdrop-blur-sm flex items-center justify-center rounded">
                      <div className="w-10 h-10 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>

                {/* Attributes Overlay */}
                <div className={`w-full max-w-xs space-y-6 transition-all duration-700 ${result ? 'opacity-100 translate-x-0' : 'opacity-20 translate-x-4'}`}>
                  <div className="serif italic text-2xl border-b border-[#e2d1c3] pb-2 text-[#8d6e63]">Atelier Stats</div>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px] font-bold uppercase text-[#8d6e63]">Elegance / 优雅度</div>
                      <div className="attribute-bar"><div className="attribute-fill" style={{width: `${result?.attributes.elegance || 0}%`}}></div></div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px] font-bold uppercase text-[#8d6e63]">Clarity / 逻辑清晰</div>
                      <div className="attribute-bar"><div className="attribute-fill" style={{width: `${result?.attributes.clarity || 0}%`}}></div></div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px] font-bold uppercase text-[#8d6e63]">Power / 运行效能</div>
                      <div className="attribute-bar"><div className="attribute-fill" style={{width: `${result?.attributes.power || 0}%`}}></div></div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* BOTTOM MODULE: Split Result Pane (Code & Analysis) */}
            <section className="flex flex-col md:flex-row min-h-[600px]">
              
              {/* Left Side: Code Editor Area */}
              <div className="flex-1 border-r border-[#e2d1c3] bg-[#1e1e1e] flex flex-col">
                <div className="h-9 bg-[#252526] border-b border-black/20 flex items-center px-4 justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] bg-white/10 text-white/40 px-1.5 py-0.5 rounded font-mono font-bold uppercase">
                      {activeFile.name.split('.').pop()}
                    </span>
                    <span className="text-[10px] text-gray-300 font-mono">{activeFile.name}</span>
                  </div>
                  <button 
                    onClick={() => navigator.clipboard.writeText(activeFile.content)}
                    className="text-[9px] text-[#d4af37] hover:underline uppercase font-bold tracking-widest"
                  >
                    Copy Code
                  </button>
                </div>
                <div className="flex-1 flex overflow-hidden">
                  <div className="w-10 bg-[#1e1e1e] border-r border-white/5 text-right pr-3 pt-6 text-white/20 font-mono text-[10px] leading-relaxed select-none shrink-0">
                    {activeFile.content.split('\n').map((_, i) => <div key={i}>{i + 1}</div>)}
                  </div>
                  <div className="flex-1 p-6 overflow-auto scrollbar-thin scrollbar-thumb-white/10">
                    <pre className="font-mono text-[11px] leading-relaxed text-[#d4d4d4] whitespace-pre-wrap">
                      {activeFile.content}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Right Side: Fashion Interpretation Area */}
              <div className="flex-1 bg-white flex flex-col">
                <div className="h-9 bg-[#fdf2f2] border-b border-[#e2d1c3] flex items-center px-6">
                  <span className="text-[9px] font-bold tracking-[0.2em] text-[#8d6e63] uppercase italic">Atelier Interpretation / 变装报告</span>
                </div>
                <div className="flex-1 p-10 overflow-auto scrollbar-thin">
                  {result ? (
                    <div className="animate-fade-in max-w-2xl mx-auto">
                      <div className="serif text-4xl font-bold mb-4 italic text-[#3e2723]">裁缝笔记</div>
                      <div className="w-10 h-0.5 bg-[#d4af37] mb-8"></div>
                      <MarkdownRenderer content={result.fashionInterpretation} />
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center opacity-20 text-center px-12">
                      <p className="serif text-3xl italic mb-3">Awaiting your design...</p>
                      <p className="text-[10px] font-bold uppercase tracking-[0.3em]">We weave algorithms into silk and logic into lace.</p>
                    </div>
                  )}
                </div>
              </div>

            </section>
          </div>
        </main>
      </div>

      {/* OS Footer */}
      <footer className="h-6 bg-[#d4af37] text-white flex items-center justify-between px-4 text-[9px] font-sans font-bold uppercase tracking-widest shrink-0">
        <div className="flex items-center gap-4">
          <span>Main Branch*</span>
          <span className="opacity-70">Ln 1, Col 1</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="opacity-70">PRINCESS_V2.5</span>
          <span className="bg-white/20 px-2">Ready</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
