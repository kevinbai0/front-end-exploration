import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createTheme, ThemeProvider } from 'style-x'

const newTheme = {
    colors: {
       primary: "#B399F8",
       background: "#F9F9F9"
    },
    fontFamily: {
        mainFont: "Roboto"
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
