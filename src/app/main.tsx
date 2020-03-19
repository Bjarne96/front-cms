import * as React from 'react';
import autobind from 'autobind-decorator';
import { Loader, Sidebar, Segment } from "semantic-ui-react"
import { Route, Redirect } from 'react-router';

import './main.css';
import { getJWT } from './handler/JWTHandler';
import { IRouteArray } from './interfaces/componentInterfaces'

import Login from './views/login/login';
import Register from './views/register/register';
import Articles from './views/articles/articles';
import Customers from './views/customers/customers';
import Invoices from './views/invoices/invoices';
import Products from './views/products/products';
import Default from './views/default/default';

import Header from './components/header/header';
import Bar from './components/sidebar/sidebar';
import View from './components/router/router';
import Resources from './views/resources/resources';

interface IMainState {
    loggedIn: boolean,
    loading: boolean,
    showSidebar: boolean
}

//Routes for handling the diffrent components
const Routes: IRouteArray = [
    {
        path: '/login',
        component: () => <Redirect to='products' />,
        title: "Login",
        exact: true,
        showInSidebar: false
    },  
    /*{
        path: '/home',
        component: () => <Default />,
        title: "Home",
        exact: true,
        showInSidebar: true
    },
    {
        path: '/register',
        component: (props) => <Register {...props} checkSession={this.checkSession} />,
        title: "Register",
        exact: true,
        showInSidebar: true
    },
    {
        path: '/invoices',
        component: () => <Invoices />,
        title: "Invoices",
        exact: true,
        showInSidebar: true
    },*/
    {
        path: '/products',
        component: () => <Products />,
        title: "Products",
        exact: true,
        showInSidebar: true
    },
    {
        path: '/customers',
        component: () => <Customers />,
        title: "Customers",
        exact: true,
        showInSidebar: true
    },
    {
        path: '/articles',
        component: () => <Articles />,
        title: "Articles",
        exact: true,
        showInSidebar: true
    },
    {
        path: '/resources',
        component: () => <Resources />,
        title: "Resources",
        exact: true,
        showInSidebar: true
    }
];

export class Main extends React.Component<{}, IMainState> {

    constructor(props) {
        super(props);
        this.state = {
            loggedIn: false,
            loading: true,
            showSidebar: true
        }
    }

    componentDidMount() {
        this.checkSession();
    }

    render() {
        //State loading
        if(this.state.loading) return <Loader active />
        //Logged in
        if(this.state.loggedIn) {
            //Header
            //Sidebar
            //View
            return <div>
                <Header checkSession={this.checkSession} toggleSidebar={this.toggleSidebar} />
                <Sidebar.Pushable as={Segment} attached="bottom">
                    <Bar showSidebar={this.state.showSidebar} routes={Routes} />
                    <Sidebar.Pusher>
                        <div 
                            className={this.state.showSidebar ? 'mainFrameMargin mainFrame' : 'mainFrameNoMargin mainFrame'} 
                            style={{height: (window.innerHeight-60) + 'px'}}
                        >
                            <div className="innerFrame">
                                <View routes={Routes} checkSession={this.checkSession} />
                            </div>
                        </div>
                    </Sidebar.Pusher> 
                </Sidebar.Pushable>
            </div>
        }
        //Not logged in
        return <>
            <Route exact path="/login" component={(props) => <Login {...props} checkSession={this.checkSession} />}></Route>
            <Route component={() => <Redirect to="/login"></Redirect>}></Route>
        </>;
    }

    @autobind
    toggleSidebar () {
        this.setState({ showSidebar: !this.state.showSidebar })
    }

    @autobind
    async checkSession() { 
        //Resets cookie and sets loading true
        this.setState({loggedIn: false, loading: true}) 
        //Gets Cookie
        let cookie = await getJWT();
        //Sets cookie if needed
        if(cookie !== null ){
            this.setState({
                loggedIn: true
            })
        }

        //Resets loading
        this.setState({loading: false})
    }

}
export default Main;