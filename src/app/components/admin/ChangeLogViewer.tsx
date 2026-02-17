import { ChangeLogEntry } from '../../types/pricing';
import { Clock, User, FileEdit } from 'lucide-react';

interface ChangeLogViewerProps {
  entries: ChangeLogEntry[];
}

export function ChangeLogViewer({ entries }: ChangeLogViewerProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-AU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'create': return 'text-green-600 bg-green-50';
      case 'update': return 'text-blue-600 bg-blue-50';
      case 'delete': return 'text-red-600 bg-red-50';
      case 'publish': return 'text-[#F7A619] bg-[#F7A619]/10';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl text-[#044866]">Change Log & Audit Trail</h2>

      <div className="space-y-2.5">
        {entries.length === 0 ? (
          <div className="bg-white border border-[#044866]/10 rounded-lg p-8 text-center">
            <FileEdit className="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <p className="text-sm text-gray-600">No changes recorded yet</p>
          </div>
        ) : (
          entries.map((entry) => (
            <div key={entry.id} className="bg-white border border-[#044866]/10 rounded-lg p-3.5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`px-2 py-0.5 rounded text-xs capitalize ${getActionColor(entry.action)}`}>
                      {entry.action}
                    </span>
                    <span className="text-sm text-[#044866]">{entry.entity}</span>
                    <span className="text-xs text-gray-500">v{entry.version}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span>{entry.user}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatDate(entry.timestamp)}</span>
                    </div>
                  </div>

                  {entry.oldValue && entry.newValue && (
                    <div className="mt-2 text-xs">
                      <div className="flex gap-3">
                        <div className="flex-1">
                          <span className="text-gray-500">Before:</span>
                          <pre className="mt-1 p-2 bg-red-50 rounded text-red-700 overflow-x-auto">
                            {JSON.stringify(entry.oldValue, null, 2)}
                          </pre>
                        </div>
                        <div className="flex-1">
                          <span className="text-gray-500">After:</span>
                          <pre className="mt-1 p-2 bg-green-50 rounded text-green-700 overflow-x-auto">
                            {JSON.stringify(entry.newValue, null, 2)}
                          </pre>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
