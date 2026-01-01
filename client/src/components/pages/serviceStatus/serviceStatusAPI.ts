import type { statusObj } from "./statusObj";
import axios from "axios";


interface errorObj {
    error: string,
};

export async function getServiceStatus():Promise<statusObj | errorObj> {
    const res = (await axios.get('/api/serverStatus')).data;
    return res;
};