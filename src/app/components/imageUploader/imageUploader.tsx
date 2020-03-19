import * as React from 'react';
import { Button, Message } from 'semantic-ui-react';
import './imageUploader.css';
import autobind from 'autobind-decorator';

interface IProps {
    resources: [string];
    id: string;
    changeData(val, id);
}

interface IState {
    loading: boolean;
}

let  formdata = new FormData();
let fileElement;

export class ImageUploader extends React.Component <IProps, IState>{

    constructor(props) {
        super(props);
        this.state = {
            loading: false
        }
    }

    componentWillReceiveProps() {
        this.forceUpdate();
    }

    @autobind
    async handleUploadFile (event) {
        formdata.append('file', event.target.files[0]);
    }

    @autobind
    async handleUploadClick (event) {
        event.preventDefault();
        if(this.state.loading) return;
        fileElement.click();
    }

    @autobind
    async handleSubmit (event) {
        event.preventDefault();
        this.props.changeData(formdata, "upload")
    }

    render() {
        //sets message
        let message = <></>;
        //sets error message or sets filename message or sets loading message
        if(this.state.loading) message =<Message className="inline-message">Loading ... </Message>

        return <div className="div">
                <input type="file" ref={ref => fileElement = ref} onChange={this.handleUploadFile} id="file" accept="image"  style={{display: 'none'}} />
                <Button 
                    onClick={this.handleUploadClick}  
                    icon='cloud upload'
                    content='Upload'
                    primary
                    disabled={this.state.loading}                  
                />
                <Button 
                    onClick={this.handleSubmit}  
                    content='Submit'
                    primary
                    disabled={this.state.loading}               
                />
                {message}
        </div>
    }
}
export default ImageUploader;