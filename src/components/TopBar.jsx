import { useEffect, useMemo, useState } from 'react';
import { QrCode, User } from 'lucide-react';

const ROLES = {
  GUEST: 'guest',
  JOEL: 'joel',
  ADMIN: 'admin',
};

const PASSCODES = {
  [ROLES.JOEL]: 'joel123',
  [ROLES.ADMIN]: 'admin123',
};

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

export default function TopBar({ role, onRoleChange }) {
  const [showLogin, setShowLogin] = useState(false);
  const [selectedRole, setSelectedRole] = useState(ROLES.GUEST);
  const [passcode, setPasscode] = useState('');
  const [qrOpen, setQrOpen] = useState(false);
  const [savedUrl] = useLocalStorage('site_url', '');

  const siteUrl = useMemo(() => {
    // Prefer a previously saved URL if provided, else current location
    const url = savedUrl && typeof savedUrl === 'string' && savedUrl.length > 0
      ? savedUrl
      : (typeof window !== 'undefined' ? window.location.href : 'https://example.com');
    return url;
  }, [savedUrl]);

  const qrSrc = useMemo(() => {
    const encoded = encodeURIComponent(siteUrl);
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encoded}`;
  }, [siteUrl]);

  function handleLogin() {
    if (selectedRole === ROLES.GUEST) {
      onRoleChange(ROLES.GUEST);
      setShowLogin(false);
      setPasscode('');
      return;
    }
    const expected = PASSCODES[selectedRole];
    if (passcode === expected) {
      onRoleChange(selectedRole);
      setShowLogin(false);
      setPasscode('');
    } else {
      alert('Incorrect passcode.');
    }
  }

  function handleLogout() {
    onRoleChange(ROLES.GUEST);
  }

  return (
    <header className="w-full sticky top-0 z-20 bg-white/70 backdrop-blur border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500" />
          <div className="leading-tight">
            <h1 className="font-semibold text-gray-900">Testimony Hub</h1>
            <p className="text-xs text-gray-500">Stories. Hope. Community.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm hover:bg-gray-50"
            onClick={() => setQrOpen(true)}
            aria-label="Show QR code"
          >
            <QrCode className="h-4 w-4" />
            <span>QR</span>
          </button>
          {role === ROLES.GUEST ? (
            <button
              className="inline-flex items-center gap-2 rounded-md bg-gray-900 text-white px-3 py-2 text-sm hover:bg-black"
              onClick={() => setShowLogin(true)}
            >
              <User className="h-4 w-4" />
              Sign in
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700 capitalize">{role}</span>
              <button
                className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm hover:bg-gray-50"
                onClick={handleLogout}
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>

      {showLogin && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-5 shadow-xl">
            <h2 className="text-lg font-semibold mb-4">Choose a role</h2>
            <div className="space-y-3">
              <select
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value={ROLES.GUEST}>Continue as Guest</option>
                <option value={ROLES.JOEL}>Joel</option>
                <option value={ROLES.ADMIN}>Admin</option>
              </select>
              {selectedRole !== ROLES.GUEST && (
                <input
                  type="password"
                  placeholder="Enter passcode"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              )}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50"
                  onClick={() => setShowLogin(false)}
                >
                  Cancel
                </button>
                <button
                  className="rounded-md bg-gray-900 text-white px-3 py-2 text-sm hover:bg-black"
                  onClick={handleLogin}
                >
                  Continue
                </button>
              </div>
              <p className="text-xs text-gray-500">Joel passcode: joel123 • Admin passcode: admin123</p>
            </div>
          </div>
        </div>
      )}

      {qrOpen && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl text-center">
            <h3 className="text-lg font-semibold mb-3">Scan to visit</h3>
            <img src={qrSrc} alt="QR Code" className="mx-auto rounded-lg border" />
            <p className="mt-3 text-xs text-gray-500 break-all">{siteUrl}</p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <a
                href={qrSrc}
                download="site-qr.png"
                className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50"
              >
                Download PNG
              </a>
              <button
                className="rounded-md bg-gray-900 text-white px-3 py-2 text-sm hover:bg-black"
                onClick={() => setQrOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export { ROLES };
