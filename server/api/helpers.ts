import axios, { type AxiosRequestConfig } from "axios";

export const bearerString = (token: string) => ({
    Authorization: `Bearer ${token}`,
});

export const authorizedHeaders = (token: string) => ({
    "Content-Type": "application/json",
    Accept: "application/json",
    ...bearerString(token),
});

export const normalHeaders = (): HeadersInit => ({
    "Content-Type": "application/json",
    Accept: "application/json",
});

export const getRequest = <T>(
    endpoint: string,
    headers: AxiosRequestConfig["headers"]
) =>
    axios
        .get<T>(endpoint, {
            headers,
        })
        .then((res) => res.data);

export const postRequest = <B, R>(
    endpoint: string,
    body: B,
    headers?: AxiosRequestConfig["headers"]
) =>
    axios
        .request<R>({
            method: "post",
            maxBodyLength: Infinity,
            url: endpoint,
            headers,
            data: body,
        })
        .then((res) => res.data);

export const getFetchRequest = <T>(endpoint: string, headers: HeadersInit) =>
    fetch(endpoint, {
        method: "GET",
        headers,
    }).then(async (res) => {
        if (!res.ok) {
            console.log(res);
            throw new Error("failed to make post request");
        }
        return (await res.json()) as T;
    });

export const postFetchRequest = <B, R>(
    endpoint: string,
    headers: HeadersInit,
    body: B
) =>
    fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
    }).then(async (res) => {
        if (!res.ok) {
            console.log(res);
            throw new Error("failed to make post request");
        }
        return (await res.json()) as R;
    });

export const postFetchFormRequest = <R>(
    endpoint: string,
    headers: HeadersInit,
    body: FormData
) =>
    fetch(endpoint, {
        method: "POST",
        headers,
        body: body,
    }).then(async (res) => {
        if (!res.ok) {
            console.log(res);
            throw new Error("failed to make post request");
        }
        return (await res.json()) as R;
    });

export const patchFetchRequest = <T, R>(
    endpoint: string,
    headers: HeadersInit,
    body: R
) =>
    fetch(endpoint, {
        method: "PATCH",
        headers,
        body: JSON.stringify(body),
    }).then((res) => {
        if (!res.ok) throw new Error("failed to make patch request");
        return res.json() as T;
    });

export const deleteFetchRequest = <T>(endpoint: string, headers: HeadersInit) =>
    fetch(endpoint, {
        method: "PATCH",
        headers,
    }).then((res) => {
        if (!res.ok) throw new Error("failed to delete post request");
        return res.json() as T;
    });
