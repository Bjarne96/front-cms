import * as request from "./requestHandler"
//import { Types } from "mongoose";
import { ICustomer } from "./../../schemas";

//customer specific requests

//Gets all customers
export const getCustomers = async () => {
    let customers = await request.getData("customers");;
    return customers;
}

//Gets one specific customer
export const getCustomer = async (id: string) => {
    let customer = await request.getRow("customer", id);
    return customer;
}

//Updates one specific customer
export const updateCustomer = async (id: string, data: ICustomer) => {
    let customer = await request.updateRow("customer", id, data);
    return customer;
}

//Inserts one specific customer
export const insertCustomer = async (newCustomer) => {
    let customer = await request.insertRow("customer", newCustomer);
    return customer;
}

//Deletes one specific customer
export const deleteCustomer = async (id: string) => {
    let customer = await request.deleteRow("customer", id);
    return customer;
}