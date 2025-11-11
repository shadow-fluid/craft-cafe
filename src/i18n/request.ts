import { getRequestConfig } from 'next-intl/server';
import getLocale from '@lib/getLocale'

export default getRequestConfig(getLocale);