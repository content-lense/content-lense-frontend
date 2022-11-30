export const ApiFetch = (req: any, options?: any): Promise<Response> => {

  let prefix = process.env.NODE_ENV === "development" ? "https://localhost" : ""
  req = prefix + req;
  let headers = options ? options.headers ?? {} : {};
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
    headers,
  });
};
