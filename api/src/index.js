const express = require("express");
const { Publisher, Subscriber } = require("@aggregatorio/core");

const app = express();

let publisher = null;
let subscriber = null;

const eventHandler = (_e) => {
  const e = JSON.parse(_e.content);

  console.log(e);
};

const startApp = async () => {
  publisher = await Publisher.build("amqp://rabbitmq-service:5672", "upstream");

  subscriber = await Subscriber.build(
    "amqp://rabbitmq-service:5672",
    "downstream",
    eventHandler
  );

  subscriber.listenForEvents();

  app.listen(3000, () => {
    console.log("API up and running on PORT 3000");
  });
};

app.get("/api/", (req, res) => {
  publisher.publish({
    event: "SCRAPING_REQUEST",
    payload: { url: "https://www.amazon.in/s?k=jbl+headphones" },
  });

  res.send({ message: "Message Sent" });
});

startApp();
