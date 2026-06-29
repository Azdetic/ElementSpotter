import { useState } from 'react';
import { useStorage } from '@plasmohq/storage/hook';
import '../style.css';

const CheckIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    className="text-slate-900"
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

function IndexOptions() {
  const [highlightColor, setHighlightColor] = useStorage<string>(
    'highlightColor',
    '#3b82f6'
  );
  const [runMode, setRunMode] = useStorage<'all' | 'specific'>(
    'runMode',
    'specific'
  );
  const [siteList, setSiteList] = useStorage<string[]>('siteList', []);

  const [newSite, setNewSite] = useState('');

  const colors = ['#ef4444', '#3b82f6', '#22c55e', '#eab308', '#a855f7'];

  const handleAddSite = (e: React.FormEvent) => {
    e.preventDefault();
    const site = newSite.trim().toLowerCase();
    if (site && !siteList.includes(site)) {
      setSiteList([...siteList, site]);
      setNewSite('');
    }
  };

  const handleRemoveSite = (site: string) => {
    setSiteList(siteList.filter((s) => s !== site));
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 p-8 font-mono">
      <div className="max-w-3xl mx-auto bg-white border-4 border-slate-900 shadow-[8px_8px_0_0_#0f172a]">
        <div className="border-b-4 border-slate-900 p-6 bg-yellow-400">
          <h1 className="text-3xl font-black uppercase tracking-tighter">
            ElementSpotter Settings
          </h1>
          <p className="font-bold mt-2">STRICT DEVELOPER CONFIGURATION</p>
        </div>

        <div className="p-6 space-y-12">
          <section>
            <h3 className="text-xl font-black uppercase mb-4 border-b-2 border-slate-900 pb-2">
              Highlight Color
            </h3>
            <div className="flex gap-4">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setHighlightColor(color)}
                  className={`w-12 h-12 flex items-center justify-center border-4 border-slate-900 transition-transform hover:-translate-y-1 hover:translate-x-1 ${
                    highlightColor === color
                      ? 'shadow-[4px_4px_0_0_#0f172a]'
                      : ''
                  }`}
                  style={{ backgroundColor: color }}
                  title={`Select color ${color}`}
                >
                  {highlightColor === color && <CheckIcon />}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-xl font-black uppercase mb-4 border-b-2 border-slate-900 pb-2">
              Website Permissions
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <button
                onClick={() => setRunMode('all')}
                className={`p-4 border-4 border-slate-900 text-left transition-all ${
                  runMode === 'all'
                    ? 'bg-slate-900 text-white shadow-[4px_4px_0_0_#ef4444]'
                    : 'bg-white hover:bg-slate-100 hover:-translate-y-1 hover:translate-x-1 shadow-[4px_4px_0_0_#0f172a]'
                }`}
              >
                <h4 className="font-black text-xl uppercase mb-2">
                  Global Mode
                </h4>
                <p
                  className={`font-bold ${runMode === 'all' ? 'text-slate-300' : 'text-slate-600'}`}
                >
                  Run everywhere. Use list below as BLACKLIST.
                </p>
              </button>

              <button
                onClick={() => setRunMode('specific')}
                className={`p-4 border-4 border-slate-900 text-left transition-all ${
                  runMode === 'specific'
                    ? 'bg-slate-900 text-white shadow-[4px_4px_0_0_#22c55e]'
                    : 'bg-white hover:bg-slate-100 hover:-translate-y-1 hover:translate-x-1 shadow-[4px_4px_0_0_#0f172a]'
                }`}
              >
                <h4 className="font-black text-xl uppercase mb-2">
                  Specific Mode
                </h4>
                <p
                  className={`font-bold ${runMode === 'specific' ? 'text-slate-300' : 'text-slate-600'}`}
                >
                  Disabled default. Use list below as WHITELIST.
                </p>
              </button>
            </div>

            <div className="bg-slate-100 border-4 border-slate-900 p-6">
              <h4 className="font-black uppercase mb-4 text-lg">
                {runMode === 'all' ? 'Blacklisted Sites' : 'Whitelisted Sites'}
              </h4>

              <form onSubmit={handleAddSite} className="flex gap-4 mb-8">
                <input
                  type="text"
                  value={newSite}
                  onChange={(e) => setNewSite(e.target.value)}
                  placeholder="e.g. google.com"
                  className="flex-1 bg-white border-4 border-slate-900 px-4 py-3 font-bold placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={!newSite.trim()}
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-slate-900 font-black uppercase border-4 border-slate-900 disabled:opacity-50 transition-transform active:translate-y-1 active:translate-x-1"
                >
                  Add Site
                </button>
              </form>

              {siteList.length === 0 ? (
                <div className="border-4 border-dashed border-slate-400 p-8 text-center font-bold text-slate-500 uppercase">
                  No websites added
                </div>
              ) : (
                <ul className="space-y-4">
                  {siteList.map((site) => (
                    <li
                      key={site}
                      className="flex items-center justify-between bg-white border-4 border-slate-900 p-4 shadow-[4px_4px_0_0_#0f172a]"
                    >
                      <span className="font-black text-lg">{site}</span>
                      <button
                        onClick={() => handleRemoveSite(site)}
                        className="bg-red-500 hover:bg-red-600 text-slate-900 font-black border-2 border-slate-900 px-3 py-1 uppercase text-sm"
                        title="Remove website"
                      >
                        REMOVE
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default IndexOptions;
