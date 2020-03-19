import * as React from 'react';
import { Link } from 'react-router-dom';
import autobind from 'autobind-decorator';
import { Button, Form, Grid, Message, Segment } from 'semantic-ui-react'
import { registerUser } from './../../handler/userRequests';
import { checkPassword, checkError } from './registerHandler';
import './register.css';


interface IProps {
    checkSession(): Promise<void>;
}

interface Istate {
    loading: Boolean,
    registered: string,
    error: string,
    email: string,
    password: string,
    password2: string
}

export class Register extends React.Component<IProps, Istate> {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            registered: "",
            error: '',
            email: '',
            password: '',
            password2: ''
        }
    }

    render() {
        //sets message
        let message = <></>;
        //sets error message
        if(this.state.error.length)  message =<Message>{this.state.error}</Message>
        if(this.state.registered !== "")  message =<Message><strong>{this.state.registered}</strong> is registered.  <Link to="/login">Login?</Link></Message>
        //Sets register form
        let form = <div>
            <Grid textAlign='center' verticalAlign='middle'>
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Form size='large'>
                        <Segment stacked className='RegisterForm'>
                            <Form.Input 
                                icon='user' 
                                iconPosition='left'
                                name='email'
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
                                onChange={this.onChange}
                                value={this.state.password}
                                placeholder="Password"
                                fluid
                            />
                            <Form.Input 
                                icon='lock'
                                iconPosition='left'
                                type='password'
                                name='password2'
                                onChange={this.onChange}
                                value={this.state.password2}
                                placeholder="Re-enter Password"
                                fluid
                            />
                            <Button className="themeBackgroundcolor" content="Register" primary onClick={this.handleSubmit} />
                        </Segment>
                        {message}
                    </Form>
                </Grid.Column>
            </Grid>
        </div>
        return form
    }

    onChange = e => {
        const { name , value } = e.target;
        this.setState({[name] : value} as Pick<Istate, keyof Istate>);
    }

   @autobind
   async handleSubmit() {
        //resets registered if needed
        this.setState({loading : true});
        this.setState({registered : ""})
        this.setState({error : ""})

        //validate password matching
        if(!checkPassword(this.state.password, this.state.password2)) {
            //sets error message + resets passwords
            this.setState({error: "The passwords doesn't match.", password: "", password2: ""})
            return;
        }

        //loading on
        this.setState({loading: true})
        //Sets crendtials to register
        let user = {email : this.state.email, password : this.state.password}
        //post request for creating a new user
        let register = await registerUser(user); //import interface for api response
        //cheks for error
        if(register.status === "error"){
            //Sets error
            this.setState({error: register.result})
        }else {
            let user: any = register.result;
            //sets registered as true -> todo; followup when emailserver is up
            this.setState({registered: user.email})
        }
        //loading off
        this.setState({loading: false});    
    }
}
export default Register;