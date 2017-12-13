import { ErrorHandler } from '../decorators/ErrorHandler';
import { ExpressData } from '../ExpressData';
import { ErrorNotFound } from './ErrorNotFound';

@ErrorHandler()
export class ErrorBaseHandler {
    public express : ExpressData;
    public test(e){
        const res = this.express.res;
        if ( e instanceof ErrorNotFound){
            res.status(404).send({code : 404, message : e.message})
        }
    }
}



