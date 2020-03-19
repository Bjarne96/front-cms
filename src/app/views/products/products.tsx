import * as React from 'react';
import autobind from "autobind-decorator";
import { Loader, Button } from 'semantic-ui-react';

import { productWebSchema as Schema } from "./../../../schemas"
import { FormModal } from "../../components/modal/formModal"
import { getProducts, updateProduct, insertProduct, deleteProduct } from '../../handler/productRequests'
import { DataTable as Table } from '../../components/table/table'
import DialogModal from '../../components/modal/dialogModal';
import { IProduct } from "./../../../schemas";
import './products.css';

interface IState {
    loading: boolean;
    //Rendering a specific modal depends on this state
    openModal: "edit" | "delete" | "new" | "";
    //Products array to pass data to table component
    products: Array<IProduct>;
    //Product to pass data to modal
    product: IProduct;
}

//Empty Product to load State
let defaultProduct = {
    _id: "",//new mongoose.Types.ObjectId(),
    price: "",
    name: "",
    text: "",
    pictures: [],
    properties: []
}

export class Products extends React.Component <{}, IState>{

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            openModal: "",
            products: [],
            product: defaultProduct
        }
    }

    //Loads all products and adds them into the state
    async loadProducts() { 
        this.setState({loading: true});
        let response = await getProducts();
        let products: Array<IProduct> = response.result;
        this.setState({products: products, loading: false})
    }

    //Render first and loads products afterwards
    componentDidMount() {
        this.loadProducts();
    }

    render() {
        //Loader while executing other stuff
        if(this.state.loading) return <Loader active />
        return <>
            {this.state.openModal === "delete" ?
                //Modal for deleting a product
                <DialogModal 
                    closeModal={this.closeDeleteForm} 
                    content={JSON.stringify(this.state.product.name)} 
                    dataRow={this.state.product}
                /> 
            : ""}
            {this.state.openModal === "edit" ?
                //Modal for editing a product
                <FormModal 
                    Schema={Schema} 
                    closeModal={this.closeEditForm} 
                    dataRow={this.state.product}
                /> 
            : ""}
            {this.state.openModal === "new" ? 
                //Modal for creating a new product
                <FormModal 
                    Schema={Schema} 
                    closeModal={this.closeNewForm} 
                    dataRow={this.state.product}
                /> 
            : ""}
            <Button
                onClick={() => this.loadProducts()}  
                icon='recycle' 
                content='Refresh'              
            />
            <Button
                onClick={() => this.openModal("new", defaultProduct)}  
                icon='plus'
                content='Add Product'
                primary                  
            />
            {/*Table to display all products. Also forwards edit and delete clicks*/}
            <Table 
                Schema={Schema} 
                openModal={this.openModal} 
                data={this.state.products} 
            />
        </>
    }

    //Sets the state to render the correct modal with the correct product data
    @autobind
    async openModal(modal: "edit" | "delete" | "new", product: IProduct) {
        await this.setState({product: product, openModal: modal});
    }
    
    //Creates a new cutomer and closes modal
    @autobind
    async closeNewForm(createNew: boolean, product?: IProduct) {
        //Closes modal if interaction was canceled
        if(!createNew) return(await this.setState({ openModal: ""}));
        this.setState({ loading: true })
        //Deletes id so the database can create one
        delete product._id;
        //Sends new product requests
        let response = await insertProduct(product);
        if(response.status === "error") return(alert(JSON.stringify(response.result)));
        //Updates table manually
        await this.loadProducts();
        //Closes modal
        await this.setState({ openModal: "", loading: false })
    }

    //Edit a product and closes Modal (check closeNewForm for more details)
    @autobind
    async closeEditForm(changeProduct: boolean, product?: IProduct) {
        if(!changeProduct) return(await this.setState({ openModal: ""}));   
        this.setState({ loading: true })
        let response = await updateProduct(this.state.product._id, product);
        if(response.status === "error") return(alert(JSON.stringify(response.result)));
        await this.loadProducts();
        await this.setState({ openModal: "", loading: false })
    }

    //Deletes a product and closes modal (check closeNewForm for more details)
    @autobind
    async closeDeleteForm(toDelete: boolean, product?: IProduct) {
        if(!toDelete) return(await this.setState({ openModal: ""}));
        await this.setState({ loading: true })
        let response = await deleteProduct(this.state.product._id);
        if(response.status === "error") return(alert(JSON.stringify(response.result)));
        await this.loadProducts();
        await this.setState({ openModal: "", loading: false })
    }
}
export default Products;