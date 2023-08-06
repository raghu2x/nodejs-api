import { Router, type Request, type Response } from 'express'
import { MAIL_SETTINGS } from '../config'

const router: Router = Router()

router.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'hey welcome to our app'
  })
})

router.get('/api/env', (req: Request, res: Response) => {
  console.log('email 18', MAIL_SETTINGS)
  res.status(200).json({
    success: true,
    message: 'hey welcome to our app',
    env: MAIL_SETTINGS
  })
})

router.get('/api/endpoints', (req: Request, res: Response) => {
  res.send({
    success: true
    // data: Object.keys(models),
  })
})

export default router
