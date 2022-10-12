import { ApiFetch } from "../helpers/ApiFetch";
import { UserLoginInterface } from "../interfaces/UserInterface";


export async function logoutUser() {

    console.log("Logging out user")

    const resp = await ApiFetch('/auth/logout', {
        credentials: "include"
    });
    document.cookie = `jwt_hp=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT`
    return resp;
}

export async function loginUser(loginData: UserLoginInterface) {
    const resp = await ApiFetch('/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData)
    });
    return resp;
}

export async function getCurrentUser() {
    return await ApiFetch("/auth/me");
}
