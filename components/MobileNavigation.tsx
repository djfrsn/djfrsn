import classNames from 'classnames';
import { GlobalType } from 'lib/types';
import { Dispatch, SetStateAction } from 'react';

import { Logo, LogoText } from './Logo';
import styles from './mobileNavigation.module.css';
import { NavigationItems } from './Navigation';

export default function MobileNavigation({
  title,
  logo,
  navigation,
  modalOpen,
  toggleModal,
}: {
  title: GlobalType['title']
  logo: GlobalType['logo']
  navigation: GlobalType['navigation']
  modalOpen: boolean
  toggleModal: Dispatch<SetStateAction<boolean>>
}) {
  return (
    <div className={styles.mobileNavigation}>
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </label>
          <nav
            tabIndex={0}
            className={classNames(
              'menu menu-compact dropdown-content ',
              styles.navItems
            )}
          >
            <ul>
              <NavigationItems items={navigation} />
            </ul>
          </nav>
        </div>
      </div>
      {logo && (
        <div className="navbar-end items-center select-none">
          <LogoText title={title} />
          <Logo className="ml-2 mr-4" src={logo.url} alt={logo.alt} />
        </div>
      )}
    </div>
  )
}
