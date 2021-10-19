const Publisher = require("./Publisher");
const Subscriber = require("./Subscriber");

let publisher = null;
let subscriber = null;

const eventHandler = (_e) => {
  const e = JSON.parse(_e.content);

  console.log(e);

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
