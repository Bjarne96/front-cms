import * as request from "./requestHandler"
//import { Types } from "mongoose";
import { IProduct } from "./../../schemas";

//product specific requests

//Gets all products
export const getProducts = async () => {
    let products = await request.getData("products");;
    return products;
}

//Gets one specific product
export const getProduct = async (id: string) => {
    let product = await request.getRow("product", id);
    return product;
}

//Updates one specific product
export const updateProduct = async (id: string, data: IProduct) => {
    let product = await request.updateRow("product", id, data);
    return product;
}

//Inserts one specific product
export const insertProduct = async (newProduct) => {
    let product = await request.insertRow("product", newProduct);
    return product;
}

//Deletes one specific product
export const deleteProduct = async (id: string) => {
    let product = await request.deleteRow("product", id);
    return product;
}