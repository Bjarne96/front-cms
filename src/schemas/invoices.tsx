import { IDefaultSchema } from "../app/interfaces/viewInterfaces"

//Invoice Databaseobject
export interface IInvoice {
    _id: any; //mongoose.Types.ObjectId,
    invoice_number: string,
    invoice_payed: boolean,
    date: string,
    date_delivery: string,
    taxrate: number,
    payment_terms: string,
    products: Array<any>,
    invoice_recipient_id: any;//mongoose.Types.ObjectId,
    delivery_recipient__id: any;//mongoose.Types.ObjectId
}

//Customer schema to render all necessary information in views and components
export const invoiceWebSchema: IDefaultSchema = {
    formTitle: "Edit Invoices",
    tableTitle: "Invoices",
    fields: [
        {
            id: "_id",
            name: "",
            type: "text",
            required: false,
            error : "Missing ID.",
            hideInForm: true,
            hideInTable: true,
            checkErr : (field: string) => {if(field.length) return false; else{return true}}
        },
        {
            id: "invoice_number",
            name: "Invoice Number",
            type: "text",
            required: true,
            error : "Fill in invoice number please.",
            checkErr : (field: string) => {if(field.length) return false; else{return true}}
        },
        {
            id: "date",
            name: "string",
            type: "text",
            required: true,
            error : "Fill in First name please.",
            checkErr : (field: string) => {if(field.length) return false; else{return true}}
        },
        {
            id: "date_delivery",
            name: "Delivery date",
            type: "text",
            required: false,
            error : "",
            checkErr : (field: string) => {if(field.length) return false; else{return true}}
        },
        {
            id: "invoice_payed",
            name: "Invoice payed",
            type: "checkbox",
            required: false,
            error : "Fill in Last name please.",
            checkErr : (field: string) => {if(field.length) return false; else{return true}}
        },
        {
            id: "products",
            name: "Products",
            type: "text",
            required: true,
            error : "Fill in Street name please.",
            checkErr : (field: string) => {if(field.length) return false; else{return true}}
        },
        {
            id: "taxrate",
            name: "Taxrate",
            type: "text",
            required: true,
            error : "Fill in Street number please.",
            checkErr : (field: string) => {if(field.length) return false; else{return true}}
        },
        {
            id: "payment_terms",
            name: "Payment Terms",
            type: "text",
            required: true,
            error : "Fill in City please.",
            checkErr : (field: string) => {if(field.length) return false; else{return true}}
        },
        {
            id: "delivery_recipient_id",
            name: "delivery_recipient_id",
            type: "text",
            required: true,
            error : "Fill in Zipcode please.",
            checkErr : (field: string) => {if(field.length) return false; else{return true}}
        },
        {
            id: "invoice_recipient_id",
            name: "invoice_recipient_id",
            type: "text",
            required: true,
            error : "Fill in Gender please.",
            checkErr : (field: string) => {if(field.length) return false; else{return true}}
        }
    ]
}

export default invoiceWebSchema;