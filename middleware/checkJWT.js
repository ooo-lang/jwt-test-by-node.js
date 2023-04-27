const JWT = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) {
    res.status(400).json([
      {
        message: "権限がありません。",
      },
    ]);
  } else {
    try {
      let user = await JWT.verify(token, "SECRET_KEY")
      console.log(user)
      req.user = user.email

    } catch {
      return res.status(400).json({
      errors: [
          {
            msg: "トークンが一致しません",
          },
        ],
      });
    }
    next();
  }
}