const router = require("express").Router();
const passport = require("passport")
const bcrypt = require("bcrypt");
const User = require("../models/User")

const CLIENT_URL = "http://localhost:3000/";

router.post("/register", async (req, res) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
      });
      const savedUser = await newUser.save();
      res.status(201).json(savedUser);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  router.post("/login", async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) return res.status(400).json("User not found");
      
      const validPassword = await bcrypt.compare(req.body.password, user.password);
      if (!validPassword) return res.status(400).json("Wrong password");
  
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  });

router.get("/login/success", (req, res)=> {
    if(req.user){
    res.status(200).json({
        success: true,
        message: "success",
        user: req.user,
        //cookies: req.cookies
    })
  }
});

router.get("/login/failed", (req, res)=> {
    res.status(401).json({
        success: false,
        message: "failure",
    });
});

router.get("/logout", (req, res) => {
    req.logout();
    res.redirect(CLIENT_URL);
});

router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

router.get("/google/callback", passport.authenticate("google",{
    successRedirect: CLIENT_URL,
    failureRedirect: "/login/failed",
}));


router.get("/github", passport.authenticate("github", { scope: ["profile"] }));

router.get("/github/callback", passport.authenticate("github",{
    successRedirect: CLIENT_URL,
    failureRedirect: "/login/failed",
})
);


router.get("/facebook", passport.authenticate("facebook", { scope: ["profile"] }));

router.get("/facebook/callback", passport.authenticate("facebook",{
    successRedirect: CLIENT_URL,
    failureRedirect: "/login/failed",
})
);


module.exports = router