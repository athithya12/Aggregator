const express = require("express");
const { Publisher, Subscriber } = require("@aggregatorio/core");

const app = express();

const startApp = async () => {
  app.listen(3000, () => {
    console.log("API up and running on PORT 3000");
  });
};

app.get("/api/", async (req, res) => {
  const publisher = await Publisher.build(
    "amqp://rabbitmq-service:5672",
    "upstream"
  );

  await publisher.publish({
    event: "SCRAPING_REQUEST",
    payload: { query: "JBL headphones" },
  });

  const subscriber = await Subscriber.build(
    "amqp://rabbitmq-service:5672",
    "downstream",
    (_e) => {
      const e = JSON.parse(_e.content);

      res.send(e.publishPayload);
    }
  );

  subscriber.listenForEvents();

  // publisher.disconnect();

  // subscriber.disconnect();
});

startApp();
