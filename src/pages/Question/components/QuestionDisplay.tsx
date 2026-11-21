import React from 'react';
import { Flag, Star, Users, MessageSquare } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { renderMath } from '@/src/utils/textParser';
import { Question } from '../types';

interface QuestionDisplayProps {
  question: Question;
  currentIndex: number;
  isFlagged: boolean;
  onToggleFlag: () => void;
  onWishlist: () => void;
  onSelection: () => void;
}

const ThreadRenderer = ({ items }: { items: any[] }) => (
  <div className="space-y-4 my-6 p-4 md:p-6 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
    <div className="flex items-center gap-2 mb-4 text-indigo-600 dark:text-indigo-400 font-bold text-sm tracking-wide">
      <MessageSquare className="w-5 h-5" /> Forum Discussion
    </div>
    <div className="space-y-4">
      {items.map((item, idx) => (
        <div key={idx} className="flex gap-4 p-4 bg-white dark:bg-slate-950 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800/50">
          <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5 text-indigo-500" />
          </div>
          <div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="font-bold text-slate-800 dark:text-slate-200">{item.username}</span>
              <span className="text-[10px] text-slate-400 font-medium">{item.postedAt}</span>
            </div>
            <div className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm md:text-base">
              {item.content}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const FlowchartRenderer = ({ items }: { items: any }) => {
  if (!items?.nodes || !items?.edges) return null;
  return (
    <div className="my-6 p-4 md:p-6 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-x-auto custom-scrollbar">
      <div className="min-w-[500px] flex justify-center py-8">
        <div className="flex flex-col items-center gap-6">
          {items.nodes.map((node: any, idx: number) => {
            const outEdges = items.edges.filter((e: any) => e.from === node.id);
            return (
              <div key={node.id} className="flex flex-col items-center">
                <div className="px-6 py-3 bg-white dark:bg-slate-950 border-2 border-indigo-500 rounded-xl text-center shadow-lg font-bold text-slate-800 dark:text-slate-200 max-w-[250px]">
                  {node.label}
                </div>
                {outEdges.map((edge: any, edgeIdx: number) => (
                  <div key={edgeIdx} className="flex flex-col items-center my-2">
                    <div className="h-8 w-0.5 bg-indigo-500 relative">
                       {edge.label && (
                         <span className="absolute top-1/2 left-2 -translate-y-1/2 text-[10px] font-black text-indigo-500 bg-slate-50 dark:bg-slate-900 px-1 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
                           {edge.label}
                         </span>
                       )}
                    </div>
                    <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-transparent border-t-indigo-500" />
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const TableRenderer = ({ data }: { data: any }) => {
  if (!data?.headers || !data?.rows) return null;
  return (
    <div className="my-6 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[600px] md:min-w-0">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
              {data.headers.map((header: string, idx: number) => (
                <th key={idx} className="p-4 text-sm font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
                  {renderMath(header)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-950">
            {data.rows.map((rowObj: any, rowIdx: number) => {
              const cells = Array.isArray(rowObj) ? rowObj : (rowObj.cells || Object.values(rowObj || {}));
              return (
                <tr key={rowIdx} className="border-b border-slate-100 dark:border-slate-800/50 last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                  {cells.map((cell: string, cellIdx: number) => (
                    <td key={cellIdx} className="p-4 text-slate-700 dark:text-slate-300 font-medium">
                      {renderMath(cell)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  currentIndex,
  isFlagged,
  onToggleFlag,
  onWishlist,
  onSelection
}) => {
  return (
    <div className="space-y-6" onMouseUp={onSelection}>
      <div className="flex items-start justify-between gap-4">
         <div className="text-2xl md:text-4xl font-black text-slate-300 dark:text-slate-800 select-none">Q.{currentIndex + 1}</div>
         <div className="flex gap-2">
           <button 
             onClick={onToggleFlag}
             className={cn(
               "p-2 md:p-3 rounded-lg md:rounded-xl border transition-all shadow-sm dark:shadow-none",
               isFlagged 
                 ? "bg-amber-500 text-white border-amber-500" 
                 : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-white"
             )}
           >
             <Flag className="w-5 h-5" />
           </button>
          <button 
            onClick={onWishlist}
            className={cn(
              "p-3 rounded-xl border transition-all shadow-sm dark:shadow-none",
              question.isWishlisted 
                ? "bg-indigo-500 text-white border-indigo-500" 
                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-white"
            )}
          >
             <Star className="w-5 h-5" />
           </button>
         </div>
      </div>

      {question.passage && (
        <div className="p-6 md:p-8 bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/20 rounded-[1.5rem] md:rounded-[2rem]">
          <p className="text-sm font-black text-amber-500 mb-4 uppercase tracking-widest">Informasi Tambahan ━</p>
          <div className="text-base md:text-lg leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
            {question.passage}
          </div>
        </div>
      )}

      {question.questionType === 'thread' && question.metadata?.threadItems && (
        <ThreadRenderer items={question.metadata.threadItems} />
      )}

      {question.questionType === 'table' && question.metadata?.tableData && (
        <TableRenderer data={question.metadata.tableData} />
      )}

      {question.questionType === 'flowchart' && question.metadata?.flowchartItems && (
        <FlowchartRenderer items={question.metadata.flowchartItems} />
      )}

      <div className="text-base md:text-xl font-bold leading-relaxed md:leading-[1.7] text-slate-800 dark:text-slate-100 selection:bg-indigo-500 selection:text-white pb-4">
        {renderMath(question.text || question.questionText || '')}
        
        {/* Quantity Comparison UI */}
        {question.type === 'quantity_comparison' && question.quantityP && question.quantityQ && (
          <div className="mt-8 flex flex-col sm:flex-row items-stretch justify-center gap-4 sm:gap-8 bg-slate-50 dark:bg-slate-900/40 p-6 md:p-8 rounded-[1.5rem] border border-slate-200 dark:border-slate-800">
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-2">
              <span className="text-sm md:text-base font-black text-slate-400 dark:text-slate-500 tracking-widest">KUANTITAS P</span>
              <div className="text-lg md:text-2xl font-bold text-slate-900 dark:text-indigo-400">
                {renderMath(question.quantityP)}
              </div>
            </div>
            
            <div className="hidden sm:flex w-px bg-slate-200 dark:bg-slate-800" />
            <div className="sm:hidden h-px bg-slate-200 dark:bg-slate-800 my-2" />
            
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-2">
              <span className="text-sm md:text-base font-black text-slate-400 dark:text-slate-500 tracking-widest">KUANTITAS Q</span>
              <div className="text-lg md:text-2xl font-bold text-slate-900 dark:text-indigo-400">
                {renderMath(question.quantityQ)}
              </div>
            </div>
          </div>
        )}

        <p className="text-[10px] text-slate-400 dark:text-slate-600 mt-6 font-black uppercase tracking-widest italic opacity-50">Highligt single word to save vocab</p>
      </div>
    </div>
  );
};
