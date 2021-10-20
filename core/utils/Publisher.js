const amqp = require("amqplib");

class Publisher {
  constructor(connectionUri, queue, connection, channel) {
    this.connectionUri = connectionUri;
    this.queue = queue;
    this.connection = connection;
    this.channel = channel;
  }

  static async build(connectionUri, queue) {
    while (true) {
      try {
        const connection = await amqp.connect(connectionUri);

        const channel = await connection.createChannel();

        await channel.assertQueue(queue, { durable: false });

        return new Publisher(connectionUri, queue, connection, channel);
      } catch (err) {
        console.log(err);
        await new Promise((r) => setTimeout(r, 5000));
        continue;
      }
    }
  }

  disconnect() {
    this.connection.close();
    this.channel.close();
  }

  publish(_e) {
    this.channel.sendToQueue(this.queue, Buffer.from(JSON.stringify(_e)));
  }
}

module.exports = Publisher;
