import * as React from 'react';
import autobind from "autobind-decorator";
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'
import './login.css'
import { loginUser } from '../../handler/requestHandler';
import { Redirect } from 'react-router';

interface ILoginProps {
    checkSession(): Promise<void>;
    loggedIn: boolean;
}

interface Istate {
    loading: boolean,
    permanentSession: boolean,
    error: string,
    email: string,
    password: string
}

export class Login extends React.Component <ILoginProps, Istate>{

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            permanentSession: false,
            error: '',
            email: '',
            password: ''
        }
    }

    render() {
        if(this.props.loggedIn) return <Redirect to='/home' />
        return this.renderForm();
   }

   @autobind
   renderForm() {
        //sets message
        let message = <></>;
        //sets error message
        if(this.state.error.length) message =<Message>{this.state.error}</Message>
        //Form element
        return(
            <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Header as='h2' color='blue' textAlign='center'>
                        <Image src='./../../../public/logo.png' /> Tiefschlaf API
                    </Header>
                    <Form size='large'>
                        <Segment stacked className='loginForm'>
                            <Form.Input 
                                icon='user' 
                                iconPosition='left'
                                name='email'
                                disabled={this.state.loading}
                                onChange={this.onChange}
                                value={this.state.email}
                                placeholder="E-mail"
                                fluid
                            />
                            <Form.Input 
                                icon='lock'
                                iconPosition='left'
                                type='password'
                                name='password'
                                disabled={this.state.loading}
                                onChange={this.onChange}
                                value={this.state.password}
                                placeholder="Password"
                                fluid
                            />
                            <Button content="Login" primary onClick={this.handleSubmit} />
                        </Segment>
                    </Form>
                    {message}
                </Grid.Column>
            </Grid>
       )
   }

    @autobind
    async handleSubmit() {
        //loading on
        this.setState({loading : true});
        //reset error
        this.setState({error : ""});
        //check credentials
        let login = await loginUser(this.state.email, this.state.password);
        //checks for error message
        if(login.status === "error") {
            //bug here by unvalid input
            //Sets error message
            this.setState({error : login.result});
            this.setState({loading : false});
        }else {
            //rerender on router
            this.props.checkSession();
        }        
    }

    onChange = e => {
        const { name , value } = e.target;
        this.setState({[name] : value} as Pick<Istate, keyof Istate>);
    }
    onCheck () {
        this.setState({permanentSession: !this.state.permanentSession})
    }
}
export default Login;