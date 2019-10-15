import styles from './styles.scss';
import React from 'react'
import SLink from './SLink';
import profileImg from 'assets/profile-picture.jpg'

const Sidebar = () => {
    return (
        <div className={styles.container}>
            <img src={profileImg} alt="Profile Picture" className={styles.picture}/>
            <SLink link="" title="Start" isActive={true}/>
            <SLink link="" title="Resume" isActive={false}/>
        </div>
    )
}

export default Sidebar;
