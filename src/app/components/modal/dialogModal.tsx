import * as React from 'react';
import { Modal, Button } from 'semantic-ui-react';
import autobind from 'autobind-decorator';

interface IProps {
    closeModal(deleteRow: boolean, id?);
    content: string;
    dataRow: {[index: string]: any};
}

interface IState {
    loading: boolean;
}

export class DialogModal extends React.Component <IProps, IState>{

    constructor(props) {
        super(props);
        this.state = {loading: true}
    }

    componentDidMount() {
        this.setState({loading : false});
    }

    
    render() {
        if(this.state.loading) return <></>
        return (
            <Modal size={"mini"}open={true} closeOnEscape={true} closeOnDimmerClick={false}>
                <Modal.Header>Delete Data</Modal.Header>
                <Modal.Content>
                    {this.props.content}
                </Modal.Content>
                <Modal.Actions>
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
                </Modal.Actions>
            </Modal>
        )
    }

    @autobind
    handleClose(changes) {
        this.props.closeModal(changes, this.props.dataRow);
    }
}
export default DialogModal