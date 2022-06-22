import classNames from 'classnames';

import styles from './utilBar.module.css';

function UtilBar({
  className = '',
  children,
  type = '',
}: {
  className?: string
  children: React.ReactNode
  type?: 'header' | 'footer' | ''
}) {
  return (
    <div
      className={classNames(
        styles.utilBarContainer,
        className,
        styles[`util-bar-${type}`]
      )}
    >
      {children}
    </div>
  )
}

export default UtilBar
