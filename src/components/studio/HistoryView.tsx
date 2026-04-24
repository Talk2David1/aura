import React, { useEffect, useState } from 'react';
import { Clock, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { projectService } from '@/lib/api/projects';
import { GenerationHistory } from '@/types';

export function HistoryView() {
  const [history, setHistory] = useState<GenerationHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await projectService.getHistory();
        setHistory(data);
      } catch (error) {
        console.error("Failed to fetch history", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const getStatusIcon = (status: GenerationHistory['status']) => {
    switch(status) {
      case 'success': return <CheckCircle2 size={16} className="text-success-primary" />;
      case 'failed': return <XCircle size={16} className="text-coral-primary" />;
      case 'pending': return <Loader2 size={16} className="text-amber-primary animate-spin" />;
    }
  };

  return (
    <div className="bg-bg-primary md:border border-border-tertiary rounded-xl overflow-hidden mb-8 min-h-[500px]">
      <div className="p-4 md:p-6 border-b border-border-tertiary">
        <h3 className="text-[16px] font-medium text-text-primary">Generation Audit Log</h3>
        <p className="text-[12px] text-text-tertiary mt-1">Review all your generation tasks, prompts, and credit usage.</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-12 text-text-tertiary text-[13px]">
          Loading history logs...
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-secondary text-[11px] uppercase tracking-wider text-text-tertiary border-b border-border-tertiary">
                <th className="px-6 py-4 font-medium">Status / Date</th>
                <th className="px-6 py-4 font-medium">Action</th>
                <th className="px-6 py-4 font-medium hidden md:table-cell">Details / Prompt</th>
                <th className="px-6 py-4 font-medium text-right">Cost</th>
              </tr>
            </thead>
            <tbody className="text-[13px] text-text-primary divide-y divide-border-tertiary">
              {history.map((log) => (
                <tr key={log.id} className="hover:bg-bg-secondary/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(log.status)}
                      <div className="flex flex-col">
                        <span className="capitalize font-medium block md:hidden">{log.status}</span>
                        <span className="text-text-tertiary text-[11px] flex items-center gap-1 mt-0.5">
                          <Clock size={10} />
                          {new Date(log.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium whitespace-nowrap">
                    {log.action}
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell text-text-secondary max-w-xs truncate">
                    {log.prompt}
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    {log.creditsUsed > 0 ? (
                      <span className="font-medium text-amber-primary">-{log.creditsUsed} cr</span>
                    ) : (
                      <span className="text-text-tertiary">Free</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
