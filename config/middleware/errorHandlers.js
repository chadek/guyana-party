/*
  Catch Errors Handler

  With async/await, you need some way to catch errors
  Instead of using try{} catch(e) {} in each controller, we wrap the function in
  catchErrors(), catch any errors they throw, and pass it along to our express middleware with next()
*/
export const catchErrors = fn => {
  return (req, res, next) => fn(req, res, next).catch(next)
}

/*
  Not Found Error Handler

  If we hit a route that is not found, we mark it as 404 and pass it along to the next error handler to display
*/
export const notFound = (req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
}

/*
  Development Error Handler

  In development we show good error messages so if we hit a syntax error or any other previously un-handled error, we can show good info on what happened
*/
export const devErrors = (err, req, res, next) => {
  if (!err) return next(err)
  const status = err.status || 500
  res.status(status).json({
    status,
    error: err.message,
    stack: (err.stack || '').replace(
      /[a-z_-\d]+.js:\d+:\d+/gi,
      '<mark>$&</mark>'
    )
  })
}

/*
  Production Error Handler

  No stacktraces are leaked to user
*/
export const prodErrors = (err, req, res, next) => {
  if (!err) return next(err)
  const status = err.status || 500
  res.status(status).json({
    status,
    error: err.message
  })
}
