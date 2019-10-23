import styles from './styles.scss';
import {useTranslation} from 'react-i18next';
import React from 'react'
import SLink from './SLink';
import profileImg from 'assets/images/profile-picture.jpg'

const Sidebar = () => {
    const { t } = useTranslation();

    return (
        <div className={styles.container}>
            <img src={profileImg} alt={t('sidebar.profilePicture')} className={styles.picture}/>
            <SLink link="" title={t('sidebar.menu.start')} isActive={true}/>
            <SLink link="" title={t('sidebar.menu.resume')} isActive={false}/>
        </div>
    )
}

export default Sidebar;
