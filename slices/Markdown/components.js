import isAbsoluteUrl from 'is-absolute-url';
import Link from 'next/link';

// Docs: https://github.com/remarkjs/react-markdown#use-custom-components-syntax-highlight

const markdownComponents = {
  a: ({ node, ...props }) =>
    isAbsoluteUrl(props.href) ? (
      <a className="link" {...props} target="_blank" />
    ) : (
      <Link {...props}>
        <a {...props}></a>
      </Link>
    ),
  ul: ({ node, children, ordered, ...props }) => (
    <ul
      className="list-style-disc pl-4"
      ordered={ordered.toString()}
      {...props}
    >
      {children}
    </ul>
  ),
}

export default markdownComponents
