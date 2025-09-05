import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Translations, zhTranslations, enTranslations, deTranslations } from './translations';

export type Language = 'zh' | 'en' | 'de';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface I18nProviderProps {
  children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  // Get saved language setting from localStorage, default to Chinese
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'zh';
  });

  // 根据当前语言获取翻译
  const getTranslations = (lang: Language): Translations => {
    switch (lang) {
      case 'zh':
        return zhTranslations;
      case 'en':
        return enTranslations;
      case 'de':
        return deTranslations;
      default:
        return zhTranslations;
    }
  };

  const translations = getTranslations(language);

  // 保存语言设置到localStorage
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const value: I18nContextType = {
    language,
    setLanguage,
    t: translations,
  };

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextType {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

// 便捷的翻译Hook
export function useTranslation() {
  const { t, language, setLanguage } = useI18n();
  return { t, language, setLanguage };
}
