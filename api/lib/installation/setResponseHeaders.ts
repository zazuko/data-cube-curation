export default function (req, res, next) {
  res.status(201)
  res.setHeader('Location', `${process.env.BASE_URI}`)
  next()
}
