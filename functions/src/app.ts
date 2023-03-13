import express, {Request, Response} from 'express';
import cors from "cors";
import morgan from 'morgan';
import userRouter from "./routes/userRoutes";

class App {
    public app: express.Application;

    constructor() {

        // Config
        this.app = express();
        this.expressSetup();

        morgan.token('uid', (req: Request, res: Response) => {
            return res.locals.uid;
        });

        function jsonFormat(tokens: any, req: any, res: any) {
            return JSON.stringify({
                'remote-address': tokens['remote-addr'](req, res),
                'time': tokens['date'](req, res, 'iso'),
                'method': tokens['method'](req, res),
                'url': tokens['url'](req, res),
                'http-version': tokens['http-version'](req, res),
                'status-code': tokens['status'](req, res),
                'content-length': tokens['res'](req, res, 'content-length'),
                'referrer': tokens['referrer'](req, res),
                'user-agent': tokens['user-agent'](req, res),
                'userId': tokens['uid'](req, res),
            });
        }

        this.app.use(morgan(jsonFormat));

        // Routes
        this.app.get("/", (req, res) => {
            res.send(`Octoco API is running!`);
        });
        this.app.use('/users', userRouter)

    }


    private expressSetup(): void {
        this.app.use(express.json());
        this.app.use(cors()); // Default CORS settings applied
    }
}

export default new App().app;