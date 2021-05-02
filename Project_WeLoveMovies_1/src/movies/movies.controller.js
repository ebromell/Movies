const services = require("./movies.services");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res) {
  const isShowing = req.query.is_showing === "true";
  res.json({ data: await services.list(Boolean(isShowing)) });
}

async function read(req, res) {
  res.json({ data: res.locals.movie });
}

async function movieExists(req, res, next) {
  const movie = await services.read(req.params.movieId);
  if (!movie) return next({ status: 404, message: "Movie Not Found" });
  res.locals.movie = movie;
  return next();
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [movieExists, asyncErrorBoundary(read)],
  movieExists: asyncErrorBoundary(movieExists)
};
