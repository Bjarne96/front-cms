import { getJWT, saveJWT, removeJWT } from './JWTHandler';
//import { Types } from 'mongoose';

//request
let Request = async (path: string, fetchType: "GET" | "POST" | "PUT" | "DELETE", data, fileupload?) => {
    let JWT = await getJWT();

    let header = {"Content-Type": "application/json","Authorization": JWT,}

    //Sets url
    let  url = "https://api-cms-schurwolldecke.herokuapp.com/" + path; //temporary url fix

    let fetchObject: any = {
        credentials: "same-origin",
        method: fetchType,
        headers: header
    };

    //Only Fileupload, no body needed and puts files in header
    if(fileupload) { 
        delete header["Content-Type"];
        header["Authorization"] = JWT;
        header["Accept"] = "*/*";
        fetchObject["body"] = data;
    }

    //Sets body by not GET request and only if its json
    if(fetchType !== "GET" && header["Content-Type"] === "application/json") {
        fetchObject['body'] = JSON.stringify(data);
    }
    //Sends Request
    let response = await fetch(url, fetchObject);

    const json: any = await response.json();

    //If the Request was successful, an new Token from the server will refresh the cookie
    if(json.status === "ok") {
        //Sets token and saves it as cookie (only working with forEach)
        let token;
        response.headers.forEach((val, key) => {if(key === "authorization"){token = val; }});
        saveJWT(token);
        //Todo: setTimeout here and cancel the other timeout

    //Checks for expired token and loggs out the user
    } else if (json.result === "Login expired."){
        await removeJWT();
        location.reload(); 
    }

    //Returns body as json
    //console.log("json", json)
    return json;
    
}

//Gets all data from a table
export const getData = async (path: string) => {
    let json = await Request(path, "GET", {});
    return json;
};

//Gets a specific dataset
export const getRow = async (path: string, id: string) => {
    let full_path = path + "/" + id;
    let json = await Request(full_path, "GET", {});
    return json;
};

//Inserts a specific dataset
export const insertRow = async (path: string, data: any) => {
    let json = await Request(path, "PUT", data);
    return json;
};

//Updates a specific dataset
export const updateRow = async (path: string, id:string, data: any) => {
    let full_path = path + "/" + id;
    let json = await Request(full_path, "POST", data);
    return json;
};

//Deletes a specific dataset
export const deleteRow = async (path: string, id:string) => {
    let full_path = path + "/" + id;
    let json = await Request(full_path, "DELETE", {});
    return json;
};


//Loggs in user and returns the user or error
export const loginUser = async (email: string, password) => {

    //Sets values into body
    let body: any = {email: email, password: password};

    //Posts body
    let json = await Request("login", "POST", body);

    return json;
};

//Form POST that uploads a file
export const uploadFile = async (data: any) => {
    //Data equals the file and true will add the file in header
    let json = await Request("fileupload", "POST", data, true);
    return json;
};

export default getRow;