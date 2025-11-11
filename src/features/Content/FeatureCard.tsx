'use client'
import { useRef, memo } from 'react'
import useIntersectionObserver from '@hooks/useIntersectionObserver'
import styles from '@widget/section/styles/feature.module.css';

interface FeatureCardProps {
  title: string;
  description: string;
  buttonText: string;
}

function FeatureCard({ title, description, buttonText }: FeatureCardProps) {
  const cardRef = useRef(null)
  
  useIntersectionObserver(cardRef, styles.visible, { once: false })
  
  return (
    <div ref={cardRef} className={styles.featureCardOuter}>
      <div className={styles.featureCardMain}>
        <div className={styles.featureCardInner}>
          <h1 className={styles.featureCardTitle}>{title}</h1>
          <p className={styles.featureCardText}>{description}</p>
          <a href="#" className={styles.featureCardButton}>
            {buttonText}
          </a>
        </div>
      </div>
    </div>
  );
}

export default memo(FeatureCard)