import { createContext, useContext, useState, useEffect } from 'react'
import t from './lang'

const LangContext = createContext({ lang: 'en', T: t.en })

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'en')

  useEffect(() => {
    const sync = () => setLang(localStorage.getItem('lang') || 'en')
    window.addEventListener('storage', sync)
    return () => window.removeEventListener('storage', sync)
  }, [])

  return (
    <LangContext.Provider value={{ lang, T: t[lang] }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  return useContext(LangContext)
}
