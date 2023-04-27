const router = require("express").Router();
const { query, validationResult, body } = require('express-validator');
const { User } = require("../db/User");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");

router.get("/", (req, res) => {
  res.send("Hello Auth.js");
});

router.post(
  "/register",
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()})
    }

    const user = User.find(user => user.email === email);
    if (user) {
      return res.status(400).json([
        {
          message: "既にユーザーは登録済みです。",
        },
      ]);
    }

    let hashedPassword = await bcrypt.hash(password, 10);

    User.push({
      email,
      password: hashedPassword,
    });

    const token = await JWT.sign(
      {
        email,
      },
      "SECRET_KEY",
      {
        expiresIn: "24h",
      }
    );
    return res.json({
      token: token,
    });
  }
);

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = User.find((user) => user.email === email);
  if (!user) {
    return res.status(400).json([
      {
        message: "そのユーザーは存在しません。",
      },
    ]);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json([
      {
        message: "パスワードが異なります。",
      },
    ]);
  }

  const token = await JWT.sign(
    {
      email,
    },
    "SECRET_KEY",
    {
      expiresIn: "24h",
    }
  );
  return res.json({
    token: token,
  });
})

router.get("/allUsers", (req, res) => {
  return res.json(User);
})

module.exports = router;