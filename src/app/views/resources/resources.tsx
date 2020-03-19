import * as React from 'react';
import autobind from "autobind-decorator";
import { Loader, Button } from 'semantic-ui-react';

import { resourceWebSchema as Schema, IResource, emptyWebResource as defaultResource } from "./../../../schemas"
import { getResources, deleteResource } from '../../handler/resourceRequests'
import { DataTable as Table } from '../../components/table/table'
import DialogModal from '../../components/modal/dialogModal';
import './resources.css';

interface IState {
    loading: boolean;
    //Rendering a specific modal depends on this state
    openModal: "delete" | "";
    //Resources array to pass data to table component
    resources: Array<IResource>;
    //Resource to pass data to modal
    resource: IResource;
}



export class Resources extends React.Component <{}, IState>{

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            openModal: "",
            resources: [],
            resource: defaultResource
        }
    }

    //Loads all resources and adds them into the state
    async loadResources() { 
        this.setState({loading: true});
        let resources = await getResources()
        this.setState({resources: resources.result, loading: false})
    }

    //Render first and loads resources afterwards
    componentDidMount() {
        this.loadResources();
    }

    render() {
        //Loader while executing other stuff
        if(this.state.loading) return <Loader active />
        return <>
            {this.state.openModal === "delete" ?
                //Modal for deleting a resource
                <DialogModal 
                    closeModal={this.closeDeleteForm} 
                    content={JSON.stringify(this.state.resource.name)} 
                    dataRow={this.state.resource}
                /> 
            : ""}
            <Button
                onClick={() => this.loadResources()}  
                icon='recycle' 
                content='Refresh'              
            />
            {/*Table to display all resources. Also forwards edit and delete clicks*/}
            <Table 
                Schema={Schema} 
                openModal={this.openModal} 
                data={this.state.resources}
                notEditable={true}
            />
        </>
    }

    //Sets the state to render the correct modal with the correct resource data
    @autobind
    async openModal(modal: "delete", resource: IResource) {
        await this.setState({resource: resource, openModal: modal});
    }


    //Deletes a resource and closes modal (check closeNewForm for more details)
    @autobind
    async closeDeleteForm(toDelete: boolean, resource?: IResource) {
        if(!toDelete) return(await this.setState({ openModal: ""}));
        await this.setState({ loading: true })
        let response = await deleteResource(this.state.resource._id);
        if(response.status === "error") return(alert(JSON.stringify(response.result)));
        await this.updateResources("delete", resource);
        await this.setState({ openModal: "", loading: false })
    }

    //Updates resources array without database request depending on what action was made
    @autobind
    async updateResources(method:"delete", passed_resource: IResource) {
        //Sets new array
        let refreshed_resources = this.state.resources;
        //Searches for resource id in the array
        await this.state.resources.forEach(async (resource, idx) => {
            //Removes resource object by delete
            if(resource._id === passed_resource._id && method === "delete") refreshed_resources.splice(idx, 1);
        });
        //Submits the new resources array to state
        await this.setState({resources: refreshed_resources});
    }
}
export default Resources;