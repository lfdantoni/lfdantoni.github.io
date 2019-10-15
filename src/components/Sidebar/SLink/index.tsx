import React from 'react'
import styles from './styles.scss'

export interface LinkProp {
    link: string,
    title: string,
    isActive: boolean // TODO remove it after add router
}

const SLink = (props: LinkProp) => {
    return (
        <div className={styles.container}>
           <a href={props.link} className={props.isActive ? styles.active : null}><span>{props.title}</span></a>
        </div>
    )
}

export default SLink
