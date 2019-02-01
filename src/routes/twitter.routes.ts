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

router.get('/user/insights', async (req: Request, res: Response) => {
  twitterService.getUserInsights(req.query.username, (response: any) => {
    res.send(response)
  })
})

router.get('/user/profile-picture', async (req: Request, res: Response) => {
  try {
    const { profile_image_url } = await twitterService.getUserProfilePic(req.query.username)

    res.send(profile_image_url)
  } catch(err) {
    console.log(err)
  }
})

router.get('/open-stream', async (req: Request, res: Response) => {
  twitterService.openStream(req.query.keyword)

  res.send('stream open')
})

export const TwitterRouter: Router = router;
