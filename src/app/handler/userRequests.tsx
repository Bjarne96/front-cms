import { insertRow } from "./requestHandler"


//Registers User and returns the user or an error
export const registerUser = async (newUser) => {
    //Posts new User
    let new_user = await insertRow("register", newUser);
    return new_user;
};

