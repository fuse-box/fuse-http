# FuseHTTP

FuseHTTP is a lightweight HTTP server implementation based on express with simplicity in mind.

```ts
import { Route } from 'fuse-http';
@Route("/")
export class MainRoute {
    public async get(req) {
        return "hello world";
    }
}
```

## Key features

* Simple setup
* Decorator based
* Automatic dependency injections by name
* Custom error handling


```bash
npm install fuse-http --save
```
## Getting started

You would need fuse.js configuration to bundle and start your project. So let's create `fuse.js` first

`fuse.js`

```js
const { FuseBox } = require("fuse-box");
const fuse = FuseBox.init({
    homeDir: "src",
    target: "server@esnext",
    output: "dist/$name.js"
});
fuse.bundle("app")
    .instructions(">[index.ts]")
    .watch().completed(proc => proc.start())
fuse.run();
```

Now let's create our application entry point

`index.ts`


```ts
import { Server } from "fuse-http";

// just import the route module here
import './routes/MainRoute';

// start the server
Server.start({ port: 3001 });
```


Sample route: `routes/MainRoute`


```ts
import { Route } from 'fuse-http';

@Route("/")
export class MainRoute {
    public get(req) {
        return "hello world";
    }
}
```

## Routing


```ts
import { Route } from 'fuse-http';

@Route("/")
export class MainRoute {
    public async get(req) {
        return "hello world";
    }
    public async post() {
        return {};
    }
    public async anyOtherHTTPMethod() {
        return "any other";
    }
}
```

HTTPMethod name must be found in the Route class, once matched it will be executed (with dependency injections).

You can return any kind of object, it will be serialised to JSON if possible. (strings for example will be printed as is)

## Dependency injections

The framework comes with default dependency injections to make your life easier.

| Name        | Object
| ------------- |:-------------|
| req      | Express.req
| res      | Express.res
| next | Express.next

THe order should not matter, the only thing what matter is naming. For example the following example should work just fine.

```ts
@Route("/")
export class MainRoute {
    public async get(next: express.NextFunction) {
        return "hello world";
    }
}
```

### Creating your first injection
The following module must be imported in your entry point.

```ts
import { Injector } from "fuse-http";

@Injector("foo")
class Foo {
    private inject(req : express.Request) {
        return this;
    }
    public helloWorld(){
        return { hello : "world" }
    }
}
```

Now as we registered the injector, we can now use it.

```ts
@Route("/")
export class MainRoute {
    public async get(foo: Foo) {
        return foo.helloWorld() // will render { hello : "world" }
    }
}
```

Here FuseBox magically resolved the first parameter, evaluated `inject` method.


 `inject` method is resolved accordingly, respecting other injections recursively. So you can inject `req` `res` or `next` injections too.


## Decorators

Define your decorator by providing a class with init function to a wrapper `MethodDecorator`

```ts
import { MethodDecorator } from "fuse-http";

export const Permissions = MethodDecorator<string>(class {
    init(req) {
       if (!req.query.foobar){
           throw { message : "Foobar must be there" }
       }
    }
})
```
`init` will be constucted with all your injections including `req` and `res` from `express`


Usage in route

```ts
@Route("/")
class TestRoute {

    @Permissions("sdf")
    public async get() {
      return {ok : true};
    }
}
```

## Error handlers

A handler must have `test` method, where we test if that particular exception should be processed. For example, here is `BaseHandler`

```ts
@ErrorHandler()
export class ErrorBaseHandler {
    public express : ExpressData;
    public test(e){
        const res = this.express.res;
        if ( e instanceof ErrorNotFound){
            res.status(404).send({code : 404, message : e.message})
        }
    }
}
```



