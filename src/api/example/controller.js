/* eslint-disable no-empty */
module.exports = fastify => {
  const service = require('./service')(fastify);

  //eslint-disable-next-line
  const { config } = fastify;

  const method = async (request, reply) => {
    const { queryOne, queryTwo } = request.query;

    reply.code(200).send({ queryOne, queryTwo });
  };

  const methodCT = async (request, reply) => {
    const { query } = request;

    const products = await service.getProducts(query);

    reply.code(200).send(products);
  };

  const addDiscountCodeToCart = async (request, reply) => {
    const { cartId } = request.params;
    const { code } = request.body;

    const cart = await service.updateCartDiscount(cartId, code);

    reply.code(200).send(cart);
  };

  const createCustomer = async (request, reply) => {
    const body = request.body;

    const customer = await service.createCustomer(body);

    reply.code(200).send(customer);
  };

  const confirmPayment = async (request, reply) => {
    const { payment_intent_id } = request.body;

    const response = await service.confirmPayment({
      payment_intent_id
    });

    reply.header('Access-Control-Allow-Origin', '*');
    reply.send(response);
  };

  const createPayment = async (request, reply) => {
    const { payment_method_id } = request.body;

    const response = await service.createPayment({
      payment_method_id
    });

    reply.header('Access-Control-Allow-Origin', '*');
    reply.send(response);
  };

  return {
    method,
    methodCT,
    addDiscountCodeToCart,
    createCustomer,
    confirmPayment,
    createPayment
  };
};
