import { Router, Request, Response } from 'express';

const router: Router = Router();

router.get('/', (req: Request, res: Response) => {
  console.log('Request: ', req);

  res.send('Hello!');
});

export const MainRouter: Router = router;
