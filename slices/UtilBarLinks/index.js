import { PrismicRichText } from '@prismicio/react';
import UtilBar from 'components/UtilBar';
import Link from 'next/link';
import React from 'react';

import styles from './utilBarLinks.module.css';

const htmlSerializer = (type, element, content, children, key) => {
  if (type === 'group-list-item') {
    return <ul key={key}>{children}</ul>
  }
  if (type === 'list-item') {
    return <li key={key}>{children}</li>
  }

  return null
}

const UtilBarLinks = ({ slice }) => (
  <UtilBar type="footer">
    <Link href="/helpful-links">HELPFUL LINKS 008</Link>
    <div className={styles.utilBarLinks}>
      <div className={styles.marquee}>
        {slice?.items?.map((item, i) => (
          <PrismicRichText
            key={i}
            field={item.links}
            components={htmlSerializer}
          />
        ))}
        <span>|</span>
        {slice?.items?.map((item, i) => (
          <PrismicRichText
            key={i}
            field={item.links}
            components={htmlSerializer}
          />
        ))}
      </div>
    </div>

    <div className={styles.utilBarOrnament}>
      <div />
      <div />
      <div />
    </div>
  </UtilBar>
)

export default UtilBarLinks
