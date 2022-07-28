import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import * as serviceWorker from './serviceWorker'
import App from './app/App'
import {store} from './app/store'
import {Provider} from 'react-redux'
import {HashRouter} from 'react-router-dom'

ReactDOM.render(
    <Provider store={store}>
        <HashRouter>
            <App />
        </HashRouter>
    </Provider>, document.getElementById('root'))

serviceWorker.unregister()
