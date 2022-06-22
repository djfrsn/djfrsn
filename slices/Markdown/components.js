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
}

export default markdownComponents
