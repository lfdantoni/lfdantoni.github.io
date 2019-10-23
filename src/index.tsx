import React from 'react';
import { render } from 'react-dom';
import App from './components/App/App';
import './index.scss';
import './config/i18n'

render(
  <App />,
  document.getElementById('root')
)
