import { useState } from 'react';
import { X, Plus, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase, Verse } from '../lib/supabase';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onVerseAdded: () => void;
}

export default function AdminPanel({ isOpen, onClose, onVerseAdded }: AdminPanelProps) {
  const [text, setText] = useState('');
  const [reference, setReference] = useState('');
  const [book, setBook] = useState('New Testament');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!text.trim() || !reference.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const { error: insertError } = await supabase
        .from('verses')
        .insert([{ text: text.trim(), reference: reference.trim(), book }]);

      if (insertError) throw insertError;

      setSuccess(true);
      setText('');
      setReference('');
      setBook('New Testament');
      onVerseAdded();

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add verse');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[#1a1d27] rounded-2xl border border-white/10 shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="text-white font-semibold text-lg">Add New Verse</h2>
          <button
            onClick={onClose}
            className="text-white/50 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Error message */}
          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-red-900/30 border border-red-800/50 text-red-400 text-sm">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {/* Success message */}
          {success && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-emerald-900/30 border border-emerald-800/50 text-emerald-400 text-sm">
              <CheckCircle size={16} />
              Verse added successfully!
            </div>
          )}

          {/* Verse Text */}
          <div>
            <label htmlFor="text" className="block text-white/70 text-sm mb-2">
              Verse Text <span className="text-amber-500">*</span>
            </label>
            <textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              className="w-full bg-[#0f1117] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:border-amber-600/50 focus:outline-none focus:ring-1 focus:ring-amber-600/30 transition-all resize-none"
              placeholder="Enter the verse text..."
            />
          </div>

          {/* Reference */}
          <div>
            <label htmlFor="reference" className="block text-white/70 text-sm mb-2">
              Reference <span className="text-amber-500">*</span>
            </label>
            <input
              id="reference"
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              className="w-full bg-[#0f1117] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:border-amber-600/50 focus:outline-none focus:ring-1 focus:ring-amber-600/30 transition-all"
              placeholder="e.g., John 3:16"
            />
          </div>

          {/* Book Selection */}
          <div>
            <label htmlFor="book" className="block text-white/70 text-sm mb-2">
              Book
            </label>
            <select
              id="book"
              value={book}
              onChange={(e) => setBook(e.target.value)}
              className="w-full bg-[#0f1117] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-amber-600/50 focus:outline-none focus:ring-1 focus:ring-amber-600/30 transition-all cursor-pointer"
            >
              <option value="Old Testament">Old Testament</option>
              <option value="New Testament">New Testament</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-amber-700 hover:bg-amber-600 disabled:bg-amber-700/50 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg shadow-amber-900/30"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Plus size={18} />
                Add Verse
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
