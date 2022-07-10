import { PrismicRichText } from '@prismicio/react';
import htmlSerializer from 'lib/utils/htmlSerializer';
import Image from 'next/image';

import styles from './profile.module.css';

function Profile({ content }) {
  const { name, jobTitle, profilePhoto, profileDescription } = content

  return (
    <div className="flex flex-col text-base-content">
      <div className={styles.header}>
        <div className={styles.profileImageContainer}>
          <Image
            className={styles.profileImage}
            alt={profilePhoto.alt}
            src={profilePhoto.url}
            height={120}
            width={120}
          />
        </div>
        <div className={styles.titleContainer}>
          <h1>{name}</h1>
          <h2>{jobTitle}</h2>
        </div>
      </div>
      <div className={styles.description}>
        <PrismicRichText
          field={profileDescription}
          components={htmlSerializer}
        />
      </div>
    </div>
  )
}

export default Profile
