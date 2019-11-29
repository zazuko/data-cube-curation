import { NextFunction, Request, Response } from 'express'

export function resourceId (req: Request, res: Response, next: NextFunction) {
  req.resourcePath = req.path.substring(1)
  req.resourceId = `${process.env.BASE_URI}${req.resourcePath}`
  next()
}
