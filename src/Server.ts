import * as express from "express";
import { RouteDispatcher } from './RouteDispatcher';
import * as bodyParser from "body-parser";

export interface ServerOptions {
    port?: number;
}

export class Server {
    public app: express.Application;
    public dispatcher = new RouteDispatcher(this)

    constructor(public opts: ServerOptions) {
        this.app = express();
        setTimeout(() => { this.launch(); }, 0);
    }

    public static(path: string, folder: string) {
        this.app.use(path, express.static(folder))
    }

    private launch() {
        const port = this.opts.port || process.env.PORT || 3000;
        this.dispatcher.setup();
        this.app.use(bodyParser.urlencoded({ extended: false }))
        this.app.use(bodyParser.json());
        this.app.listen(
            this.opts.port || process.env.PORT || 3000, () =>
                console.log(`FuseHTTP app listening on port ${port}!`))
    }

    public static start(opts?: ServerOptions): Server {
        opts = opts || {};
        return new Server(opts);
    }
}