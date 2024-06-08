export const socket = (client, io) => () => {
  console.debug(`!!! Socket ${client.id} disconnected.`);
};

