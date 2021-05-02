const services = require("./reviews.services");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function reviewExists(req, res, next) {
  const review = await services.read(req.params.reviewId);
  if (review) {
    res.locals.review = review;
    return next();
  }
  next({ status: 404, message: `Review cannot be found.` });
}

async function update(req, res) {
  const updatedReview = {
    ...res.locals.review,
    ...req.body.data,
  };

  await services.update(updatedReview);
  updatedReview.critic = await services.listCritics(updatedReview.critic_id);
  res.json({ data: updatedReview });
}

async function list(req, res) {
  const reviews = await services.listRev(res.locals.movie.movie_id);
  for (let review of reviews) {
    review.critic = await services.listCritics(review.critic_id);
  }
  //console.log(reviews, "sanity");
  res.json({ data: reviews });
}

async function destroy(req, res) {
  await services.destroy(res.locals.review.review_id);
  res.sendStatus(204);
}

module.exports = {
  list: asyncErrorBoundary(list),
  update: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(update)],
  delete: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)],
};
