import Link from 'next/link';

function LogoText({ title }: { title: string }) {
  return (
    <div>
      <Link href="/">
        <a className="ml-auto text-xs text-iced-100 pl-1 py-1 border-iced-100 rounded-lg border-l-2 border-t-2 border-b-2 font-logo uppercase">
          {title}
        </a>
      </Link>
    </div>
  )
}

function Logo({
  alt = '',
  className = '',
  src,
}: {
  alt?: string
  className?: string
  src: string
}) {
  return <img className={className} src={src} alt={alt} />
}

export { LogoText, Logo }
