import { ExpressData } from './ExpressData';
import { RouteMethod, RouteCollection } from './RouteCollection';
import { utils } from "realm-utils"

export class RouteConstructor {
    constructor(public method: RouteMethod, public data: ExpressData) { }

    public async create() {
        return await this.construct(this.method.Target, this.method.name);
    }

    private async getInjection(name: string): Promise<any> {
        const Injector = RouteCollection.injectors.get(name);
        if (RouteCollection.injectors.get(name)) {
            return await this.construct(Injector.Target, "inject")
        }
    }
    private async evalMethod(instance, method, locals?){
        const params = utils.getParameterNamesFromFunction(method);
        const constructedParams = [];
        for (const param of params) {
            if(locals && locals[param]){
                constructedParams.push(locals[param]);    
            } else {
                constructedParams.push(await this.getInjection(param));
            }
        }
        return await method.apply(instance, constructedParams);
    }
    private async construct(Target: any, name: string) {
        const instance = new Target();
        instance.express = this.data;
        const method = instance[name];
        if (typeof method !== "function") {
            return;
        }
        const _prop = "$propertyDecorators";
        const propertyDecorators = instance.constructor.prototype[_prop];
        if(propertyDecorators){
            if( propertyDecorators[name] ){
                for (const item of propertyDecorators[name]) {
                    const handleInstance = new item.handler();
                    
                    if( typeof handleInstance["init"] === "function"){
                        await this.evalMethod(handleInstance, handleInstance["init"], {
                            args  : item.args
                        });
                    }
                }
            }
        }
        return this.evalMethod(instance, method);
    }
}