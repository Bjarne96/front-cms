import * as request from "./requestHandler"
//import { Types } from "mongoose";
import { IArticle } from "./../../schemas";

//article specific requests

//Gets all articles
export const getArticles = async () => {
    let articles = await request.getData("articles");;
    return articles;
}

//Gets one specific article
export const getArticle = async (id: any) => {
    let article = await request.getRow("article", id);
    return article;
}

//Updates one specific article
export const updateArticle = async (id: any, data: IArticle) => {
    let article = await request.updateRow("article", id, data);
    return article;
}

//Inserts one specific article
export const insertArticle = async (newArticle) => {
    let article = await request.insertRow("article", newArticle);
    return article;
}

//Deletes one specific article
export const deleteArticle = async (id: any) => {
    let article = await request.deleteRow("article", id);
    return article;
}