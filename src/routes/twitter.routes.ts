import { Router, Request, Response } from 'express'
import * as twitterService from '../services/twitter.service'
import { cleanTweets } from '../utils/data.utils'

const router: Router = Router();

router.get('/', async (req: Request, res: Response) => {
  twitterService.getTweets(req.query.keyword, (response: any) => {
    const tweets = cleanTweets(response.statuses);

    res.send(tweets);
  })
});

router.get('/user', async (req: Request, res: Response) => {
  twitterService.getUserTweets(req.query.username, (response: any) => {
    res.send(response)
  })
})

router.get('/open-stream', async (req: Request, res: Response) => {
  twitterService.openStream(req.query.keyword)

  res.send('stream open')
})

export const TwitterRouter: Router = router;
