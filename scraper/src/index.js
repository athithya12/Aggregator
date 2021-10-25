const { Publisher, Subscriber } = require("@aggregatorio/core");
const startScraping = require("./startScraping");

let publisher = null;
let subscriber = null;

const eventHandler = (_msg) => {
  const msg = JSON.parse(_msg.content);

  console.log(msg);

  const { event, payload } = msg;

  switch (event) {
    case "SCRAPING_REQUEST":
      startScraping(payload.url);
      break;
    default:
      console.log("Invalid Event!");
  }

  publisher.publish({ event: "SANITY_REPLY", payload: "Ipsum" });
};

const startApp = async () => {
  publisher = await Publisher.build(
    "amqp://rabbitmq-service:5672",
    "downstream"
  );

  subscriber = await Subscriber.build(
    "amqp://rabbitmq-service:5672",
    "upstream",
    eventHandler
  );

  subscriber.listenForEvents();
};

startApp();
