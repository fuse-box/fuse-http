import { Server } from "./index";
import { Route } from './decorators/Route';
import { Injector } from './decorators/Injector';
import { ExpressData } from './ExpressData';
import { ErrorNotFound } from './errors/ErrorNotFound';


import { MethodDecorator } from "./decorators/MethodDecorator";

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




const Permissions = MethodDecorator<{value : string}, string>(class {
    init(req) {
        console.log("Permissions")
    }
})

const FooBar = MethodDecorator(class {
    init(req) {
        console.log("her")
        if(!req.query.number){
            throw {o :"number must be here"}
        }
    }
})


@Route("/")
class TestRoute {

    @Permissions({pukka: "sukka"}, "sdf")
    @FooBar()
    public async get(foo: Foo) {

        //throw new ErrorNotFound("oi oi")
      //  return { foo : "bar"}
      return {foo : "bar"};
    }
}



@Route("/test")
class TestRoute2 {
    public async get() {
        return {}
    }
}
Server.start()