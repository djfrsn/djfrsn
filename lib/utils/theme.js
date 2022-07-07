/**
 * HACK: Setting the theme attr in document only works on initial page load, so we also set the html attr in the layout on route change for dynamic theme
 * FIXME: figure out how to set the theme with ssr and on route change in a single place, we shouldn't have to set the theme on both the server and client
 * @returns return string on server and undefined in browser
 */
export default function theme(props) {
  const homeroomThemePages = ['/', '/bio']

  if (typeof window === 'undefined') {
    switch (true) {
      case homeroomThemePages.includes(props.__NEXT_DATA__.page):
        return 'homeroom'
      default:
        return 'tron'
    }
  } else {
    const htmlTag = document.documentElement
    switch (true) {
      case homeroomThemePages.includes(props.pathname):
        htmlTag.setAttribute('data-theme', 'homeroom')
        break
      default:
        htmlTag.setAttribute('data-theme', 'tron')
        break
    }
  }
}
