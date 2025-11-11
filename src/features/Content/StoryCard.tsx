import Image from 'next/image'
import styles from '@widget/section/styles/stories.module.css';

interface StoryCardProps {
  imageUrl: string
  title: string
  key: string | number
}

export default function StoryCard({ imageUrl, title }: StoryCardProps) {
  return (
    <div className={styles.cardOuter}>
      <div className={styles.cardMain} >
        <Image className={styles.cardImage}
          src={imageUrl} fill={true} alt={title}/>
      </div>
    </div>
  );
}
