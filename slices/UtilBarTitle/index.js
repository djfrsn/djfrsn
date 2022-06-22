import { PrismicRichText } from '@prismicio/react';
import classNames from 'classnames';
import BackButton from 'components/BackButton';
import UtilBar from 'components/UtilBar';
import parseUrl from 'lib/parseUrl';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import packageDetails from '../../package.json';
import styles from './utilBarTitle.module.css';

const htmlSerializer = (type, element, content, children, key) => {
  if (type === 'hyperlink') {
    return (
      <Link href={parseUrl(element.data.url)}>
        <a className={classNames('link', styles.link)} id={key}>
          {children}
        </a>
      </Link>
    )
  }

  return null
}

const UtilBarTitle = ({ slice }) => {
  const router = useRouter()
  const onHomePath = router.pathname === '/'

  return (
    <UtilBar type="header">
      <div className={styles.utilBarTitleContainer}>
        <div className={styles.backButton} data-hidden={onHomePath}>
          <BackButton />
        </div>
        <PrismicRichText
          field={slice.primary.title}
          components={htmlSerializer}
        />
        <span>OS</span>
        <span>32</span>
      </div>
      <p className="ml-auto select-none">
        OS{' '}
        <a
          className={classNames('link', styles.link)}
          href={`${packageDetails.repository.url
            .replace('git+', '')
            .replace('.git', '')}/releases/tag/v${packageDetails.version}`}
          target="_blank"
          alt={packageDetails.description}
        >
          v{packageDetails.version}
        </a>{' '}
        | 032
      </p>
    </UtilBar>
  )
}

export default UtilBarTitle
