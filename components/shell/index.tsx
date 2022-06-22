import classNames from 'classnames';

import styles from './shell.module.css';

export default function Shell({
  children,
  className = "",
  type = "app",
}: {
  children: React.ReactNode;
  className?: string;
  type?: "os" | "app" | "visual" | "txt" | "stream" | "keyboard";
}) {
  return (
    <div
      className={classNames(
        styles.shellContainer,
        styles[`shell-${type}`],
        className
      )}
    >
      <div
        className={classNames(styles.outerShell, styles[`outer-shell-${type}`])}
      >
        <div
          className={classNames(
            styles.innerShell,
            styles[`inner-shell-${type}`]
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
