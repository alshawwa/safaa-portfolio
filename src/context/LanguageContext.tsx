import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import ar from "@/locales/ar.json";
import en from "@/locales/en.json";
import type { Direction, Language, TranslationDict, TranslationValue } from "@/types";

const STORAGE_KEY = "safaa-language";
const dictionaries: Record<Language, TranslationDict> = {
  en: en as TranslationDict,
  ar: ar as TranslationDict,
};

function readStoredLanguage(): Language {
  if (typeof window === "undefined") return "en";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "ar" || stored === "en" ? stored : "en";
}

function getByPath(dict: TranslationDict, path: string): string | undefined {
  const value = path.split(".").reduce<TranslationValue | undefined>((acc, key) => {
    if (!acc || typeof acc === "string") return undefined;
    return acc[key];
  }, dict);
  return typeof value === "string" ? value : undefined;
}

function applyDocumentLanguage(language: Language) {
  const dir: Direction = language === "ar" ? "rtl" : "ltr";
  document.documentElement.lang = language;
  document.documentElement.dir = dir;
  const title = getByPath(dictionaries[language], "meta.title");
  if (title) document.title = title;
}

interface LanguageContextValue {
  language: Language;
  dir: Direction;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(readStoredLanguage);

  useEffect(() => {
    applyDocumentLanguage(language);
    window.localStorage.setItem(STORAGE_KEY, language);
  }, [language]);

  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next);
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState((current) => (current === "en" ? "ar" : "en"));
  }, []);

  const t = useCallback(
    (key: string) => getByPath(dictionaries[language], key) ?? key,
    [language],
  );

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      dir: language === "ar" ? "rtl" : "ltr",
      setLanguage,
      toggleLanguage,
      t,
    }),
    [language, setLanguage, toggleLanguage, t],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
