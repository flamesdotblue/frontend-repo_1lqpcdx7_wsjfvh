import { useEffect, useState } from 'react';
import { Link as LinkIcon, Trash2, Plus } from 'lucide-react';
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

export default function LinksPanel({ role }) {
  const [links, setLinks] = useLocalStorage('resource_links', [
    { id: crypto.randomUUID(), title: 'Community Calendar', url: 'https://calendar.google.com' },
    { id: crypto.randomUUID(), title: 'Daily Devotional', url: 'https://www.bible.com/' },
  ]);

  const canEdit = role === ROLES.JOEL || role === ROLES.ADMIN;

  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');

  function addLink() {
    if (!title.trim() || !url.trim()) return;
    const safeUrl = url.startsWith('http') ? url : `https://${url}`;
    setLinks([{ id: crypto.randomUUID(), title: title.trim(), url: safeUrl }, ...links]);
    setTitle('');
    setUrl('');
  }

  function removeLink(id) {
    setLinks(links.filter(l => l.id !== id));
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-900">Helpful Links</h3>
        {canEdit && (
          <div className="flex items-center gap-2">
            <input
              className="w-40 sm:w-56 rounded-md border border-gray-300 px-3 py-2 text-sm"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              className="w-48 sm:w-72 rounded-md border border-gray-300 px-3 py-2 text-sm"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <button
              className="inline-flex items-center gap-2 rounded-md bg-gray-900 text-white px-3 py-2 text-sm hover:bg-black"
              onClick={addLink}
            >
              <Plus className="h-4 w-4" /> Add
            </button>
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {links.map(link => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noreferrer"
            className="group rounded-lg border border-gray-200 bg-white p-4 hover:shadow-md transition"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4 text-gray-500" />
                <h4 className="font-medium text-gray-900 group-hover:underline">{link.title}</h4>
              </div>
              {canEdit && (
                <button
                  type="button"
                  className="text-gray-400 hover:text-red-600"
                  onClick={(e) => { e.preventDefault(); removeLink(link.id); }}
                  aria-label="Remove link"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
            <p className="mt-1 text-sm text-gray-500 break-all">{link.url}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
