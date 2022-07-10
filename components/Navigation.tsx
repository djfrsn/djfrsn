import classnames from 'classnames';
import { SITE_PATHS } from 'lib/const';
import { GlobalType, NavigationItemType } from 'lib/types';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { Logo, LogoText } from './Logo';
import styles from './navigation.module.css';

const NavigationItems = ({
  items,
  listStyle = false,
}: {
  items: NavigationItemType[]
  listStyle?: boolean
}) => {
  const router = useRouter()

  return (
    <>
      {items.map(({ title, link }, key) => {
        const linkPath = `/${link.uid}`

        return (
          <li
            key={key}
            className={classnames('list-style-custom', {
              'list-none': !listStyle,
            })}
          >
            <Link href={linkPath}>
              <a
                className="link select-none"
                data-active={
                  router.asPath === '/'
                    ? SITE_PATHS.root.includes(linkPath)
                    : router.asPath === linkPath
                }
              >
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
  listStyle,
  global,
}: {
  navigation: GlobalType['navigation']
  listStyle?: boolean
  global: GlobalType
}) {
  if (!navigation?.length) return null

  return (
    <nav className={styles.nav}>
      <ul className={styles.navigationList}>
        <NavigationItems items={navigation} listStyle={listStyle} />
      </ul>

      <div className={classnames('dropdown', styles.mobileNav)}>
        <label tabIndex={0} className="btn btn-ghost btn-circle">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h7"
            />
          </svg>
        </label>
        <ul
          tabIndex={0}
          className={classnames(
            'menu menu-compact dropdown-content',
            styles.mobileNavItems
          )}
        >
          <NavigationItems items={navigation} />
        </ul>
      </div>

      <div className="navbar-end">
        <LogoText title={global.title} />
        <Logo className="ml-2" src={global.logo.url} alt={global.logo.alt} />
      </div>
    </nav>
  )
}

export { NavigationItems }
