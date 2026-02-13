import React, { useEffect, useRef } from 'react';

interface PreviewFrameProps {
  html: string;
  title?: string;
}

export const PreviewFrame: React.FC<PreviewFrameProps> = ({ html, title = "View" }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.srcdoc = html;
    }
  }, [html]);

  if (!html) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#111] rounded-3xl border border-gray-800">
        <div className="text-center space-y-6">
           <div className="w-24 h-24 rounded-full border border-dashed border-gray-800 flex items-center justify-center mx-auto animate-pulse">
              <span className="font-serif italic text-2xl text-gray-700">S.</span>
           </div>
           <div>
               <p className="text-sm uppercase tracking-[0.2em] text-gray-500">Awaiting Input</p>
               <p className="text-xs text-gray-700 mt-2 font-mono">Render engine ready</p>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-[#111] rounded-3xl border border-gray-800 overflow-hidden flex flex-col relative shadow-2xl">
      <div className="h-12 bg-[#111] border-b border-gray-800 flex items-center px-6 justify-between">
          <div className="flex space-x-2">
             <div className="w-2 h-2 rounded-full bg-red-900/50 border border-red-900"></div>
             <div className="w-2 h-2 rounded-full bg-yellow-900/50 border border-yellow-900"></div>
             <div className="w-2 h-2 rounded-full bg-green-900/50 border border-green-900"></div>
          </div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500">{title}</span>
          <div className="w-10"></div> {/* Spacer */}
      </div>
      <iframe
        ref={iframeRef}
        title="Site Preview"
        className="w-full flex-1 border-none bg-white"
        sandbox="allow-scripts" 
      />
    </div>
  );
};