import { NextFunction, Request, Response } from 'express'

export function getRequestedId(req: Request, res: Response, next: NextFunction) {
  res.locals.resourceId = req.path
  next()
}
