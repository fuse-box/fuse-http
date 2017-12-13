import { Injector } from "../decorators/Injector";
import { ExpressData } from '../ExpressData';

@Injector("req")
class ReqInjector {
    public express: ExpressData;
    public inject() {
        return this.express.req;
    }
}