import React from 'react'
import { hot } from 'react-hot-loader/root';
import Sidebar from '../Sidebar'
import styles from './styles.scss'

const App = () => {
    return (
        <div className={styles.container}>
            Test
            <Sidebar />
        </div>
    )
}

export default hot(App);
