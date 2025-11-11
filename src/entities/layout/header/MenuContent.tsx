'use client';

import Nav from '@shared/layout/header/Nav';
import SocialLinks from '@shared/layout/header/SocialLinks';
import styles from './styles/general.module.css';

interface MenuContentProps {
  setIsOpen: (isOpen: boolean) => void;
}

export default function MenuContent({ setIsOpen }: MenuContentProps) {
  return (
    <div className={styles.menuContent}>
      <Nav setIsOpen={setIsOpen} />
      <SocialLinks />
    </div>
  );
}