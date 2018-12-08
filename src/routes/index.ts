import { Router, Response } from 'express'

const router: Router = Router()

router.get('/', (_, res: Response) => {
  res.send('Twang')
})

export const MainRouter: Router = router
