import { Router } from 'express'
import auth from '../authentication/auth.middleware'
import routes from './routes'
import authRouter from './authRouter'
import crudRouter from '../crud/apiRouter'
import { apiLimiter, createAccountLimiter } from '../utils/rateLimiter'
import { SendEndpointNotFoundResponse } from '../utils/apiResponse'

const router: Router = Router()

// api rate limiters
router.use('/', apiLimiter)
router.use('/api/auth/register', createAccountLimiter)

// routes
router.use('/', routes)
router.use('/api/auth', authRouter)
router.use('/api', auth, crudRouter)

router.all('*', SendEndpointNotFoundResponse)

export default router
