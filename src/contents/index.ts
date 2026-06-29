import type { PlasmoCSConfig } from 'plasmo';
import { Storage } from '@plasmohq/storage';

export const config: PlasmoCSConfig = {
  matches: ['<all_urls>'],
};

const storage = new Storage();

const overlay = document.createElement('div');
overlay.id = 'element-spotter-overlay';
Object.assign(overlay.style, {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: '2147483647',
  border: '2px solid #3b82f6',
  backgroundColor: 'rgba(59, 130, 246, 0.2)',
  transition: 'all 0.1s ease-out',
  display: 'none',
  borderRadius: '2px',
});
if (document.body) {
  document.body.appendChild(overlay);
} else {
  document.addEventListener('DOMContentLoaded', () => {
    document.body.appendChild(overlay);
  });
}

let activeElement: HTMLElement | null = null;
let isSpottingActive = true;
let currentColor = '#3b82f6';
let activeHotkey = 'Alt';

let runMode: 'all' | 'specific' = 'specific';
let siteList: string[] = [];
let isDomainAllowed = true;

function updateDomainCheck() {
  const currentDomain = window.location.hostname;
  if (runMode === 'all') {
    isDomainAllowed = !siteList.includes(currentDomain);
  } else {
    isDomainAllowed = siteList.includes(currentDomain);
  }

  if (!isDomainAllowed) {
    updateOverlay(null);
  }
}

storage.watch({
  isSpottingActive: (c) => {
    isSpottingActive = c.newValue !== undefined ? c.newValue : true;
    if (!isSpottingActive) updateOverlay(null);
  },
  highlightColor: (c) => {
    if (c.newValue) {
      currentColor = c.newValue;
      overlay.style.borderColor = currentColor;
      const r = parseInt(currentColor.slice(1, 3), 16);
      const g = parseInt(currentColor.slice(3, 5), 16);
      const b = parseInt(currentColor.slice(5, 7), 16);
      overlay.style.backgroundColor = `rgba(${r}, ${g}, ${b}, 0.2)`;
    }
  },
  hotkey: (c) => {
    if (c.newValue) {
      activeHotkey = c.newValue;
      isCtrlPressed = false;
      updateOverlay(null);
    }
  },
  runMode: (c) => {
    if (c.newValue) {
      runMode = c.newValue;
      updateDomainCheck();
    }
  },
  siteList: (c) => {
    if (c.newValue) {
      siteList = c.newValue;
      updateDomainCheck();
    }
  },
});

Promise.all([
  storage.get('runMode'),
  storage.get('siteList'),
  storage.get('isSpottingActive'),
  storage.get('highlightColor'),
  storage.get('hotkey'),
]).then(([m, l, active, color, hk]) => {
  if (m !== undefined) runMode = m as any;
  if (l !== undefined) siteList = l as any;
  if (active !== undefined) isSpottingActive = active as boolean;
  if (color !== undefined) {
    const colorStr = color as string;
    if (/^#[0-9a-fA-F]{6}$/.test(colorStr)) {
      currentColor = colorStr;
      overlay.style.borderColor = currentColor;
      const r = parseInt(currentColor.slice(1, 3), 16);
      const g = parseInt(currentColor.slice(3, 5), 16);
      const b = parseInt(currentColor.slice(5, 7), 16);
      overlay.style.backgroundColor = `rgba(${r}, ${g}, ${b}, 0.2)`;
    }
  }
  if (hk !== undefined) activeHotkey = hk as string;

  updateDomainCheck();
});

let isCtrlPressed = false;

function updateOverlay(el: HTMLElement | null) {
  if (!el || !isSpottingActive || !isCtrlPressed || !isDomainAllowed) {
    overlay.style.display = 'none';
    return;
  }

  const rect = el.getBoundingClientRect();
  Object.assign(overlay.style, {
    display: 'block',
    top: `${rect.top}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
  });
}

window.addEventListener(
  'keydown',
  (e) => {
    if (e.key === activeHotkey) {
      e.preventDefault();
      isCtrlPressed = true;
      if (isSpottingActive && activeElement) updateOverlay(activeElement);
    }
  },
  true
);

window.addEventListener(
  'keyup',
  (e) => {
    if (e.key === activeHotkey) {
      isCtrlPressed = false;
      updateOverlay(null);
    }
  },
  true
);

window.addEventListener(
  'mouseover',
  (e) => {
    if (!isSpottingActive) return;

    const target = e.target as HTMLElement;
    if (target === document.body || target === document.documentElement) return;

    activeElement = target;
    updateOverlay(activeElement);
  },
  true
);

window.addEventListener('scroll', () => updateOverlay(activeElement), true);
window.addEventListener('resize', () => updateOverlay(activeElement), true);

let isCapturing = false;

window.addEventListener(
  'click',
  async (e) => {
    if (
      !isSpottingActive ||
      !activeElement ||
      !isCtrlPressed ||
      !isDomainAllowed ||
      e.button !== 0 ||
      isCapturing
    )
      return;

    e.preventDefault();
    e.stopPropagation();

    isCapturing = true;

    try {
      const htmlText = activeElement.outerHTML;

      try {
        await navigator.clipboard.writeText(htmlText);
      } catch (err) {
        console.warn('Failed to copy to clipboard', err);
        isCapturing = false;
        return;
      }

      overlay.style.backgroundColor = 'rgba(34, 197, 94, 0.5)';
      overlay.style.borderColor = '#22c55e';

      const floatText = document.createElement('div');
      floatText.innerText = 'COPIED!';
      Object.assign(floatText.style, {
        position: 'fixed',
        left: `${e.clientX}px`,
        top: `${e.clientY - 20}px`,
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#22c55e',
        color: '#fff',
        border: '2px solid #000',
        boxShadow: '4px 4px 0 0 #000',
        padding: '4px 8px',
        fontFamily: 'monospace',
        fontWeight: 'bold',
        fontSize: '14px',
        zIndex: '2147483647',
        pointerEvents: 'none',
        transition: 'all 1s ease-out',
        opacity: '1'
      });
      document.body.appendChild(floatText);

      // Animate float up and fade out in the next tick
      setTimeout(() => {
        floatText.style.top = `${e.clientY - 60}px`;
        floatText.style.opacity = '0';
      }, 10);

      // Reset everything after animation finishes
      setTimeout(() => {
        // Remove floating text
        if (floatText.parentNode) {
          document.body.removeChild(floatText);
        }
        
        // Reset overlay to current user color
        if (currentColor) {
          overlay.style.borderColor = currentColor;
          let r = parseInt(currentColor.slice(1, 3), 16);
          let g = parseInt(currentColor.slice(3, 5), 16);
          let b = parseInt(currentColor.slice(5, 7), 16);
          if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
            overlay.style.backgroundColor = `rgba(${r}, ${g}, ${b}, 0.2)`;
          }
        }
      }, 1000);
      
    } finally {
      // Ensure capturing lock is released after animation time even if errors occur
      setTimeout(() => {
        isCapturing = false;
      }, 1000);
    }
  },
  true
);

window.addEventListener(
  'mouseout',
  (e) => {
    if (!isSpottingActive) return;
    if (!e.relatedTarget) {
      activeElement = null;
      updateOverlay(null);
    }
  },
  true
);
