// lib/cookieStorage.ts
export type Lang = 'english' | 'spanish';
export type Theme = 'dark' | 'light';
export type DailyQuote = { date: string; index: number; language: Lang };

const DAILY_KEY = "inspiTap.dailyQuote";
const LANG_KEY = "inspiTap.language";
const THEME_KEY = "inspiTap.theme";

const pad = (n: number) => n.toString().padStart(2, "0");
export const todayLocalKey = (d = new Date()) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const nextLocalMidnight = () => {
  const d = new Date();
  d.setHours(24, 0, 0, 0);
  return d;
};

function writeCookie(name: string, value: string, expires: Date) {
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(
    value
  )}; expires=${expires.toUTCString()}; path=/; samesite=lax`;
}

function readCookie(name: string): string | null {
  const safeName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // escape regex chars
  const regex = new RegExp("(?:^|; )" + safeName + "=([^;]*)");
  const match = document.cookie.match(regex);
  return match ? decodeURIComponent(match[1]) : null;
}


// ---------- Daily quote ----------
export function readDaily(): DailyQuote | null {
  try {
    const raw = readCookie(DAILY_KEY);
    return raw ? (JSON.parse(raw) as DailyQuote) : null;
  } catch {
    return null;
  }
}

export function writeDaily(v: DailyQuote) {
  writeCookie(DAILY_KEY, JSON.stringify(v), nextLocalMidnight());
}

export function clearDaily() {
  writeCookie(DAILY_KEY, "", new Date(0));
}

// ---------- Language ----------
export function readLanguage(): Lang {
  const v = readCookie(LANG_KEY);
  return v === "spanish" ? "spanish" : "english";
}
export function writeLanguage(lang: Lang) {
  writeCookie(
    LANG_KEY,
    lang,
    new Date(Date.now() + 365 * 24 * 3600 * 1000) // 1 year
  );
}

// ---------- Theme ----------
export function readTheme(): Theme {
  const v = readCookie(THEME_KEY);
  return v === "light" ? "light" : "dark";
}
export function writeTheme(theme: Theme) {
  writeCookie(
    THEME_KEY,
    theme,
    new Date(Date.now() + 365 * 24 * 3600 * 1000)
  );
}
