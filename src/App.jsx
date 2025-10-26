import { useEffect, useState } from 'react';
import TopBar, { ROLES } from './components/TopBar';
import HeroMessage from './components/HeroMessage';
import LinksPanel from './components/LinksPanel';
import StoriesBoard from './components/StoriesBoard';

export default function App() {
  const [role, setRole] = useState(ROLES.GUEST);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('current_role');
      if (saved) setRole(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem('current_role', JSON.stringify(role)); } catch {}
  }, [role]);

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar role={role} onRoleChange={setRole} />
      <main className="flex-1">
        <HeroMessage role={role} />
        <LinksPanel role={role} />
        <StoriesBoard role={role} />
      </main>
      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-gray-500 flex items-center justify-between">
          <p>© {new Date().getFullYear()} Testimony Hub</p>
          <p className="text-xs">Responsive by default — optimized for phones, tablets, and desktops.</p>
        </div>
      </footer>
    </div>
  );
}
