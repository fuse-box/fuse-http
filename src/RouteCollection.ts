import { utils } from "realm-utils";
import { ExpressData } from './ExpressData';


export class RouteMethod {
    constructor(public Target: any, public name: string, public params: string[]) { }
}

export class RouteInjector {
    public name: string;
    constructor(public Target: any) {
        const test = new Target;
        if (typeof test.inject !== "function") {
            throw new Error("An injector must have inject function");
        }
    }
}


export class RouteErrorHandler {
    constructor(public Target: any) {
        const test = new Target;
        if (typeof test.test !== "function") {
            throw new Error("An ErrorHandler must have a test function");
        }
    }

    public test(data: ExpressData, e: any) {
        const instance = new this.Target(data);
        instance.express = data;
        if ( instance.test(e) === true ){
            return true;
        }
    }
}

export class RouteDescriptor {
    constructor(public path: string, public Target: any) { }

    public getMethod(name: string) {
        const instance = new this.Target();
        if (typeof instance[name] === "function") {
            const params = utils.getParameterNamesFromFunction(instance[name]);
            return new RouteMethod(this.Target, name, params);
        }
    }
}
export class RouteCollection {
    public static collection = new Set<RouteDescriptor>();
    public static injectors = new Map<string, RouteInjector>();
    public static errorHandlers = new Set<RouteErrorHandler>();
    public static register(Target: any, path: any) {
        this.collection.add(new RouteDescriptor(path, Target));
    }

    public static registerInjector(name: string, Target: any) {
        const injector = new RouteInjector(Target);
        injector.name = name;
        this.injectors.set(name, injector);
    }

    public static registerErrorInjector(Target: any) {
        const handler = new RouteErrorHandler(Target);
        this.errorHandlers.add(handler);
    }
}