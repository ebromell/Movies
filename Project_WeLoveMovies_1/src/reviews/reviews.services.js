const knex = require("../db/connection");

function listCritics(critic_id) {
  //console.log(critic_id);
  return knex("critics").select("*").where({ critic_id }).first();
}

function listRev(movie_id){
  return knex("reviews").select("*").where({movie_id});
}

function read(id) {
  return knex("reviews").select("*").where("review_id", id).first();
}

function update(updatedReview) {
  return knex("reviews")
    .select("*")
    .where({ review_id: updatedReview.review_id })
    .update(updatedReview, "*");
}

function destroy(id) {
  return knex("reviews").where("review_id", id).del();
}

module.exports = {
  read,
  update,
  listCritics,
  listRev,
  destroy,
};
