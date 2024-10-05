import type { Metadata } from 'next'

export const DONATE = {
  link: 'https://oj.oimaster.top/article/128',
  qrcode: [],
}

export const CONFIG = {
  /**
   * mark this book is work in progress
   */
  wip: true,
  /**
   * public book hostname
   */
  urlBase: 'https://next.oimaster.top',
}

export const SEO = {
  title: {
    absolute: 'NextOJ',
    template: `%s | ${'NextOJ'}`,
  },
  metadataBase: new URL(CONFIG.urlBase),
  twitter: {
    card: 'summary_large_image',
    creator: '@__oQuery',
    site: 'https://oimaster.top',
  },
  openGraph: {
    type: 'book',
    authors: ['oimasterkafuu'],
    tags: ['nextoj', 'oj', 'onlinejudge'],
    images: [],
  },
} satisfies Metadata
