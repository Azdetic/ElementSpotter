import { useState, useEffect } from 'react';
import { useStorage } from '@plasmohq/storage/hook';
import '../style.css';

const CustomCrosshair = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    className="text-slate-900"
  >
    <rect x="3" y="3" width="18" height="18" />
    <line x1="12" y1="3" x2="12" y2="21" />
    <line x1="3" y1="12" x2="21" y2="12" />
  </svg>
);

const CustomGithub = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
  >
    <rect x="2" y="4" width="20" height="16" />
    <path d="M10 9L6 12L10 15" />
    <path d="M14 9L18 12L14 15" />
  </svg>
);

const CustomDiscord = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
  >
    <rect x="2" y="4" width="20" height="12" />
    <rect x="7" y="8" width="2" height="2" fill="currentColor" stroke="none" />
    <rect x="15" y="8" width="2" height="2" fill="currentColor" stroke="none" />
    <path d="M6 16v4l4-4" fill="currentColor" />
  </svg>
);

const CustomBug = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
  >
    <rect x="8" y="4" width="8" height="16" />
    <line x1="4" y1="8" x2="8" y2="8" />
    <line x1="4" y1="16" x2="8" y2="16" />
    <line x1="16" y1="8" x2="20" y2="8" />
    <line x1="16" y1="16" x2="20" y2="16" />
    <line x1="12" y1="4" x2="12" y2="20" />
  </svg>
);

function IndexPopup() {
  const [isActive, setIsActive] = useStorage<boolean>('isSpottingActive', true);
  const [highlightColor, setHighlightColor] = useStorage<string>(
    'highlightColor',
    '#3b82f6'
  );

  const colors = [
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Green', value: '#22c55e' },
  ];

  const [hotkey, setHotkey] = useStorage<string>('hotkey', 'Alt');
  const [isRecordingKey, setIsRecordingKey] = useState(false);

  const [runMode] = useStorage<'all' | 'specific'>('runMode', 'specific');
  const [siteList, setSiteList] = useStorage<string[]>('siteList', []);
  const [currentDomain, setCurrentDomain] = useState<string>('');

  useEffect(() => {
    if (chrome?.tabs?.query) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const url = tabs[0]?.url;
        if (url && !url.startsWith('chrome://')) {
          try {
            const domain = new URL(url).hostname;
            setCurrentDomain(domain);
          } catch (e) {
            console.error('Failed to parse URL', e);
          }
        }
      });
    }
  }, []);

  const isSiteEnabled =
    runMode === 'all'
      ? !siteList.includes(currentDomain)
      : siteList.includes(currentDomain);

  const toggleCurrentSite = () => {
    if (!currentDomain) return;

    if (siteList.includes(currentDomain)) {
      setSiteList(siteList.filter((d) => d !== currentDomain));
    } else {
      setSiteList([...siteList, currentDomain]);
    }
  };

  useEffect(() => {
    if (!isRecordingKey) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      setHotkey(e.key);
      setIsRecordingKey(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRecordingKey, setHotkey]);

  const displayKey =
    hotkey === 'Control' ? 'Ctrl' : hotkey === ' ' ? 'Space' : hotkey;

  return (
    <div className="w-64 h-auto bg-white text-slate-900 border-2 border-slate-900 font-sans p-4">
      <div className="flex items-center gap-2 mb-6 border-b-2 border-slate-900 pb-2">
        <CustomCrosshair />
        <h1 className="text-lg font-bold uppercase tracking-tight text-slate-900">
          ElementSpotter
        </h1>
      </div>

      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-bold text-slate-800 uppercase">
          Spotting
        </span>
        <button
          onClick={() => setIsActive(!(isActive ?? true))}
          className={`relative flex items-center w-12 h-6 border-2 border-slate-900 transition-colors ${
            isActive ? 'bg-slate-900' : 'bg-slate-300'
          }`}
        >
          <div
            className={`w-5 h-5 bg-white border-2 border-slate-900 transition-transform ${
              isActive ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {currentDomain && (
        <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-slate-900 border-dashed">
          <span
            className="text-xs font-bold text-slate-800 truncate pr-2"
            title={currentDomain}
          >
            Run on {currentDomain}
          </span>
          <button
            onClick={toggleCurrentSite}
            className={`px-2 py-0.5 border-2 border-slate-900 text-[10px] font-bold uppercase transition-colors ${
              isSiteEnabled
                ? 'bg-green-500 text-white'
                : 'bg-slate-200 text-slate-500'
            }`}
          >
            {isSiteEnabled ? 'ON' : 'OFF'}
          </button>
        </div>
      )}

      <div className="mb-6">
        <span className="block text-sm font-bold text-slate-800 uppercase mb-3">
          Color
        </span>
        <div className="flex gap-3">
          {colors.map((color) => (
            <button
              key={color.value}
              onClick={() => setHighlightColor(color.value)}
              className={`w-8 h-8 border-2 ${
                highlightColor === color.value
                  ? 'border-slate-900 scale-110'
                  : 'border-slate-300 hover:border-slate-900'
              } transition-transform`}
              style={{ backgroundColor: color.value }}
              title={color.name}
              aria-label={`Select ${color.name}`}
            />
          ))}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t-2 border-slate-900 flex flex-col items-center">
        <span className="text-[10px] font-bold text-slate-600 uppercase mb-1">
          Hotkey
        </span>
        <button
          onClick={() => setIsRecordingKey(true)}
          className={`mb-3 px-3 py-1 border-2 border-slate-900 text-xs font-bold uppercase transition-colors ${
            isRecordingKey
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
          }`}
        >
          {isRecordingKey ? 'Press any key...' : `Hold [${displayKey}] to spot`}
        </button>

        <div className="flex justify-center gap-3">
          <a
            href="https://github.com/Azdetic/ElementSpotter"
            target="_blank"
            rel="noreferrer"
            title="GitHub"
            className="p-1.5 border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white transition-colors"
          >
            <CustomGithub />
          </a>
          <a
            href="https://discord.gg/eNB9HAQtg5"
            target="_blank"
            rel="noreferrer"
            title="Discord"
            className="p-1.5 border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white transition-colors"
          >
            <CustomDiscord />
          </a>
          <a
            href="https://github.com/Azdetic/ElementSpotter/issues"
            target="_blank"
            rel="noreferrer"
            title="Report Issue"
            className="p-1.5 border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white transition-colors"
          >
            <CustomBug />
          </a>
        </div>
      </div>
    </div>
  );
}

export default IndexPopup;
