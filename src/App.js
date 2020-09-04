import React, { Suspense, lazy } from 'react';
import './App.less'
import { Provider } from 'react-redux';
import store from './app/store';
import { Switch, Route, Link } from "react-router-dom";
import routes from './routes';

const Home = lazy(() => import("./features/Home"));

function App() {
    return (
        <div className="App">
            <h2>Welcome to React Tutorial</h2>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <ul className="navbar-nav mr-auto">
                    {routes.map((route) => (
                        <li>
                            <Link className="nav-link" to={route.path}>{route.name}</Link>
                        </li>
                    ))}
                </ul>
            </nav>
            <hr />
            <Provider store={store}>
                    {routes.map((route) => (
                        <Route exact path={route.path} component={WaitingComponent(route.component)} />
                    ))}
                   
            </Provider>
        </div>
    );
}

const WaitingComponent = (Component) => {
    return props => (
        <Suspense fallback={<div>Loading...</div>}>
            <Component {...props} />
        </Suspense>
    );
}

export default App;
