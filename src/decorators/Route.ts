import { RouteCollection } from '../RouteCollection';

export function Route(path: string | RegExp) {
    return function (Target) {
        return RouteCollection.register(Target, path);
    }
}
