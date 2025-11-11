'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import useIntersectionObserver from '@hooks/useIntersectionObserver';
import styles from './styles/menu.module.css';

export default function SocialLinks() {
  const t = useTranslations('app.header');
  const socialRef = useRef<HTMLDivElement>(null);

  useIntersectionObserver(socialRef, styles.visible, { once: false });

  const socialLinks = [
    {
      href: 'https://instagram.com/craftcafe',
      label: t('social.instagram'),
    },
    {
      href: 'https://facebook.com/craftcafe',
      label: t('social.facebook'),
    },
    {
      href: 'https://twitter.com/craftcafe',
      label: t('social.twitter'),
    },
  ];

  return (
    <div ref={socialRef} className={styles.socialLinkList}>
      {socialLinks.map((link) => (
        <a
          key={link.href}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.socialLink}
          aria-label={link.label}
        >
          <i className={`fab fa-${link.label.toLowerCase()}`}></i>
        </a>
      ))}
    </div>
  );
}