
import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const processContent = (text: string) => {
    return text.split('\n').map((line, idx) => {
      // Basic headers
      if (line.startsWith('### ')) return <h3 key={idx} className="serif text-2xl font-bold mt-10 mb-4 text-black italic">{line.replace('### ', '')}</h3>;
      if (line.startsWith('## ')) return <h2 key={idx} className="serif text-3xl font-black mt-12 mb-6 text-black uppercase tracking-tighter border-b-4 border-black inline-block">{line.replace('## ', '')}</h2>;
      if (line.startsWith('# ')) return <h1 key={idx} className="serif text-5xl font-black mt-14 mb-8 text-black uppercase">{line.replace('# ', '')}</h1>;
      
      // Tables (Styling for high fashion feel)
      if (line.startsWith('|')) {
        const cells = line.split('|').filter(s => s.trim());
        if (cells.some(c => c.includes('---'))) return null; // Skip separator row
        
        return (
          <div key={idx} className="my-4 overflow-x-auto">
            <table className="w-full border-collapse">
              <tbody>
                <tr className="border-b border-gray-200 group hover:bg-gray-50 transition-colors">
                  {cells.map((cell, cIdx) => (
                    <td key={cIdx} className={`py-4 px-4 text-sm ${cIdx === 0 ? 'font-mono font-bold text-black uppercase' : 'text-gray-600'}`}>
                      {formatInlines(cell.trim())}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        );
      }

      // Lists
      if (line.startsWith('- ')) return (
        <li key={idx} className="ml-4 mb-4 text-gray-700 list-none flex gap-3">
          <span className="text-black font-black">/</span>
          <span>{formatInlines(line.replace('- ', ''))}</span>
        </li>
      );

      // Paragraphs
      const trimmed = line.trim();
      if (!trimmed) return <div key={idx} className="h-4" />;
      
      return <p key={idx} className="mb-6 text-gray-700 leading-relaxed text-base font-light">{formatInlines(line)}</p>;
    });
  };

  const formatInlines = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold text-black">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return <div className="markdown-interpretation">{processContent(content)}</div>;
};

export default MarkdownRenderer;
