import { Router } from 'express'
import { uploadFiles } from './multer'
import { singleStorageUpload } from '@/api/middlewares/uploadMiddleware'

const router: Router = Router()
router.use(
  '/upload-file',
  singleStorageUpload({ entity: 'setting', fieldName: 'photo', fileType: 'image' }),
  uploadFiles
)
router.use(
  '/upload-pdf',
  singleStorageUpload({ entity: 'setting', fieldName: 'file', fileType: 'pdf' }),
  uploadFiles
)

export default router
