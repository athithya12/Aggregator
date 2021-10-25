const { getAmazonData } = require("./workers/amazon");

const getData = async (query) => {
  const amazonData = getAmazonData(query);

  return amazonData;
};

module.exports = getData;
