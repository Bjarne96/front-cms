import * as React from 'react';
import './addProperties.css';
import { Card, Loader, Input, Icon } from 'semantic-ui-react';
import autobind from 'autobind-decorator';

interface IProps {
    data: Array<Array<[String]>>;
    id: string;
    changeData(val, id);
}

interface IState {
    loading: boolean;
}
export class AddProperties extends React.Component <IProps, IState>{
    
    constructor(props) {
        super(props);
        this.state = {
            loading: true
        }
    }

    componentDidMount() {
        this.setState({loading: false})
    }

    @autobind
    async addPropertyCategorie() {
        let element:any = await document.querySelector('input[id="newCategory"]');
        if(!element.value.length) return;
        let data = this.props.data;
        data.push([]);
        data[data.length-1].push(element.value)
        element.value = "";
        this.props.changeData(data, this.props.id)
    }
    
    @autobind
    async add(index, id) {
        let val:any = await document.getElementById(id)
        if(!val.value.length) return;
        let data = this.props.data;
        data[index].push(val.value);
        val.value = "";
        this.props.changeData(data, this.props.id)
    }

    @autobind
    remove(indexCategory,index) {
        let data = this.props.data;
        data[indexCategory].splice(index, 1)
        console.log("data[indexCategory].length", data[indexCategory].length)
        if(data[indexCategory].length === 1) data.splice(indexCategory, 1)
        this.props.changeData(data, this.props.id)
    }

    render() {
        if(this.state.loading) return <Loader active />
        let categories = this.props.data.map((category, catIndex) => {
            return <div className="marginBot">{
                category.map((string, key) => {
                if(key === 0) {
                    return <div key={catIndex.toString()}>
                        <Input
                            className="marginBot"
                            action={{
                                color: 'teal',
                                labelPosition: 'left',
                                icon: 'plus',
                                content: 'Add ' + category[key],
                                onClick: () => this.add(catIndex, catIndex+key+"prop")
                            
                            }}
                            id={catIndex+key+"prop"}
                            actionPosition='left'
                            placeholder={'New ' + category[key]}
                            defaultValue=""
                            key={catIndex+key}
                            />
                    </div>
                }
                return <Card className="autoWidth" key={catIndex+key}>
                    <Card.Content className="autoWidth">
                        <span>{string}</span>
                        <Icon
                            name="remove circle"
                            className="removeIcon"
                            onClick={() => this.remove(catIndex, key)}
                        />
                    </Card.Content>
                </Card>
            })}
            </div>
        });
        return <div key={this.props.id}>
            <div className="marginBot">
                <Input
                    className="marginBot"
                    action={{
                        color: "blue", 
                        labelPosition: 'left',
                        icon: 'plus',
                        content: 'Add Category',
                        onClick:this.addPropertyCategorie
                    
                    }}
                    id="newCategory"
                    actionPosition='left'
                    placeholder='New Catgory'
                    defaultValue=''
                />
            </div>
            {categories}
        </div>
    }
}

export default AddProperties;