import { PrismicRichText, PrismicRichTextProps } from '@prismicio/react';

import styles from './shell.module.css';

const Title = ({ children, id }) => (
  <h3 key={id}>
    {children}
    <span>.TXT</span>
  </h3>
)

const htmlSerializer = (type, element, content, children, key) => {
  if (type === 'heading3') {
    return <Title id={key}>{children}</Title>
  }

  return null
}

function ShellHeader({
  title,
}: {
  title: PrismicRichTextProps['field'] | string
}) {
  return (
    <div className={styles.headerContainer}>
      {typeof title === 'string' ? (
        <Title id="shell-title">{title}</Title>
      ) : (
        <PrismicRichText field={title} components={htmlSerializer} />
      )}
      <em>end. program</em>
    </div>
  )
}

export default ShellHeader
