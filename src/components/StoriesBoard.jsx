import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, XCircle, Send } from 'lucide-react';
import { ROLES } from './TopBar';

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  }, [key, value]);
  return [value, setValue];
}

export default function StoriesBoard({ role }) {
  const [published, setPublished] = useLocalStorage('stories_published', [
    {
      id: crypto.randomUUID(),
      name: 'Anonymous',
      text: 'I found hope in a difficult season and want to encourage others to keep going.',
      date: new Date().toISOString(),
    },
  ]);
  const [pending, setPending] = useLocalStorage('stories_pending', []);

  const [name, setName] = useState('');
  const [text, setText] = useState('');

  const isAdmin = role === ROLES.ADMIN;

  function submitStory() {
    if (!text.trim()) return;
    const entry = {
      id: crypto.randomUUID(),
      name: name.trim() || 'Anonymous',
      text: text.trim(),
      date: new Date().toISOString(),
    };
    setPending([entry, ...pending]);
    setName('');
    setText('');
    alert('Thanks for sharing! Your story will appear once approved.');
  }

  function approve(id) {
    const item = pending.find(p => p.id === id);
    if (!item) return;
    setPending(pending.filter(p => p.id !== id));
    setPublished([item, ...published]);
  }

  function rejectItem(id) {
    setPending(pending.filter(p => p.id !== id));
  }

  return (
    <section className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-12 grid gap-8 lg:grid-cols-2">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Their Stories</h3>
          <p className="text-sm text-gray-600 mb-4">Read testimonies from the community.</p>
          <div className="space-y-4">
            {published.map((s) => (
              <article key={s.id} className="rounded-lg bg-white border border-gray-200 p-4 shadow-sm">
                <p className="text-gray-800 whitespace-pre-wrap">{s.text}</p>
                <div className="mt-3 text-xs text-gray-500">
                  — {s.name} • {new Date(s.date).toLocaleString()}
                </div>
              </article>
            ))}
            {published.length === 0 && (
              <p className="text-sm text-gray-500">No stories yet. Be the first to share!</p>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-900">Share Your Story</h3>
          <p className="text-sm text-gray-600 mb-4">Submit a testimony. An administrator will review it before it appears.</p>
          <div className="rounded-lg bg-white border border-gray-200 p-4 shadow-sm">
            <div className="grid gap-3">
              <input
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="Your name (optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <textarea
                rows={4}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="Write your story here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <button
                className="inline-flex items-center gap-2 rounded-md bg-gray-900 text-white px-3 py-2 text-sm hover:bg-black"
                onClick={submitStory}
              >
                <Send className="h-4 w-4" /> Submit
              </button>
            </div>
          </div>

          {isAdmin && (
            <div className="mt-8">
              <h4 className="text-lg font-semibold text-gray-900">Pending Approval</h4>
              <p className="text-sm text-gray-600 mb-3">Approve or reject submissions.</p>
              <div className="space-y-4">
                {pending.map((s) => (
                  <article key={s.id} className="rounded-lg bg-white border border-gray-200 p-4 shadow-sm">
                    <p className="text-gray-800 whitespace-pre-wrap">{s.text}</p>
                    <div className="mt-3 text-xs text-gray-500">— {s.name} • {new Date(s.date).toLocaleString()}</div>
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        className="inline-flex items-center gap-2 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700 hover:bg-green-100"
                        onClick={() => approve(s.id)}
                      >
                        <CheckCircle2 className="h-4 w-4" /> Approve
                      </button>
                      <button
                        className="inline-flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 hover:bg-red-100"
                        onClick={() => rejectItem(s.id)}
                      >
                        <XCircle className="h-4 w-4" /> Reject
                      </button>
                    </div>
                  </article>
                ))}
                {pending.length === 0 && (
                  <p className="text-sm text-gray-500">No submissions awaiting review.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
