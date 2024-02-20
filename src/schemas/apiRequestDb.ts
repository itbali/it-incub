import mongoose from "mongoose";

export class ApiRequestDbType  {
    constructor( public IP: string, public URL: string, public date: Date ) { }
    }

const apiRequestsSchema = new mongoose.Schema({
    IP: { type: String, required: true },
    URL: { type: String, required: true },
    date: { type: Date, required: true }
})

export const ApiRequestsModel = mongoose.model<ApiRequestDbType>('apiRequests', apiRequestsSchema);