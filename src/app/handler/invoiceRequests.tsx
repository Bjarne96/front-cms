import * as request from "./requestHandler"
//import { Types } from "mongoose";
import { IInvoice } from "./../../schemas";

//invoice specific requests

//Gets all invoices
export const getInvoices = async () => {
    let invoices = await request.getData("invoices");;
    return invoices;
}

//Gets one specific invoice
export const getInvoice = async (id: string) => {
    let invoice = await request.getRow("invoice", id);
    return invoice;
}

//Updates one specific invoice
export const updateInvoice = async (id: string, data: IInvoice) => {
    let invoice = await request.updateRow("invoice", id, data);
    return invoice;
}

//Inserts one specific invoice
export const insertInvoice = async (newInvoice) => {
    let invoice = await request.insertRow("invoice", newInvoice);
    return invoice;
}

//Deletes one specific invoice
export const deleteInvoice = async (id: string) => {
    let invoice = await request.deleteRow("invoice", id);
    return invoice;
}