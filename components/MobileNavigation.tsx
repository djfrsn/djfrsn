import { GlobalType } from 'lib/types';
import { Dispatch, SetStateAction } from 'react';
import { FaBars } from 'react-icons/fa';

import { Logo, LogoText } from './Logo';
import styles from './mobileNavigation.module.css';
import Modal from './Modal';
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
      <button className={styles.menuButton} onClick={() => toggleModal(true)}>
        <FaBars />
      </button>
      {modalOpen && (
        <Modal toggleModal={toggleModal}>
          <nav className={styles.navItems}>
            <ul>
              <NavigationItems items={navigation} />
            </ul>
          </nav>
        </Modal>
      )}
      {logo && (
        <div className="flex items-center ml-auto select-none">
          <LogoText title={title} />
          <Logo className="ml-2" src={logo.url} alt={logo.alt} />
        </div>
      )}
    </div>
  )
}
