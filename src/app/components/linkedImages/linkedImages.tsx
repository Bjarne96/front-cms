import * as React from 'react';
import './linkedImages.css';
import { IResource } from '../../../schemas';
import { Button, Card, Image, Loader } from 'semantic-ui-react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
interface IProps {
    resources: Array<IResource>;
    table?: boolean; 
    // Properties are needed when used in a form
    id?: string;
    error?: string;
    changeData?(val, id);
}

interface IState {
    loading: boolean;
    value: string;
}

const mouseClickEvents = ['mousedown', 'click', 'mouseup'];

export class LinkedImages extends React.Component <IProps, IState>{
    
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            value: ""
        }
    }

    async handleClipboardClick(val) {
        await this.setState({value: val});
        let element = await document.querySelector('span[id="copyclipboard"]');
        mouseClickEvents.forEach(mouseEventType =>
            element.dispatchEvent(
            new MouseEvent(mouseEventType, {view: window,bubbles: true,cancelable: true, buttons: 1}))
        );
    }

    async handleDeleteClick(id) {
        this.props.changeData(id ,"deleteFile")
    }
 
    render() {
        if(this.state.loading) return <Loader active />
        if(this.props.resources == undefined) return <Loader active />
        let cards =  this.props.resources.map((pic, key) => {
            return <Card key={key+"card"}>
                <Image key={key+"image"} src={pic.path} wrapped className="thumbnail"/>
                {!this.props.table ? <>
                    <Card.Description key={key+"name"}>{pic.name}</Card.Description>
                    <Card.Content key={key+"resources"}>
                        <Button key={key+"copy"}
                            className="button"
                            color="blue" 
                            icon="copy"
                            onClick={() => this.handleClipboardClick(pic.path)}
                        />
                        <Button 
                            key={key+"del"}
                            className="button delButton"
                            color="red" 
                            icon="trash"
                            onClick={() =>this.handleDeleteClick(pic._id)}
                        />
                    </Card.Content>
                </>: ""}
            </Card>
        })
        let copyElem =  <CopyToClipboard className="hide" text={this.state.value}><span id="copyclipboard"></span></CopyToClipboard>;
        let galery = <div key={"picids"} className="galery">{cards}{copyElem}</div>
        if(this.props.table) return cards;
        return galery;
    }
  }
 
  export default LinkedImages;