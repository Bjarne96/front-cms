import * as request from "./requestHandler"
//import { Types } from "mongoose";
import { IResource } from "./../../schemas";

//Uploades an Image and add the db entry
export const addResource = async (formdata: FormData) => {
    //Posts new User
    let resource = await request.uploadFile(formdata);
    return resource;
};

//resource specific requests

//Gets all resources
export const getResources = async () => {
    let resources = await request.getData("resources");;
    return resources;
}

//Gets one specific resource
export const getResource = async (id: string) => {
    let resource = await request.getRow("resource", id);
    return resource;
}

//Updates one specific resource
export const updateResource = async (id: string, data: IResource) => {
    let resource = await request.updateRow("resource", id, data);
    return resource;
}

//Inserts one specific resource
export const insertResource = async (newResource) => {
    let resource = await request.insertRow("resource", newResource);
    return resource;
}

//Deletes one specific resource
export const deleteResource = async (id: string) => {
    let resource = await request.deleteRow("resource", id);
    return resource;
}

export default addResource;