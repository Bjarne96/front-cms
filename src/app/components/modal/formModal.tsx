import * as React from 'react';
import { Modal as SModal, Button, Item } from 'semantic-ui-react';
import autobind from 'autobind-decorator';
import { Form } from '../form/form'
import { IDefaultSchema } from '../../interfaces/viewInterfaces';
import addResource, { deleteResource } from '../../handler/resourceRequests';

interface IProps {
    //Closes the Modal
    //"changes" need to be true, so the data will be commmited
    closeModal(changes: boolean, data?: any);
    //The datarow has 
    dataRow: {[index: string]: any;};
    Schema: IDefaultSchema;
    size?: 'mini' | 'tiny' | 'small' | 'large' | 'fullscreen';
}

let size:'mini' | 'tiny' | 'small' | 'large' | 'fullscreen' = "small";

interface IState {
    loading: boolean;
    //Errors is used if form isnt filled correct
    errors: Object;
    //Sets up unknow keys to handle form
    [index: string]: any;
}

export class FormModal extends React.Component <IProps, IState>{

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            openModal: false,
            errors: {}
        }
    }

    handleChange = async (val, key) => {
        //Removes error if val has length
        if(this.state.errors[key] !== undefined && val.length) {
            let errors = this.state.errors;
            delete errors[key];
            this.setState({errors : errors});
        }
        if(key === "upload") {
            let response = await addResource(val);
            //checks for error message
            if(response.status === "error") return(console.log("error", response.status))//handle properly
            let newResources = this.state["pictures"];
            newResources.push(response.result)
            val = newResources;
        }
        if(key === "deleteFile") {
            let newResources = this.state.pictures;
            for(let i = 0; i < newResources.length; i++) {
                if(val === newResources[i]._id) newResources.splice(i, 1)
            }
            let response = await deleteResource(val);
            //checks for error message
            if(response.status === "error") return(console.log("error", response.status))//handle properly
            val = newResources;
        }
        //Sets new key val in state
        this.setState({[key] : val}, () => this.forceUpdate());
    }

    componentDidMount() {
        //Loops over data rows and adds them into the state
        if(this.props.dataRow._id != undefined) {
            this.props.Schema.fields.forEach((field) => {
                this.setState({[field.id] : this.props.dataRow[field.id]});
            })
        }
        if(this.props.size != undefined) {
            size = this.props.size
        }
        this.setState({loading : false});
    }

    
    render() {
        if(this.state.loading) return <></>
        return (
           
            <SModal size={size} open={true} closeOnEscape={true} closeOnDimmerClick={false}>
                <SModal.Header>{this.props.Schema.formTitle}</SModal.Header>
                <SModal.Content>
                    <Form 
                        changeData={(val, key) => this.handleChange(val, key)} 
                        data={this.state} 
                        fieldsSchema={this.props.Schema.fields} 
                    />
                </SModal.Content>
                <SModal.Actions>
                    <Button 
                        onClick={() => this.handleClose(false)}
                        icon='cancel'
                        content='No'
                        negative
                    />
                    <Button 
                        onClick={() => this.handleClose(true)}  
                        icon='checkmark'
                        content='Yes'
                        positive                       
                    />
                </SModal.Actions>
            </SModal>
        )
    }

    @autobind
    handleClose(submit) {
        //Cancel button sends negativ response to closemodal
        if(!submit) return (this.props.closeModal(false));
        //Sets up Data gathered for closeModal
        let data = {};
        //Sets up changes detection variable
        let changesMade = false;
        //Sets up form error variable
        let hasError = false;
        //Sets up error message variable
        let errors = {};
        //Loops over schema to gather all data
        this.props.Schema.fields.forEach((field) => {
            //Checks for errors and sets them into errors object gives checkerr the field value
            if(!field.hideInForm && field.required && field.checkErr(this.state[field.id])) {
                hasError = true;
                errors[field.id] = field.error;
            }
            if(field.type === "pictures") changesMade = true;
            //Checks if changes were made
            if(this.state[field.id] !== this.props.dataRow[field.id]) changesMade = true;
            //Adds data to object
            data[field.id] = this.state[field.id];
        })
        //Error handling
        if (hasError) return(this.setState({errors : errors}));
        //Closes Modal with committed data
        this.props.closeModal(changesMade, data);
    }
}
export default FormModal