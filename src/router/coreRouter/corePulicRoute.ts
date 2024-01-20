import express, { type Request, type Response } from 'express'
import path from 'path'

const router = express.Router()

router.route('/:subPath/:directory/:file').get((req: Request, res: Response) => {
  try {
    const { subPath, directory, file } = req.params

    const options = {
      root: path.join(__dirname, `../../public/${subPath}/${directory}`)
    }

    const fileName = file

    res.sendFile(fileName, options, error => {
      if (error) {
        res.status(404).json({
          success: false,
          result: null,
          message: 'We could not find: ' + file
        })
      }
    })
  } catch (error) {
    res.status(503).json({
      success: false,
      result: null,
      message: error.message,
      error
    })
  }
})

export default router
