import Link from 'next/link';

function LogoText({ title }: { title: string }) {
  return (
    <div>
      <Link href="/">
        <a className="ml-auto pl-1 py-1 uppercase">{title}</a>
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
  return (
    <img className={className} src={src} alt={alt} height="59px" width="59px" />
  )
}

export { LogoText, Logo }
