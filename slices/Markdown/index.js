import { asText } from '@prismicio/helpers';
import React from 'react';
import ReactMarkdown from 'react-markdown';

import components from './components';
import styles from './markdown.module.css';

export const RichTextToMarkdown = ({ content, onLinkClick }) => (
  <ReactMarkdown
    components={components({ onLinkClick })}
    children={asText(content)}
  />
)

const Markdown = ({ slice }) => (
  <section className={styles.container}>
    <RichTextToMarkdown content={slice.primary.content} />
  </section>
)

export default Markdown
