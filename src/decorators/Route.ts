import { RouteCollection } from '../RouteCollection';

export function Route(path: string) {
    return function (Target) {
        return RouteCollection.register(Target, path);
    }
}
