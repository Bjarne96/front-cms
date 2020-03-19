import Cookies from 'universal-cookie';

//Creates cookie with JWT value
export const saveJWT = (token: string) => {
    const cookies = new Cookies();
    cookies.set("JWT", token, { path: '/' });
};

//Gets cookie with JWT value
export const getJWT = () => {
    const cookies = new Cookies();
    let cookieValue = cookies.get('JWT');
    if(cookieValue !== undefined) {return cookieValue;}
    return null;
};

//Removes cookie with JWT value
export const removeJWT = () => {
    const cookies = new Cookies();
    cookies.remove('JWT', { path: '/' });
    return null;
};