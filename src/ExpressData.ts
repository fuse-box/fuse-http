import * as express from "express";
export class ExpressData {
    constructor(public req: express.Request, public res: express.Response, public next: express.NextFunction) { }
}