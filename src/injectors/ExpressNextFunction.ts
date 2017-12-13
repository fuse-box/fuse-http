import { Injector } from "../decorators/Injector";
import { ExpressData } from '../ExpressData';

@Injector("next")
class ReqInjector {
    public express: ExpressData;
    public inject() {
        return this.express.next;
    }
}