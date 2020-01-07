import { NextFunction, Request, Response } from 'express'
import env from './env'

export function resourceId (req: Request, res: Response, next: NextFunction) {
  req.resourcePath = req.path.substring(1)
  req.resourceId = `${env.BASE_URI}${req.resourcePath}`
  next()
}
