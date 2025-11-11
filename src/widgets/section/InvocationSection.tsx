import { getTranslations } from 'next-intl/server';
import SectionWrapper from '@feature/Content/SectionWrapper';
import CardContent from '@feature/Content/CardContent';
import styles from './styles/invocation.module.css';

export default async function InvocationSection({id}: {id: string}) {
  const t = await getTranslations('home.coffeeTea');
  const imageUrl = t('sectionImage')
  
  return (
    <SectionWrapper id={id} classOuter={styles.sectionOuter} classMain={styles.sectionMain} >
      <div className={styles.sectionInner}>
        <div className={styles.backgroundArea} />
        <CardContent imageUrl={imageUrl}/>
      </div>
    </SectionWrapper>
  );
}