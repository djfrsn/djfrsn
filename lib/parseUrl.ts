import isAbsoluteUrl from 'is-absolute-url';

export default function parseUrl(val) {
  let url = val

  if (isAbsoluteUrl(val)) {
    const includesSiteUrl = val.includes(process.env.NEXT_PUBLIC_SITE_URL)

    if (includesSiteUrl && process.env.NODE_ENV !== 'production') {
      const newUrl = val.split(process.env.NEXT_PUBLIC_SITE_URL)[1]

      if (!newUrl.startsWith('/')) {
        url = `/${newUrl}`
      } else {
        url = newUrl
      }
    }
  }

  return url
}
