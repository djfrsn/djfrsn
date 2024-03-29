import { FooterType } from 'lib/types';
import { parseUrl } from 'next/dist/shared/lib/router/utils/parse-url';
import Image from 'next/image';
import Link from 'next/link';
import { MdOutlineAlternateEmail } from 'react-icons/md';

function FooterLinkItem({ data, ...props }) {
  switch (true) {
    case typeof data.linkImage?.url === 'string':
      return (
        <Link href={parseUrl(data.link.url)}>
          <a className="link flex w-[24px]" target="_blank">
            <Image
              src={data.linkImage.url}
              alt={data.linkImage.alt || data.linkTitle}
              height={data.linkImage.dimensions.height}
              width={data.linkImage.dimensions.width}
            />
          </a>
        </Link>
      )
    case data.link.url.includes('mailto:'):
      return (
        <Link href={parseUrl(data.link.url)}>
          <a className="link" target="_blank">
            <MdOutlineAlternateEmail />
          </a>
        </Link>
      )
    default:
      return (
        <Link href={parseUrl(data.link.url)}>
          <a className="link no-underline" target="_blank">
            {data.linkTitle}
          </a>
        </Link>
      )
  }
}

function Footer({ data }: { data: FooterType }) {
  return (
    <footer className="footer h-[120px] container px-6 py-8 mx-auto">
      {data.links && (
        <ul className="flex items-center pt-4 pb-8 md:mt-auto">
          {data.links.map((footerLink, i) => {
            return (
              <li key={i} className="mx-2 items-center">
                <FooterLinkItem data={footerLink} />
              </li>
            )
          })}
        </ul>
      )}
    </footer>
  )
}

export default Footer
