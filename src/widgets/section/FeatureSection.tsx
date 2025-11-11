import Image from 'next/image'
import { getTranslations } from 'next-intl/server';
import FeatureCard from '@feature/Content/FeatureCard';
import SectionWrapper from '@feature/Content/SectionWrapper';
import styles from './styles/feature.module.css';

export default async function FeatureSection({id}: {id: string}) {
  const t = await getTranslations('home.feature');
  const imageUrl = t('sectionImage')

  return (
    <SectionWrapper id={id} classOuter={styles.sectionOuter} classMain={styles.sectionMain}>
      <Image className={styles.sectionImage}
        src={imageUrl} fill={true} alt=''/>
      <div className={styles.sectionInner}>
        <FeatureCard
          title={t('card.title')}
          description={t('card.description')}
          buttonText={t('card.button')}
        />
      </div>
    </SectionWrapper>
  );
}