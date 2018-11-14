import { Router, Request, Response } from 'express';
import * as twitterService from '../services/twitter.service';

const router: Router = Router();

router.get('/', async (req: Request, res: Response) => {
  twitterService.getTweets(req.query.keyword, (response: any) => {
    const tweets = twitterService.cleanTweets(response.statuses);
    
    res.send(tweets);
  })
});

export const TwitterRouter: Router = router;
