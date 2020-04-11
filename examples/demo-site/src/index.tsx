import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createTheme, ThemeProvider } from 'style-x'

const newTheme = {
  colors: {
      green: "#00ff00"
  }
}


const theme = createTheme(newTheme)

declare module "../../../src/theme/index.d" {
  type NewTheme = typeof newTheme
  export interface ThemeExtension extends NewTheme {}
}

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
