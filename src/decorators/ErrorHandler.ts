import { RouteCollection } from '../RouteCollection';

export function ErrorHandler() {
    return function (Target : any) {
        return RouteCollection.registerErrorInjector(Target);
    }
}
