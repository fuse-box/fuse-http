import { RouteCollection } from '../RouteCollection';

export function MethodDecorator<A, B = null, C = null>(cls: any) {
    return function (...args: Array<A | B | C>) {
        return function (target, key, descriptor) {
            RouteCollection.registerDecorator(target, key, descriptor, cls, args);
            return descriptor;
        }
    }
}