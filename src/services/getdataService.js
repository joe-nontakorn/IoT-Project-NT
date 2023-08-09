const ErrorHandler = require("../utils/errorHandler");
const logger = require("../utils/logger");
const casual = require("casual");
const Events = require("../models/eventsModel");
const APIFilters = require("../utils/apiFilters");

exports.getData = async (req, res, next) => {
  const data = await Events.find().sort('-createdAt').limit(10);
  return data;
};
