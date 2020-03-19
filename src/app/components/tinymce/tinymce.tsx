import * as React from 'react';
import autobind from "autobind-decorator";

import { Editor } from '@tinymce/tinymce-react';
import { Button } from 'semantic-ui-react';

interface IProps {
    content: string;
    id: string;
    changeData(val, id);
}

interface IState {
    loading: boolean;
}


export class Tinymce extends React.Component <IProps, IState>{

    constructor(props) {
        super(props);
        this.state = {loading: true}
    }

    @autobind
    componentDidMount() {this.setState({loading: false})}

    handleEditorChange = (content) => {
        this.props.changeData(content, this.props.id)
    }
 
    render() {
      return (
        <Editor
            id="editorToolbar"
            apiKey="z31w03zo4huzg4wrfcjxl6vvq25loby0qjw9jdp3o26mhb56"
            initialValue={this.props.content}
            init={{
                height: 500,
                menubar: true,
                fixed_toolbar_container: '#editorToolbar',
                plugins: [
                    'advlist autolink lists link image charmap print preview anchor',
                    'searchreplace visualblocks code fullscreen',
                    'insertdatetime media table paste code help wordcount'
                ],
                toolbar:
                    'undo redo | formatselect | bold italic backcolor | \
                    alignleft aligncenter alignright alignjustify | \
                    bullist numlist outdent indent | removeformat | image | Media | help'
            }}
            onEditorChange={this.handleEditorChange}
        />
      );
    }
  }
 
  export default Tinymce;