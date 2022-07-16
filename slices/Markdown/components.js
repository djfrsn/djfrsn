import parseUrl from 'lib/utils/parseUrl';
import Link from 'next/link';

// Docs: https://github.com/remarkjs/react-markdown#use-custom-components-syntax-highlight

const markdownComponents = ({ onLinkClick = () => null }) => ({
  a: ({ node, href, ...props }) => {
    return href.includes(process.env.NEXT_PUBLIC_SITE_URL) ? (
      <Link href={parseUrl(href)} {...props}>
        <a className="link" {...props} onClick={e => onLinkClick(e)}></a>
      </Link>
    ) : (
      <a className="link" href={href} {...props} target="_blank" />
    )
  },
  ul: ({ node, children, ordered, ...props }) => (
    <ul
      className="list-style-disc pl-4"
      ordered={ordered.toString()}
      {...props}
    >
      {children}
    </ul>
  ),
})

export default markdownComponents
