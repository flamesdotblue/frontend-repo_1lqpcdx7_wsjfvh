import { useEffect, useState } from 'react';
import { Pencil } from 'lucide-react';
import Spline from '@splinetool/react-spline';
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
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }, [key, value]);
  return [value, setValue];
}

export default function HeroMessage({ role }) {
  const [message, setMessage] = useLocalStorage(
    'main_message',
    'Jesus died on the cross and rose again — this is a place to share that hope.'
  );
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(message);

  useEffect(() => setDraft(message), [message]);

  const canEdit = role === ROLES.JOEL || role === ROLES.ADMIN;

  function save() {
    setMessage(draft.trim() || message);
    setEditing(false);
  }

  return (
    <section className="relative">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-100 via-fuchsia-50 to-white" aria-hidden="true" />
      <div className="relative max-w-6xl mx-auto px-4 py-10 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-gray-900">
              {message}
            </h2>
            <p className="mt-4 text-gray-600">
              Share testimonies, post helpful links, and join a welcoming community.
            </p>
            {canEdit && !editing && (
              <button
                className="mt-6 inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2 text-sm shadow-sm hover:bg-gray-50"
                onClick={() => setEditing(true)}
              >
                <Pencil className="h-4 w-4" /> Edit main message
              </button>
            )}

            {canEdit && editing && (
              <div className="mt-6 mx-auto lg:mx-0 max-w-2xl text-left bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <label className="block text-sm font-medium text-gray-700 mb-1">Main message</label>
                <textarea
                  rows={3}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
                <div className="flex justify-end gap-2 mt-3">
                  <button
                    className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50"
                    onClick={() => setEditing(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="rounded-md bg-gray-900 text-white px-3 py-2 text-sm hover:bg-black"
                    onClick={save}
                  >
                    Save
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="relative h-[360px] sm:h-[460px] lg:h-[520px] rounded-2xl overflow-hidden border border-gray-200 bg-white/60 backdrop-blur">
            <Spline scene="https://prod.spline.design/N8g2VNcx8Rycz93J/scene.splinecode" style={{ width: '100%', height: '100%' }} />
            {/* Soft gradient that doesn't block interaction */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-white/20" />

            {/* Cross that Christ died on — visual overlay, interaction-safe */}
            <div className="pointer-events-none absolute inset-0 flex items-start justify-start">
              {/* Position the cross slightly left and higher (traditional proportions) */}
              <div className="relative ml-6 mt-6 sm:ml-8 sm:mt-8">
                {/* Vertical beam */}
                <div className="h-36 sm:h-48 lg:h-64 w-2.5 sm:w-3 rounded-sm bg-gradient-to-b from-amber-800 via-amber-700 to-amber-900 shadow-xl shadow-amber-900/20" />
                {/* Horizontal beam (placed at upper third) */}
                <div className="absolute left-1/2 -translate-x-1/2 top-6 sm:top-7 lg:top-8 h-2 sm:h-2.5 w-16 sm:w-24 lg:w-28 rounded-sm bg-gradient-to-b from-amber-800 via-amber-700 to-amber-900 shadow-lg shadow-amber-900/20" />
              </div>
            </div>

            <div className="pointer-events-none absolute left-4 top-4 text-gray-700/80">
              <p className="text-xs font-medium">Interactive 3D scene with cross overlay</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
