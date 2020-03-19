import * as React from 'react';
import  { Icon, Image, Menu } from 'semantic-ui-react';
import autobind from "autobind-decorator";
import { Button, Loader } from 'semantic-ui-react'
import { removeJWT } from '../../handler/JWTHandler';
import './header.css';

interface IProps {
    checkSession(): Promise<void>;
    toggleSidebar();
}

interface Istate {
    loading: Boolean;
}

export class Header extends React.Component <IProps, Istate>{

    constructor(props) {
        super(props);
        this.state = {
            loading: false
        }
    }

    render() {
        if(this.state.loading) return <Loader active />
        
        return <Menu secondary attached="top" className="themeSecondBackgroundcolor noBorder">
            <Menu.Item className="logoMenu">
                <Image size="mini" src='./../../../public/logo.png'/>
                <strong className="whiteColor">&nbsp;&nbsp;Tiefschlaf</strong>
                </Menu.Item>
            <Menu.Item>
                <Icon  className="whiteColor" name='bars' onClick={this.props.toggleSidebar}/>
            </Menu.Item>
            <Menu.Item position="right" >
                <Button className="themeBackgroundcolor" content="Logout" primary onClick={this.handleLogout} />
            </Menu.Item>
        </Menu>
   }

    @autobind
    async handleLogout() {
        //loading on
        this.setState({loading : true});
        //delete session
        await removeJWT();
        //not loading + loggedOut
        this.setState({loading : false});
        //rerender routes
        this.props.checkSession();
    }
}
export default Header;