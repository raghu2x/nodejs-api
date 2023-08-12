import { Router, type Request, type Response } from 'express'
import auth from '../middleware/auth'
import routes from './routes'
import authRouter from './authRouter'
import crudRouter from '../crud/apiRouter'

const router: Router = Router()

router.use('/', routes)
router.use('/api/auth', authRouter)
router.use('/api', auth, crudRouter)

router.all('*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Requested endpoint doesn't exist or method not allowed!"
  })
})

export default router
