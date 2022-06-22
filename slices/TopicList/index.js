import { PrismicRichText } from '@prismicio/react';
import Shell from 'components/shell';
import ShellHeader from 'components/shell/Header';
import Link from 'next/link';
import React from 'react';
import { RichTextToMarkdown } from 'slices/Markdown';

import styles from './topicList.module.css';

const TopicList = ({ slice }) => {
  return (
    <>
      <PrismicRichText
        field={slice.primary.title}
        components={{
          heading2: ({ children }) => (
            <h2 className={styles.listHeading}>{children}</h2>
          ),
        }}
      />
      <section className={styles.list}>
        {slice?.items?.map((item, i) => (
          <article key={i} className={styles.listItem}>
            <Link
              href="/[uid]/[topic]"
              as={`/${item.topics.data.category.uid}/${item.topics.uid}`}
            >
              <a>
                <Shell type="txt">
                  <ShellHeader title={item.topics.data.title} />
                  <div className={styles.topicListPreview}>
                    <RichTextToMarkdown content={item.topics.data.preview} />
                  </div>
                </Shell>
              </a>
            </Link>
          </article>
        ))}
      </section>
    </>
  )
}

export default TopicList
