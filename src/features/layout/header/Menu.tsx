'use client';

import { useState } from 'react';
import styles from '@widget/layout/styles/header.module.css';
import MenuButton from '@shared/layout/header/MenuButton';
import MenuContent from '@entity/layout/header/MenuContent';
import LanguageSwitcher from '@entity/layout/header/LanguageSwitcher';

interface MenuProps {
  locales: string[]
  languageAria: {
    [key: string]: string
  }
  textSelect: string
}

export default function Menu({ locales, languageAria, textSelect }: MenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <div className={styles.menuWrapper}>
      <MenuButton isOpen={isMenuOpen} toggle={toggleMenu} />
      <div className={`${styles.menu} ${isMenuOpen ? styles.open : ''}`}>
        <div className={styles.menuLanguage}>
          <LanguageSwitcher 
            locales={locales}
            languageAria={languageAria}
            textSelect={textSelect}
          />
        </div>
        <MenuContent setIsOpen={setIsMenuOpen} />
      </div>
    </div>
  );
}