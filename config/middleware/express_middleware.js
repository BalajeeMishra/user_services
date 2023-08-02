const express = require("express");
const session = require("express-session");
const path = require("path");
const passport = require("passport");

module.exports.expressMiddleware = (app) => {
  app.use(express.json({ limit: "50mb" }));
  app.use(session({ secret: "intelliblock_bnz_now_carbon_green", cookie: { maxAge: 60000 * 30 } }));
  app.use(express.urlencoded({ extended: false }));
  app.use(express.static(__dirname + "/public"));
  app.use(passport.initialize());
  app.use(passport.session());
};
