import Image from 'next/image'
import { getTranslations } from 'next-intl/server';
import SectionWrapper from '@feature/Content/SectionWrapper';
import DishCard from '@feature/Content/DishCard';
import styles from './styles/popular.module.css';

interface IDish {
  imageUrl: string
  title: string;
  description: string;
  price: string;
}

type IDishList = IDish[]

export default async function PopularSection({id}: {id: string}) {
  const t = await getTranslations('home.popularDishes');
  const dishes: IDishList = [
    {
      imageUrl: t('dishes.0.image'), 
      title: t('dishes.0.title'),
      description: t('dishes.0.description'),
      price: t('dishes.0.price'),
    },
    {
      imageUrl: t('dishes.1.image'), 
      title: t('dishes.1.title'),
      description: t('dishes.1.description'),
      price: t('dishes.1.price'),
    },
    {
      imageUrl: t('dishes.2.image'), 
      title: t('dishes.2.title'),
      description: t('dishes.2.description'),
      price: t('dishes.2.price'),
    },
    {
      imageUrl: t('dishes.3.image'), 
      title: t('dishes.3.title'),
      description: t('dishes.3.description'),
      price: t('dishes.3.price'),
    },
    {
      imageUrl: t('dishes.4.image'), 
      title: t('dishes.4.title'),
      description: t('dishes.4.description'),
      price: t('dishes.4.price'),
    },
    {
      imageUrl: t('dishes.5.image'), 
      title: t('dishes.5.title'),
      description: t('dishes.5.description'),
      price: t('dishes.5.price'),
    },
  ];

  return (
    <SectionWrapper id={id} classOuter={styles.sectionOuter} classMain={styles.sectionMain} >
      <div className={styles.sectionInner}>
        <h2 className={styles.sectionTitle}>{t('title')}</h2>
        <div className={styles.cardListOuter}>
          <div className={styles.cardListMain}>
            <div className={styles.cardListInner}>
              {dishes.map((dish, index) => (
                <DishCard
                  key={index}
                  imageUrl={dish.imageUrl}
                  title={dish.title}
                  description={dish.description}
                  price={dish.price}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}