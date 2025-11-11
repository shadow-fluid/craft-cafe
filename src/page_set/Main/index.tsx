import FeatureSection from '@widget/section/FeatureSection';
import CoffeeCakesSection from '@widget/section/CoffeeCakesSection';
import Services from '@widget/section/Services';
import CategoryListSection from '@widget/section/CategoryListSection';
import PopularSection from '@widget/section/PopularSection';
import StoriesSection from '@widget/section/StoriesSection';
import AdditionalInfoSection from '@widget/section/AdditionalInfoSection';
import InvocationSection from '@widget/section/InvocationSection';
import ContactSection from '@widget/section/ContactSection';
import styles from '@page/styles/page.module.css'

export default async function Home() {
  return (<main className={styles.main}>
    <FeatureSection id="feature"/>
    <CoffeeCakesSection id="coffee-cakes"/>
    <Services id="services"/>
    <CategoryListSection id="category-list"/>
    <PopularSection id="popular"/>
    <AdditionalInfoSection id="additional-info"/>
    <StoriesSection id="stories"/>
    <InvocationSection id="invocation"/>
    <ContactSection id="contact"/>
  </main>)
}