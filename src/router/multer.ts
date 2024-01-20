import { sendSuccessResponse } from './../utils/apiResponse'
import { type CustomRequestHandler } from '@/types/common'

export const uploadFiles: CustomRequestHandler = (req, res) => {
  console.log('req body', req.body)
  console.log('upload file', (req as any).upload)

  // @ts-expect-error -ddd
  sendSuccessResponse(res, req.upload)
}
