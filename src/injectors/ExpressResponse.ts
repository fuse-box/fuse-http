import { Injector } from "../decorators/Injector";
import { ExpressData } from '../ExpressData';

@Injector("res")
class ReqInjector {
    public express: ExpressData;
    public inject() {
        return this.express.res;
    }
}