import * as React from 'react';
import autobind from "autobind-decorator";
import { Loader, Button } from 'semantic-ui-react';

import { invoiceWebSchema as Schema } from "./../../../schemas";
import { FormModal } from "../../components/modal/formModal";
import { getInvoices, updateInvoice, insertInvoice, deleteInvoice } from './../../handler/invoiceRequests';
import { DataTable as Table } from './../../components/table/table';
import DialogModal from '../../components/modal/dialogModal';
import { IInvoice } from "./../../../schemas";
import './invoices.css';

interface IState {
    loading: boolean;
    //Rendering a specific modal depends on this state
    openModal: "edit" | "delete" | "new" | "";
    //Invoices array to pass data to table component
    invoices: Array<IInvoice>;
    //Invoice to pass data to modal
    invoice: IInvoice;
}

//Empty Invoice to load State
let defaultInvoice = {
    _id: "new mongoose.Types.ObjectId()",
    invoice_number: "IN-0000",
    invoice_payed: false,
    date: "",
    date_delivery: "",
    taxrate: 19,
    payment_terms: "",
    products: [],
    invoice_recipient_id: "new mongoose.Types.ObjectId()",
    delivery_recipient__id: "new mongoose.Types.ObjectId()",
}
export class Invoices extends React.Component <{}, IState>{

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            openModal: "",
            invoices: [],
            invoice: defaultInvoice
        }
    }

    //Loads all invoices and adds them into the state
    async loadInvoices() { 
        this.setState({loading: true});
        let invoices = await getInvoices()
        this.setState({invoices: invoices.result, loading: false})
    }

    //Render first and loads invoices afterwards
    componentDidMount() {
        this.loadInvoices();
    }

    render() {
        //Loader while executing other stuff
        if(this.state.loading) return <Loader active />
        return <>
            {this.state.openModal === "delete" ?
                //Modal for deleting a invoice
                <DialogModal 
                    closeModal={this.closeDeleteForm} 
                    content={JSON.stringify(this.state.invoice.invoice_number)} 
                    dataRow={this.state.invoice}
                /> 
            : ""}
            {this.state.openModal === "edit" ?
                //Modal for editing a invoice
                <FormModal 
                    Schema={Schema} 
                    closeModal={this.closeEditForm} 
                    dataRow={this.state.invoice}
                /> 
            : ""}
            {this.state.openModal === "new" ? 
                //Modal for creating a new invoice
                <FormModal 
                    Schema={Schema} 
                    closeModal={this.closeNewForm} 
                    dataRow={this.state.invoice}
                /> 
            : ""}
            <Button
                onClick={() => this.loadInvoices()}  
                icon='recycle' 
                content='Refresh'              
            />
            <Button
                onClick={() => this.openModal("new", defaultInvoice)}  
                icon='plus'
                content='Add Invoice'
                primary                  
            />
            {/*Table to display all invoices. Also forwards edit and delete clicks*/}
            <Table 
                Schema={Schema} 
                openModal={this.openModal} 
                data={this.state.invoices} 
            />
        </>
    }

    //Sets the state to render the correct modal with the correct invoice data
    @autobind
    async openModal(modal: "edit" | "delete" | "new", invoice: IInvoice) {
        await this.setState({invoice: invoice, openModal: modal});
    }
    
    //Creates a new cutomer and closes modal
    @autobind
    async closeNewForm(createNew: boolean, invoice?: IInvoice) {
        //Closes modal if interaction was canceled
        if(!createNew) return(await this.setState({ openModal: ""}));
        this.setState({ loading: true })
        //Deletes id so the database can create one
        delete invoice._id;
        //Sends new invoice requests
        let response = await insertInvoice(invoice);
        if(response.status === "error") return(alert(JSON.stringify(response.result)));
        //Updates table manually
        await this.updateInvoices("add", response.result);
        //Closes modal
        await this.setState({ openModal: "", loading: false })
    }

    //Edit a invoice and closes Modal (check closeNewForm for more details)
    @autobind
    async closeEditForm(changeInvoice: boolean, invoice?: IInvoice) {
        if(!changeInvoice) return(await this.setState({ openModal: ""}));   
        this.setState({ loading: true })
        let response = await updateInvoice(this.state.invoice._id, invoice);
        if(response.status === "error") return(alert(JSON.stringify(response.result)));
        await this.updateInvoices("edit", response.result);
        await this.setState({ openModal: "", loading: false })
    }

    //Deletes a invoice and closes modal (check closeNewForm for more details)
    @autobind
    async closeDeleteForm(toDelete: boolean, invoice?: IInvoice) {
        if(!toDelete) return(await this.setState({ openModal: ""}));
        await this.setState({ loading: true })
        let response = await deleteInvoice(this.state.invoice._id);
        if(response.status === "error") return(alert(JSON.stringify(response.result)));
        await this.updateInvoices("delete", invoice);
        await this.setState({ openModal: "", loading: false })
    }

    //Updates invoices array without database request depending on what action was made
    @autobind
    async updateInvoices(method: "add" | "delete" | "edit", passed_invoice: IInvoice) {
        //Sets new array
        let refreshed_invoices = this.state.invoices;
        if(method === "add") {
            //Simply pushes a new invoice object into the array
            refreshed_invoices.push(passed_invoice);
        } else {
            //Searches for invoice id in the array
            await this.state.invoices.forEach(async (invoice, idx) => {
                //Removes invoice object by delete
                if(invoice._id === passed_invoice._id && method === "delete") refreshed_invoices.splice(idx, 1);
                //Changes invoice object by edit
                if(invoice._id === passed_invoice._id && method === "edit") refreshed_invoices[idx] = passed_invoice;
            });
        }
        //Submits the new invoices array to state
        await this.setState({invoices: refreshed_invoices});
    }
}
export default Invoices;