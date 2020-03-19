import * as React from 'react';
import autobind from "autobind-decorator";
import { Loader, Button } from 'semantic-ui-react';

import { customerWebSchema as Schema, ICustomer, emptyWebCustomer as defaultCustomer } from "./../../../schemas"
import { FormModal } from "../../components/modal/formModal"
import { getCustomers, updateCustomer, insertCustomer, deleteCustomer } from './../../handler/customerRequests'
import { DataTable as Table } from './../../components/table/table'
import DialogModal from '../../components/modal/dialogModal';
import './customers.css';

interface IState {
    loading: boolean;
    //Rendering a specific modal depends on this state
    openModal: "edit" | "delete" | "new" | "";
    //Customers array to pass data to table component
    customers: Array<ICustomer>;
    //Customer to pass data to modal
    customer: ICustomer;
}



export class Customers extends React.Component <{}, IState>{

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            openModal: "",
            customers: [],
            customer: defaultCustomer
        }
    }

    //Loads all customers and adds them into the state
    async loadCustomers() { 
        this.setState({loading: true});
        let customers = await getCustomers()
        this.setState({customers: customers.result, loading: false})
    }

    //Render first and loads customers afterwards
    componentDidMount() {
        this.loadCustomers();
    }

    render() {
        //Loader while executing other stuff
        if(this.state.loading) return <Loader active />
        return <>
            {this.state.openModal === "delete" ?
                //Modal for deleting a customer
                <DialogModal 
                    closeModal={this.closeDeleteForm} 
                    content={JSON.stringify(this.state.customer.firstname + " " + this.state.customer.lastname)} 
                    dataRow={this.state.customer}
                /> 
            : ""}
            {this.state.openModal === "edit" ?
                //Modal for editing a customer
                <FormModal 
                    Schema={Schema} 
                    closeModal={this.closeEditForm} 
                    dataRow={this.state.customer}
                /> 
            : ""}
            {this.state.openModal === "new" ? 
                //Modal for creating a new customer
                <FormModal 
                    Schema={Schema} 
                    closeModal={this.closeNewForm} 
                    dataRow={this.state.customer}
                /> 
            : ""}
            <Button
                onClick={() => this.loadCustomers()}  
                icon='recycle' 
                content='Refresh'              
            />
            <Button
                onClick={() => this.openModal("new", defaultCustomer)}  
                icon='plus'
                content='Add Customer'
                primary                  
            />
            {/*Table to display all customers. Also forwards edit and delete clicks*/}
            <Table 
                Schema={Schema} 
                openModal={this.openModal} 
                data={this.state.customers} 
            />
        </>
    }

    //Sets the state to render the correct modal with the correct customer data
    @autobind
    async openModal(modal: "edit" | "delete" | "new", customer: ICustomer) {
        await this.setState({customer: customer, openModal: modal});
    }
    
    //Creates a new cutomer and closes modal
    @autobind
    async closeNewForm(createNew: boolean, customer?: ICustomer) {
        //Closes modal if interaction was canceled
        if(!createNew) return(await this.setState({ openModal: ""}));
        this.setState({ loading: true })
        //Deletes id so the database can create one
        delete customer._id;
        //Sends new customer requests
        let response = await insertCustomer(customer);
        if(response.status === "error") return(alert(JSON.stringify(response.result)));
        //Updates table manually
        await this.updateCustomers("add", response.result);
        //Closes modal
        await this.setState({ openModal: "", loading: false })
    }

    //Edit a customer and closes Modal (check closeNewForm for more details)
    @autobind
    async closeEditForm(changeCustomer: boolean, customer?: ICustomer) {
        if(!changeCustomer) return(await this.setState({ openModal: ""}));   
        this.setState({ loading: true })
        let response = await updateCustomer(this.state.customer._id, customer);
        if(response.status === "error") return(alert(JSON.stringify(response.result)));
        await this.updateCustomers("edit", response.result);
        await this.setState({ openModal: "", loading: false })
    }

    //Deletes a customer and closes modal (check closeNewForm for more details)
    @autobind
    async closeDeleteForm(toDelete: boolean, customer?: ICustomer) {
        if(!toDelete) return(await this.setState({ openModal: ""}));
        await this.setState({ loading: true })
        let response = await deleteCustomer(this.state.customer._id);
        if(response.status === "error") return(alert(JSON.stringify(response.result)));
        await this.updateCustomers("delete", customer);
        await this.setState({ openModal: "", loading: false })
    }

    //Updates customers array without database request depending on what action was made
    @autobind
    async updateCustomers(method: "add" | "delete" | "edit", passed_customer: ICustomer) {
        //Sets new array
        let refreshed_customers = this.state.customers;
        if(method === "add") {
            //Simply pushes a new customer object into the array
            refreshed_customers.push(passed_customer);
        } else {
            //Searches for customer id in the array
            await this.state.customers.forEach(async (customer, idx) => {
                //Removes customer object by delete
                if(customer._id === passed_customer._id && method === "delete") refreshed_customers.splice(idx, 1);
                //Changes customer object by edit
                if(customer._id === passed_customer._id && method === "edit") refreshed_customers[idx] = passed_customer;
            });
        }
        //Submits the new customers array to state
        await this.setState({customers: refreshed_customers});
    }
}
export default Customers;