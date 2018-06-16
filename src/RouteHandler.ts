import { RouteDispatcher } from './RouteDispatcher';
import { RouteDescriptor, RouteCollection } from './RouteCollection';
import * as express from "express";
import { RouteConstructor } from './RouteContructor';
import { ExpressData } from './ExpressData';

export class RouteHandler {
    constructor(public dispatcher: RouteDispatcher, public descriptor: RouteDescriptor) { }

    public async request(data: ExpressData) {
        const reqMethod = data.req.method.toLowerCase();
        const Target = this.descriptor.Target;
        const method = this.descriptor.getMethod(reqMethod);
        if (method) {
            const routeContructor = new RouteConstructor(method, data);
            try {
                const result = await routeContructor.create();
                if (result !== undefined) {
                    data.res.send(result);
                }
            } catch (e) {
                for (const eHandler of RouteCollection.errorHandlers) {
                    if ( eHandler.test(data, e) ){
                        return;
                    }
                }
                console.error(e);
                data.res.status(500);
                return data.res.send({error : e.message || e})
            }
        }
    }
}