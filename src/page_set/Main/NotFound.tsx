'use client'
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation'
import styles from "../styles/page.module.css";

const unrealizedRoutes = ['catalog', 'blog', 'about', 'gallery']

const checkRoute = (pathname: string | unknown): boolean => {
  if (typeof pathname !== 'string') return false;
  
  const route = pathname.split('/').join('').trim()
  return unrealizedRoutes.includes(route)
}

function NotFoundPage() {
  const pathname = usePathname()
  const t = useTranslations('app.notFound')

  return (
    <div className={styles.notFound}>
      <div className={styles.notFoundContainer}>
      	<div className={styles.wrapCodeError}>
      		<div className={styles.codeError}>
      			404
      		</div>
      	</div>
      	<div className={styles.massage}>
      	  <p className={styles.massageText}>
      	    {
      	      checkRoute(pathname) ?
      	        t('massage') : t('alterMassage')
      	    }
      	  </p>
      	</div>
      </div>
    </div>
  )
}

export default NotFoundPage;
