import { Router, type Request, type Response } from 'express'
import { MAIL_SETTINGS } from '../config'
// import IP from 'ip'

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
  // const ipAddress = req.headers['x-forwarded-for'] ?? req.connection.remoteAddress
  // const userAgent = req.get('user-agent')
  // const ip = IP.address()

  res.sendFile('resume.pdf', { root: 'public' }, function (err) {
    console.log(err)
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (err) res.status(500).json({ success: false, message: "couldn't find file" }) // send a 500 on error
  })
  // res.send({
  //   success: true,
  //   ipAddress,
  //   userAgent,
  //   ip
  //   // data: Object.keys(models),
  // })
})

export default router
