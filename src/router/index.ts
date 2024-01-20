import { Router } from 'express'
import auth from '../authentication/auth.middleware'
import routes from './routes'
import authRouter from './authRouter'
import crudRouter from '../crud/apiRouter'
import { apiLimiter, createAccountLimiter } from '../utils/rateLimiter'
import { SendEndpointNotFoundResponse } from '../utils/apiResponse'
import { uploadFiles } from './multer'
import coreRouter from './coreRouter'
import { singleStorageUpload } from '@/middleware/uploadMiddleware'

const router: Router = Router()

router.use(coreRouter.corePublicRoute)

router.use(
  '/api/upload-file',
  singleStorageUpload({ entity: 'setting', fieldName: 'photo', fileType: 'image' }),
  uploadFiles
)
router.use(
  '/api/upload-pdf',
  singleStorageUpload({ entity: 'setting', fieldName: 'file', fileType: 'pdf' }),
  uploadFiles
)

// api rate limiters
router.use('/', apiLimiter)
router.use('/api/auth/register', createAccountLimiter)

// routes
router.use('/', routes)
router.use('/api/auth', authRouter)
router.use('/api', auth, crudRouter)

router.all('*', SendEndpointNotFoundResponse)

export default router
