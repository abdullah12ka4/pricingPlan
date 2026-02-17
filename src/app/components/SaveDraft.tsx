import { useState, useEffect } from 'react';
import { Save, Clock, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface SaveDraftProps {
  data: any;
  storageKey: string;
  onRestore?: (data: any) => void;
  autoSaveInterval?: number; // in milliseconds
}

export function SaveDraft({ data, storageKey, onRestore, autoSaveInterval = 30000 }: SaveDraftProps) {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('unsaved');

  // Auto-save functionality
  useEffect(() => {
    if (!data || Object.keys(data).length === 0) return;

    const interval = setInterval(() => {
      saveDraft();
    }, autoSaveInterval);

    return () => clearInterval(interval);
  }, [data, autoSaveInterval]);

  const saveDraft = () => {
    try {
      setSaveStatus('saving');
      localStorage.setItem(storageKey, JSON.stringify({
        data,
        timestamp: new Date().toISOString()
      }));
      setLastSaved(new Date());
      setSaveStatus('saved');
    } catch (error) {
      console.error('Failed to save draft:', error);
      setSaveStatus('unsaved');
    }
  };

  const loadDraft = () => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const { data: savedData, timestamp } = JSON.parse(saved);
        onRestore?.(savedData);
        setLastSaved(new Date(timestamp));
      }
    } catch (error) {
      console.error('Failed to load draft:', error);
    }
  };

  const clearDraft = () => {
    localStorage.removeItem(storageKey);
    setLastSaved(null);
    setSaveStatus('unsaved');
  };

  const getTimeAgo = () => {
    if (!lastSaved) return '';
    
    const seconds = Math.floor((new Date().getTime() - lastSaved.getTime()) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  return (
    <div className="flex items-center gap-3">
      {saveStatus === 'saved' && lastSaved && (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1.5">
          <CheckCircle2 className="w-3 h-3" />
          <span className="text-xs">Saved {getTimeAgo()}</span>
        </Badge>
      )}
      
      {saveStatus === 'saving' && (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1.5">
          <Clock className="w-3 h-3 animate-spin" />
          <span className="text-xs">Saving...</span>
        </Badge>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={saveDraft}
        className="border-[#044866]/20 text-[#044866]"
      >
        <Save className="w-3.5 h-3.5 mr-2" />
        Save Draft
      </Button>
    </div>
  );
}

// Hook to check for saved drafts on mount
export function useDraftRestore(storageKey: string) {
  const [hasDraft, setHasDraft] = useState(false);
  const [draftTimestamp, setDraftTimestamp] = useState<Date | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const { timestamp } = JSON.parse(saved);
        setHasDraft(true);
        setDraftTimestamp(new Date(timestamp));
      } catch (error) {
        console.error('Failed to check for draft:', error);
      }
    }
  }, [storageKey]);

  const restoreDraft = () => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const { data } = JSON.parse(saved);
        return data;
      }
    } catch (error) {
      console.error('Failed to restore draft:', error);
    }
    return null;
  };

  const clearDraft = () => {
    localStorage.removeItem(storageKey);
    setHasDraft(false);
    setDraftTimestamp(null);
  };

  return { hasDraft, draftTimestamp, restoreDraft, clearDraft };
}
