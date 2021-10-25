const { Publisher, Subscriber } = require("@aggregatorio/core");
const getData = require("./getData");

let publisher = null;
let subscriber = null;

const eventHandler = async (_msg) => {
  const msg = JSON.parse(_msg.content);

  console.log(msg);

  const { event, payload } = msg;

  switch (event) {
    case "SCRAPING_REQUEST":
      const publishPayload = await getData(payload.query);
      publisher.publish({
        event: "SCRAPING_SUCCESSFUL",
        publishPayload,
      });
      break;
    default:
      console.log("Invalid Event!");
  }
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
