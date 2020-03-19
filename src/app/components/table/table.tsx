import * as React from 'react';
import autobind from "autobind-decorator";
import './table.css';
import { Loader, Table, Button, Item } from 'semantic-ui-react';
import { IDefaultSchema } from "./../../interfaces/viewInterfaces"
import LinkedImages from '../linkedImages/linkedImages';
import DisplayProperties from '../displayProperties/displayProperties';

interface IProps {
    openModal(modal: "edit" | "delete", data);
    data: Array<{}>;
    Schema: IDefaultSchema;
    notEditable?: boolean;
}

interface Istate {
    loading: boolean;
}

let tableData = [];

export class DataTable extends React.Component <IProps, Istate>{

    constructor(props) {
        super(props);
        this.state = {loading: false}
    }

    componentDidMount() {
        tableData = [];
        let schemaFields = [];
        let showColumns = [];
        //define columns to show and the title of each column
        for(let i = 0; i < this.props.Schema.fields.length; i++) {
            let field = this.props.Schema.fields[i];
            if(!field.hideInTable) {
                schemaFields[field.id] = field.name;
                showColumns.push(field.id);
            }
        }
        tableData.push(schemaFields)
        for(let i = 0; i < this.props.data.length; i++) {
            let dataRow = this.props.data[i];
            let newRow = {}
            showColumns.forEach((showkey) => {
                if(dataRow[showkey] !== undefined) {
                    newRow[showkey] = dataRow[showkey];
                }
            });
            tableData.push(newRow)  
        }
        this.setState({loading: false})
    }

    render() {
        if(this.state.loading) return <Loader active />
        return <Table celled striped className="customTable">
                <Table.Body>
                {tableData.map( (row, rowI) => {
                    return <Table.Row key={rowI}>
                        {this.props.Schema.fields.map((field, columnI) => {
                            if(field.hideInTable && columnI !== 0) return;
                            let cell = this.renderCell(field, row, rowI, columnI);
                            return cell;
                        })}
                    </Table.Row>
                })}
                </Table.Body>
        </Table>
    }

    @autobind
    renderCell(field, row, rowI, columnI) {
        let column = row[field.id];
        
        if(rowI === 0) return <Table.Cell verticalAlign="top" key={columnI}><strong>{column}</strong></Table.Cell>
        if(columnI === 0) {
            let button = this.renderButton(columnI, rowI)
            return <Table.Cell collapsing verticalAlign="top" key={columnI}>{button}</Table.Cell>
        }
        if(field.type === "pictures")return <Table.Cell verticalAlign="top" key={columnI}>
            <div className="tableCellDynamic">
                <LinkedImages table={true} key={columnI} resources={row.pictures}/>
            </div>
        </Table.Cell>
        if(field.type === "properties")return <Table.Cell verticalAlign="top" key={columnI}>
            <div className="tableCellDynamic">
                <DisplayProperties data={row.properties}/>
            </div>
        </Table.Cell>
        if(field.type === "tinymce")return <Table.Cell verticalAlign="top" key={columnI}>
                <div className="tableCellDynamic"dangerouslySetInnerHTML={{ __html: column }} />
        </Table.Cell>
        return <Table.Cell verticalAlign="top" key={columnI}><div className="tableCell" ><span>{column}</span></div></Table.Cell>
    }

    @autobind
    renderButton(columnI, rowI) {
        return <>
            {
                this.props.notEditable ?
                    ""
                :
                    <div className="tableButton"><Button 
                        color="blue" 
                        className="tableButton"
                        key={columnI + "edit"} 
                        icon="pencil"
                        onClick={() => this.props.openModal("edit", this.props.data[rowI-1])}
                    /></div>
            }
            
            <div className="tableButton"><Button 
                color="red" 
                className="tableButton"
                icon="trash"
                key={columnI + "del"} 
                onClick={() => this.props.openModal("delete", this.props.data[rowI-1])}
            /></div>
        </>
    }
}
export default DataTable;