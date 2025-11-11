import Image from 'next/image'
import styles from '@widget/section/styles/popular.module.css';

interface IDish {
  imageUrl: string
  title: string;
  description: string;
  price: string;
}

type IDishList = IDish[]

interface DishCardProps extends IDish {
  key: string | number
}

export default function DishCard({ imageUrl, title, description, price }: DishCardProps) {
  return (
    <div className={styles.cardOuter}>
      <div className={styles.cardMain}>
        <div className={styles.cardImageWrapper}>
          <Image className={styles.cardImage} 
            src={imageUrl} fill={true} alt={title}/>
        </div>
        <div className={styles.cardInner}>
          <h3 className={styles.cardTitle}>{title}</h3>
          <p className={styles.cardDescription}>{description}</p>
          <div className={styles.cardFooter}>
            <span className={styles.cardPrice}>{price}</span>
            <button className={styles.cardButton}>Buy Now</button>
          </div>
        </div>
      </div>
    </div>
  );
}
