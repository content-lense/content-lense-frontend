

export const ApiFetch = (req:any, options?:any): Promise<Response> => {
    console.log(req, options)
    req = "https://localhost:55128"+req;
    let headers = options ? (options.headers ?? {}) : {};
    headers["Content-Type"] = "application/ld+json";
    if (localStorage && !req.toString().includes("refresh_token")) {
        const imp = localStorage.getItem("impersonateCcUser");
        if (imp !== null) {
            headers["X-Switch-User"] = imp;
        }
    }
    
    return fetch(req, {
        ...options,
        credentials: "include",
        headers
    });
};
