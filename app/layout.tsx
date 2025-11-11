import { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import Head from 'next/head';
import Notification from '@feature/layout/Notification';
import Header from '@widget/layout/Header';
import Footer from '@widget/layout/Footer';
import { config } from '@lib/config'
import { validateMessage } from '@lib/utils/validate'
import { toLowerCaseFirstTwoAdjacentLetters } from '@lib/utils/microFuncSet'
import getLocale from '@lib/getLocale'
import './globals.css';

type Locale = 'en' | 'ru' | 'zh';

export async function generateMetadata() {
  const { locale, messages } = await getLocale()
  const saveLocale = typeof locale === 'string' ? locale : config.defaultLocale
  const siteUrl = 'https://craft-cafe.vercel.app/';
  
  if (validateMessage(messages)) {
    const saveLocale = locale
    const { title, description, ogDescription, twitterDescription, keywords } = messages.metadata
    const { header } = messages.app
    
    const languages = Object.fromEntries(
      Object.keys(header.lang)
        .map((key) => [toLowerCaseFirstTwoAdjacentLetters(key), '/'])
    )
    
    return {
      title,
      description,
      alternates: {
        languages,
      },
      openGraph: {
        title,
        description: ogDescription,
        url: `${siteUrl}`,
        type: 'website',
        locale: saveLocale === 'zh' ? 'zh_CN' : saveLocale,
        siteName: header.title || 'Craft Cafe',
      },
      twitter: {
        title,
        description: twitterDescription,
        site: '@CraftCafeNYC',
      },
      other: {
        'content-language': saveLocale,
        keywords,
        robots: 'index, follow',
      },
    };
  } else {
    
    return {
      title: "Craft Cafe | Artisanal Coffee & Pastries in NYC",
      description: "",
      alternates: {
        languages: {
          en: '/',
        },
      },
      openGraph: {
        title: "Craft Cafe | Artisanal Coffee & Pastries in NYC",
        description: "Savor handcrafted coffee and pastries at Craft Cafe, a cozy NYC retreat. Join us for a moment of calm in the heart of Manhattan.",
        url: `${siteUrl}`,
        type: 'website',
        locale: saveLocale === 'zh' ? 'zh_CN' : saveLocale,
        siteName: messages.header?.title || 'Craft Cafe',
      },
      twitter: {
        title: "Craft Cafe | Artisanal Coffee & Pastries in NYC",
        description: "Craft Cafe: Artisanal coffee & pastries in NYC. Visit us for a cozy break! ☕",
        site: '@CraftCafeNYC',
      },
      other: {
        'content-language': saveLocale,
        keywords: "craft cafe, artisanal coffee, NYC cafe, Manhattan coffee shop, pastries, vegetarian menu",
        robots: 'index, follow',
      },
    };
  }
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const { locale, messages } = await getLocale()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CafeOrCoffeeShop',
    name: messages.header?.title || 'Craft Cafe',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Coffee Lane',
      addressLocality: 'Manhattan',
      addressRegion: 'NYC',
      postalCode: '10001',
      addressCountry: 'US',
    },
    telephone: '(123) 456-7890',
    url: 'https://craft-cafe.vercel.app/',
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 40.748817,
      longitude: -73.985428,
    },
    openingHours: 'Mo-Su 08:00-20:00',
    servesCuisine: ['Coffee', 'Pastries', 'Vegetarian'],
    sameAs: [
      'https://www.instagram.com',
      'https://www.facebook.com',
      'https://twitter.com',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '(123) 456-7890',
      contactType: 'Customer Service',
      email: 'hello@craftcafe.com',
    },
  };

  return (
    <html lang={locale}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header />
          <Notification cssStyles={{
            position: 'fixed', 
            bottom: 'var(--spacing-md)', 
            right: 'var(--spacing-md)',
            left: 'var(--spacing-md)',
            zIndex: '1000',
            width: 'auto'
          }}/>
          {children}
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}