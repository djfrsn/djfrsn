import { PrismicRichText } from '@prismicio/react';
import Image from 'next/image';

import styles from './profile.module.css';

function Profile({ content }) {
  const { name, jobTitle, profilePhoto, profileDescription } = content

  return (
    <div className="flex flex-col text-base-content">
      <div className={styles.profileHeader}>
        <div className={styles.titleContainer}>
          <h1>{name}</h1>
          <h2>{jobTitle}</h2>
        </div>
        <div className={styles.profileImageContainer}>
          <Image
            alt={profilePhoto.alt}
            src={profilePhoto.url}
            height={120}
            width={120}
          />
        </div>
      </div>
      <div className={styles.profileDescription}>
        <PrismicRichText field={profileDescription} />
      </div>
    </div>
  )
}

export default Profile
