import Link from 'next/link';

import parseUrl from './parseUrl';

function htmlSerializer(type, element, content, children, key) {
  if (type === 'hyperlink') {
    return (
      <Link href={parseUrl(element.data.url)}>
        <a className="link" id={key}>
          {children}
        </a>
      </Link>
    )
  }

  return null
}

export default htmlSerializer
