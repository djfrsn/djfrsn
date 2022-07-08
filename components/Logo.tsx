import classnames from 'classnames';
import Link from 'next/link';

function LogoText({ title }: { title: string }) {
  return (
    <div>
      <Link href="/">
        <a className="ml-auto pl-1 py-1 uppercase hover:text-accent transition-colors duration-300">
          {title}
        </a>
      </Link>
    </div>
  )
}

function Logo({
  alt = 'Logo',
  className = '',
  src,
}: {
  alt?: string
  className?: string
  src: string
}) {
  return src ? (
    <img className={className} src={src} alt={alt} height="59px" width="59px" />
  ) : (
    <div className={classnames(className, 'text-secondary cursor-default')}>
      ∆
    </div>
  )
}

export { LogoText, Logo }
