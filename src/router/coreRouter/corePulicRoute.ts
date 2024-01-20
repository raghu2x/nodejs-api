import { sendErrorResponse } from '@/utils/apiResponse'
import express, { type NextFunction, type Request, type Response } from 'express'
import httpStatus from 'http-status'
import path from 'path'

const router = express.Router()

router
  .route('/:subPath/:directory/:file')
  .get((req: Request, res: Response, next: NextFunction) => {
    try {
      const { subPath, directory, file } = req.params

      const options = {
        root: path.join(__dirname, `../../public/${subPath}/${directory}`)
      }

      const fileName = file

      res.sendFile(fileName, options, error => {
        if (error instanceof Error) {
          console.log('Can`t find file', error)
          sendErrorResponse(res, httpStatus.NOT_FOUND, `We could not find: ${file}`)
        }
      })
    } catch (error) {
      sendErrorResponse(res, httpStatus.SERVICE_UNAVAILABLE, error.message as string)
    }
  })

export default router
