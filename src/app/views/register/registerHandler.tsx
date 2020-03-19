//user registration api call
export const checkPassword = (password1, password2) => {
    if(password1 === password2) {
        return true;
    }
    return false;
};

export const checkError = (response: any) => {
    console.log("response", response)
    if(response["error"] !== undefined) {
        return true
    }
    return false;
};



