import { RouteCollection } from '../RouteCollection';
export function Injector(name : string) {
    return function (Target : any) {
        return RouteCollection.registerInjector(name, Target);
    }
}
