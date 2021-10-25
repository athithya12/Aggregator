const axios = require("axios");
const cheerio = require("cheerio");

const fetchData = async (url) => {
  const { data } = await axios({ method: "get", url: url });

  return cheerio.load(data);
};

const startScraping = async (url) => {
  let products = [];

  const $ = await fetchData(url);

  $('div[data-component-type="s-search-result"]').each((i, item) => {
    let product = {};

    // product["imgUrl"] = $(this).find("img").attr("src");

    product["imgUrl"] = $("img", item).attr("src");
    product["linkToProduct"] = "https://amazon.in" + $("a", item).attr("href");

    products.push(product);
  });

  console.log(products);
};

module.exports = startScraping;
