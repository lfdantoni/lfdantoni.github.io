import React from 'react'
import styles from './styles.module.scss'

export interface LinkProp {
    link: string,
    title: string,
    isActive: boolean // TODO remove it after add router
}

const SLink = (props: LinkProp) => {
    return (
        <div className={styles.container}>
           <a href={props.link} className={props.isActive ? styles.active : ''}><span>{props.title}</span></a>
        </div>
    )
}

export default SLink
