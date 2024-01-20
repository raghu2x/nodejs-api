import { Router } from 'express'
import auth from '@/api/controllers/coreController/authController/verifyToken'
import routes from './routes'
import authRouter from './authRouter'
import crudRouter from '@/crud/apiRouter'
import { apiLimiter } from '@/utils/rateLimiter'
import { SendEndpointNotFoundResponse } from '@/utils/apiResponse'
import coreRouter from './coreRouter'
import fileUploadRouter from './coreRouter/fileUploadRouter'

const router: Router = Router()

router.use(coreRouter.corePublicRoute)

// api rate limiters
router.use('/', apiLimiter)

// routes
router.use('/', routes)
router.use('/api/auth', authRouter)
router.use('/api', fileUploadRouter)
router.use('/api', auth, crudRouter)

router.all('*', SendEndpointNotFoundResponse)

export default router
