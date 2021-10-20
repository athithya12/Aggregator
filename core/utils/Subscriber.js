const amqp = require("amqplib");

class Subscriber {
  constructor(connectionUri, queue, connection, channel, callback) {
    this.connectionUri = connectionUri;
    this.queue = queue;
    this.connection = connection;
    this.channel = channel;
    this.callback = callback;
  }

  static async build(connectionUri, queue, callback) {
    while (true) {
      try {
        const connection = await amqp.connect(connectionUri);

        const channel = await connection.createChannel();

        await channel.assertQueue(queue, { durable: false });

        return new Subscriber(
          connectionUri,
          queue,
          connection,
          channel,
          callback
        );
      } catch (err) {
        console.log(err);
        continue;
      }
    }
  }

  disconnect() {
    this.connection.close();
    this.connection = null;
    this.channel = null;
  }

  listenForEvents() {
    this.channel.consume(this.queue, this.callback, { noAck: true });
  }
}

module.exports = Subscriber;
