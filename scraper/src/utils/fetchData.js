const axios = require("axios");
const cheerio = require("cheerio");

const fetchData = async (url) => {
  const { data } = await axios({ method: "get", url: url });

  return cheerio.load(data);
};

module.exports = fetchData;
