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
    <nav className="navbar container mx-auto text-ash-500 hidden px-6 pt-8 pb-0 lg:flex">
      <ul className={classnames('navbar-start', styles.navigationList)}>
        <NavigationItems items={navigation} listStyle={listStyle} />
      </ul>

      <div className="navbar-end">
        <LogoText title={global.title} />
        <Logo className="ml-2" src={global.logo.url} alt={global.logo.alt} />
      </div>
    </nav>
  )
}

export { NavigationItems }
