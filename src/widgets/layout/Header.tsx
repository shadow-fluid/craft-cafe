import { getTranslations } from 'next-intl/server';
import Menu from '@feature/layout/header/Menu';
import ThemesManager from '@entity/layout/header/ThemesManager';
import LanguageSwitcher from '@entity/layout/header/LanguageSwitcher';
import { config } from '@lib/config'
import { validateLocale, ValidLocale } from './model/locale';
import styles from './styles/header.module.css';

const defaultILocales = {
  locales: ['en', 'ru', 'zh']
}

interface LanguageAria {
  [key: string]: string
}


export default async function Header() {
  const t = await getTranslations('app.header');
  const tLang = await getTranslations('app.header.lang');
  
  const res = await fetch(`${config.apiBaseUrl}/api/locale`)
  const serverLocale = (res.ok) ? await res.json() : {}
  const locale: ValidLocale = (res.ok && validateLocale(serverLocale)) ? serverLocale : defaultILocales
  
  const collectLanguageObject = (locale: ValidLocale): LanguageAria => {
    const langText: LanguageAria = {}
    
    for (let lang of locale.locales) {
      const textLanguage = tLang(lang.toUpperCase())
      
      if (typeof textLanguage === 'string') {
        langText[lang] = textLanguage
      }
    }
    return langText
  }
  
  const languageAria = collectLanguageObject(locale)

  return (
    <header className={styles.headerMain}>
      <div className={styles.headerInner}>
        <h1 className={styles.headerTitle}>{t('title')}</h1>
        <div className={styles.headerControls}>
          <ThemesManager />
          <LanguageSwitcher
            locales={locale.locales}
            languageAria={languageAria}
            textSelect={t('selectLanguage')}
          />
          <Menu 
            locales={locale.locales}
            languageAria={languageAria}
            textSelect={t('selectLanguage')}
          />
        </div>
      </div>
    </header>
  );
}