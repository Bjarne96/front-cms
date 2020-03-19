import { IDefaultSchema } from "../app/interfaces/viewInterfaces"
import { IResource } from "."

export interface IDependendArticle {
    _id: string;
    name: string;
    title: string;
    content: string;
    url: string;
    pictures: Array<string>,
}

export interface IArticle {
    _id: string;
    name: string;
    title: string;
    content: string;
    url: string;
    pictures: Array<IResource>,
}


//Empty Article to load State
export let emptyWebArticle = {
    _id: "",//new mongoose.Types.ObjectId(),
    name: "",
    title: "",
    content: "",
    url: "",
    pictures: []
}

export const articleWebSchema: IDefaultSchema = {
    formTitle: "Edit Article",
    tableTitle: "Articles",
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
            id: "name",
            name: "Name",
            type: "text",
            required: true,
            error : "Missing ID.",
            checkErr : (field: string) => {if(field.length) return false; else{return true}}
        },
        {
            id: "title",
            name: "Title",
            type: "text",
            required: true,
            error : "Missing ID.",
            checkErr : (field: string) => {if(field.length) return false; else{return true}}
        },
        {
            id: "url",
            name: "URL",
            type: "text",
            required: true,
            error : "Missing ID.",
            checkErr : (field: string) => {if(field.length) return false; else{return true}}
        },
        {
            id: "pictures",
            name: "Pictures",
            type: "pictures",
            required: false,
            error : "Missing ID.",
            checkErr : (field: string) => {if(field.length) return false; else{return true}}
        },
        {
            id: "content",
            name: "Content",
            type: "tinymce",
            required: true,
            error : "Missing ID.",
            checkErr : (field: string) => {if(field.length) return false; else{return true}}
        }
        
    ]
}

export default articleWebSchema;