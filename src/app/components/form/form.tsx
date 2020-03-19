import * as React from 'react';
import  { Form as SForm, Loader } from 'semantic-ui-react';
import autobind from "autobind-decorator";

import './form.css';
import { IDefaultFieldObjectSchema } from '../../interfaces/viewInterfaces';
import Tinymce from '../tinymce/tinymce';
import LinkedImages from '../linkedImages/linkedImages';
import ImageUploader from '../imageUploader/imageUploader';
import AddProperties from '../addProperties/addProperties';

interface IProps {
    //Schema that defines how the data property is rendered
    fieldsSchema: Array<IDefaultFieldObjectSchema>;
    //Data that can be rendered on basis of the fieldsSchema property
    data: {[index: string]: any};
    //Data changes are handled from parent component
    changeData(val, id);
}

interface Istate {
    loading: Boolean;
}

export class Form extends React.Component <IProps, Istate>{

    constructor(props) {
        super(props);
        this.state = {loading: true}
    }

    @autobind
    componentDidMount() {this.setState({loading: false})}

    render() {
        if(this.state.loading) return <Loader active />
        return <SForm>
            {this.props.fieldsSchema.map((item) => {
                //Returns no input cause its supposed to be hidden
                if(item.hideInForm) return;
                if(item.type === "pictures"){
                    return <div key={item.id}>
                        <div className="field marginBot">
                            <label>{item.name}</label>
                            <ImageUploader 
                                id={item.id} 
                                changeData={this.props.changeData} 
                                resources={this.props.data[item.id]}
                            />
                            <LinkedImages 
                                id={item.id} 
                                changeData={this.props.changeData} 
                                resources={this.props.data[item.id]}
                            />
                        </div>
                    </div>
                }
                //TinyMCE Type
                if(item.type === "tinymce") {
                    return <div className="field" key={"veryveryunique"+item.id}>
                        <label>{item.name}</label>
                        <Tinymce id={item.id} changeData={this.props.changeData} content={this.props.data[item.id]} />
                    </div>
                }
                //TinyMCE Type
                if(item.type === "properties") {
                    return <div className="field" key={"veryveryunique"+item.id}>
                        <label>{item.name}</label>
                        <AddProperties id={item.id} changeData={this.props.changeData} data={this.props.data[item.id]} />
                    </div>
                }
                //Returns input with error
                if(this.props.data.errors !== undefined && this.props.data.errors[item.id] !== undefined) {
                    return <SForm.Input 
                        key={item.id} 
                        label={item.name} 
                        onChange={(e, d) =>this.props.changeData(d.value, item.id)} 
                        value={this.props.data[item.id]} 
                        type={item.type}
                        error={this.props.data.errors[item.id] !== undefined ? {content: this.props.data.errors[item.id]} : {}}
                    />
                }
                //Returns input without error
                return <SForm.Input 
                    key={item.id} 
                    label={item.name} 
                    onChange={(e, d) =>this.props.changeData(d.value, item.id)} 
                    value={this.props.data[item.id]} 
                    type={item.type}
                />
            })}
        </SForm>
    }
}
export default Form;