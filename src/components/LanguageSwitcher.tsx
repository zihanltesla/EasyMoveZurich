import React from 'react';
import { useTranslation, Language } from '../i18n/i18nContext';

interface LanguageSwitcherProps {
  style?: React.CSSProperties;
  variant?: 'default' | 'minimal';
}

export function LanguageSwitcher({ style, variant = 'default' }: LanguageSwitcherProps) {
  const { language, setLanguage } = useTranslation();

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
  };

  if (variant === 'minimal') {
    return (
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        ...style
      }}>
        <button
          onClick={() => handleLanguageChange('zh')}
          style={{
            padding: '0.25rem 0.5rem',
            border: 'none',
            borderRadius: '0.25rem',
            backgroundColor: language === 'zh' ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
            color: 'white',
            fontSize: '0.875rem',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          中文
        </button>
        <button
          onClick={() => handleLanguageChange('en')}
          style={{
            padding: '0.25rem 0.5rem',
            border: 'none',
            borderRadius: '0.25rem',
            backgroundColor: language === 'en' ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
            color: 'white',
            fontSize: '0.875rem',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          EN
        </button>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '0.5rem',
      padding: '0.25rem',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      ...style
    }}>
      <button
        onClick={() => handleLanguageChange('zh')}
        style={{
          padding: '0.5rem 1rem',
          border: 'none',
          borderRadius: '0.25rem',
          backgroundColor: language === 'zh' ? 'rgba(255, 255, 255, 0.9)' : 'transparent',
          color: language === 'zh' ? '#374151' : 'rgba(255, 255, 255, 0.8)',
          fontSize: '0.875rem',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}
      >
        🇨🇳 中文
      </button>
      <button
        onClick={() => handleLanguageChange('en')}
        style={{
          padding: '0.5rem 1rem',
          border: 'none',
          borderRadius: '0.25rem',
          backgroundColor: language === 'en' ? 'rgba(255, 255, 255, 0.9)' : 'transparent',
          color: language === 'en' ? '#374151' : 'rgba(255, 255, 255, 0.8)',
          fontSize: '0.875rem',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}
      >
        🇺🇸 English
      </button>
    </div>
  );
}
