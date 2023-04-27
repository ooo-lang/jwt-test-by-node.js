const router = require("express").Router();
const { publicPosts, privatePosts } = require("../db/Post");
const checkJWT = require("../middleware/checkJWT");

router.get("/public", (req, res) => {
  res.json(publicPosts);
});

router.get("/private", checkJWT, (req, res) => {
  res.json(privatePosts);
});

module.exports = router;