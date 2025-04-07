import React, { createContext, useState, useContext, useEffect } from 'react';

// 翻译数据
const translations = {
  'zh-CN': {
    settings: {
      // 中文翻译...
    }
  },
  'en-US': {
    settings: {
      // 英文翻译...
    }
  }
};

// 创建上下文
const LocalizationContext = createContext();

// 提供者组件
export const LocalizationProvider = ({ children }) => {
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'zh-CN');
  
  // 翻译函数
  const t = (key) => {
    const keys = key.split('.');
    let result = translations[language];
    
    for (const k of keys) {
      if (result && result[k]) {
        result = result[k];
      } else {
        return key;
      }
    }
    
    return result;
  };
  
  // 切换语言
  const changeLanguage = (lang) => {
    if (translations[lang]) {
      setLanguage(lang);
      localStorage.setItem('language', lang);
    }
  };
  
  useEffect(() => {
    // 可以在这里添加语言变化时的其他逻辑
  }, [language]);
  
  return (
    <LocalizationContext.Provider value={{ t, language, changeLanguage }}>
      {children}
    </LocalizationContext.Provider>
  );
};

// 自定义 hook
export const useLocalization = () => useContext(LocalizationContext);