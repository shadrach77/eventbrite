import express, {
  json,
  urlencoded,
  Express,
  Request,
  Response,
  NextFunction,
  Router,
} from 'express';
import cors from 'cors';
import { PORT } from './config';
import { EventRouter } from './routers/event.router';
import { AuthRouter } from './routers/auth.router';
import { LocationRouter } from './routers/location.router';
import { CategoryRouter } from './routers/category.router';
import { TicketRouter } from './routers/ticket.router';
import { PromotionRouter } from './routers/promotion.router';
import { TransactionRouter } from './routers/transaction.router';
import { ReviewRouter } from './routers/review.router';
import '@/cronjob/transactionCron'; //please don't remove import. this is to run cronjob

export default class App {
  private app: Express;

  constructor() {
    this.app = express();
    this.configure();
    this.routes();
    this.handleError();
  }

  private configure(): void {
    this.app.use(cors());
    this.app.use(json());
    this.app.use(urlencoded({ extended: true }));
  }

  private handleError(): void {
    // not found
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      if (req.path.includes('/api/')) {
        res.status(404).send('Not found !');
      } else {
        next();
      }
    });

    // error
    this.app.use(
      (err: Error, req: Request, res: Response, next: NextFunction) => {
        if (req.path.includes('/api/')) {
          console.error('Error : ', err.stack);
          res.status(500).send('Error !');
        } else {
          next();
        }
      },
    );
  }

  private routes(): void {
    const eventRouter = new EventRouter();
    const authRouter = new AuthRouter();
    const locationRouter = new LocationRouter();
    const categoryRouter = new CategoryRouter();
    const ticketRouter = new TicketRouter();
    const promotionRouter = new PromotionRouter();
    const transactionRouter = new TransactionRouter();
    const reviewRouter = new ReviewRouter();

    this.app.get('/api', (req: Request, res: Response) => {
      res.send(`Hello, Purwadhika Student API!`);
    });
    this.app.use('/api/events', eventRouter.getRouter());
    this.app.use('/api/auth', authRouter.getRouter());
    this.app.use('/api/locations', locationRouter.getRouter());
    this.app.use('/api/categories', categoryRouter.getRouter());
    this.app.use('/api/tickets', ticketRouter.getRouter());
    this.app.use('/api/promotions', promotionRouter.getRouter());
    this.app.use('/api/transactions', transactionRouter.getRouter());
    this.app.use('/api/reviews', reviewRouter.getRouter());
  }

  public start(): void {
    this.app.listen(PORT, () => {
      console.log(`  ➜  [API] Local:   http://localhost:${PORT}/`);
    });
  }
}
