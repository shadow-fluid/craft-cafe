'use client'
import { useRef, memo } from 'react'
import useIntersectionObserver from '@hooks/useIntersectionObserver'
import styles from '@widget/section/styles/coffeeCakes.module.css';

interface PartProps {
  key: string | number
  type: 'image' | 'card' | 'text';
  image?: string;
  title?: string;
  description?: string;
  isFirst?: boolean;
  isLast?: boolean;
}

function Part({ type, image, title, description, isFirst, isLast }: PartProps) {
  const partRef = useRef(null)
  
  useIntersectionObserver(partRef, styles.visible, { once: false, threshold: 0 })
  
  if (type === 'image') {
    return (
      <div ref={partRef} className={styles.partOuterImage}>
        <div className={styles.partInner}>
          <div
            className={`${styles.partImage} ${isFirst ? styles.partImageFirst : ''} ${isLast ? styles.partImageLast : ''}`}
            style={{ backgroundImage: `url(${image})` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div ref={partRef} className={type === 'card' ? styles.partOuterCard : styles.partOuterText}>
      <div className={type === 'card' ? styles.partCard : styles.partText}>
        {type === 'card' && <h3 className={styles.partTitle}>{title}</h3>}
        <p className={styles.partDescription}>{description}</p>
      </div>
    </div>
  );
}

export default memo(Part);