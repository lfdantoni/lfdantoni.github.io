import React, {Suspense} from 'react'
import {useTranslation} from 'react-i18next';
import {hot} from 'react-hot-loader/root'
import Sidebar from '../Sidebar'
import styles from './styles.module.scss'

const Page = () => {
    const { t } = useTranslation();

    return (
        <div className={styles.container}>
            {t('title')}
            <Sidebar />
        </div>
    )
}

const Loader = () => (
    <div className="App">
      <div>loading...</div>
    </div>
  );
  
  // here app catches the suspense from page in case translations are not yet loaded
function App() {
    return (
        <Suspense fallback={<Loader />}>
            <Page />
        </Suspense>
    );
}

export default hot(App);
