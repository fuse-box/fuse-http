import { Server } from './Server';
import { RouteCollection } from './RouteCollection';
import { RouteHandler } from './RouteHandler';
import { ExpressData } from './ExpressData';



export class RouteDispatcher {
    constructor(public server : Server) {}

    public setup(){
        this.setupRoutes();
    }

    private setupRoutes(){
        for( const item of RouteCollection.collection ) {
            this.server.app.all(item.path, (req, res, next) => {
                const expressData = new ExpressData(req, res, next);
                const handler = new RouteHandler(this, item)
                return handler.request(expressData)
            });
        }
    }
}