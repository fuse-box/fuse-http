import { Server } from "./index";
import { Route } from './decorators/Route';
import { Injector } from './decorators/Injector';
import { ExpressData } from './ExpressData';
import { ErrorNotFound } from './errors/ErrorNotFound';

@Injector("foo")
class Foo {
    public express: ExpressData;
    public inject() {
        return this;
    }

    public getName() {
        return this.express.req.query.name || "not defined";
    }
}

@Route("/")
class TestRoute {
    public async get(foo: Foo) {

        //throw new ErrorNotFound("oi oi")
        return foo.getName();
    }
}

@Route("/test")
class TestRoute2 {
    public async get() {
        return {}
    }
}
Server.start()