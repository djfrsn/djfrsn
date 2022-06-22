import { GlobalType, NavigationItemType } from 'lib/types';
import Link from 'next/link';
import { useRouter } from 'next/router';

import styles from './navigation.module.css';

const NavigationItems = ({ items }: { items: NavigationItemType[] }) => {
  const router = useRouter()

  return (
    <>
      {items.map(({ title, link }, key) => {
        const linkPath = `/${link.uid}`

        return (
          <li key={key}>
            <Link href={linkPath}>
              <a className="link" data-active={router.asPath === linkPath}>
                {title}
              </a>
            </Link>
          </li>
        )
      })}
    </>
  )
}

export default function Navigation({
  navigation,
}: {
  navigation: GlobalType['navigation']
}) {
  return (
    <nav className="text-ash-100 hidden md:block">
      <ul className={styles.navigationList}>
        <NavigationItems items={navigation} />
      </ul>
    </nav>
  )
}

export { NavigationItems }
