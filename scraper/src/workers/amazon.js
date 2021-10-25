const fetchData = require("../utils/fetchData");

const getAmazonData = async (query) => {
  let products = [];

  query = query.toLowerCase();

  const url = "https://amazon.in/s?k=" + query.replace(" ", "+");

  // console.log(url);

  const $ = await fetchData(url);

  $('div[data-component-type="s-search-result"]').each((i, item) => {
    let product = {};

    product["imgUrl"] = $("img", item).attr("src");
    product["linkToProduct"] = "https://amazon.in" + $("a", item).attr("href");

    products.push(product);
  });

  return products;
};

module.exports = { getAmazonData };
