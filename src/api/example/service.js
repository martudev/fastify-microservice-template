module.exports = fastify => {
  const { ProductProjectionRepository } = fastify.commercetools.repositories;

  const { client, requestBuilder } = fastify.commercetools;

  const stripe = require('stripe')(
    'sk_test_51KIz8vFWsQK9wZRJc5lz8hwzqkS1KcmP42Rla1Q09fhzg4fCVdHIncCQQ9ZvpOKsOKf9j8hSGWvjEwF9rag29AW3008PphsbXB'
  );

  const service = {};

  service.getProducts = async query => {
    return ProductProjectionRepository.find(query);
  };

  service.getCart = async cartId => {
    return await client.execute({
      uri: requestBuilder().carts.byId(cartId).build(),
      method: 'GET'
    });
  };

  service.updateCartDiscount = async (cartId, code) => {
    const cart = await service.getCart(cartId);
    return await client.execute({
      uri: requestBuilder().carts.byId(cartId).build(),
      method: 'POST',
      body: {
        version: cart.body.version,
        actions: [
          {
            action: 'addDiscountCode',
            code: code
          }
        ]
      }
    });
  };

  service.createCustomer = async body => {
    return await client.execute({
      uri: requestBuilder().customers.build(),
      method: 'POST',
      body: body
    });
  };

  const generateResponse = intent => {
    // Note that if your API version is before 2019-02-11, 'requires_action'
    // appears as 'requires_source_action'.
    if (
      intent.status === 'requires_action' &&
      intent.next_action.type === 'use_stripe_sdk'
    ) {
      // Tell the client to handle the action
      return {
        requires_action: true,
        payment_intent_client_secret: intent.client_secret
      };
    } else if (intent.status === 'succeeded') {
      // The payment didn’t need any additional actions and completed!
      // Handle post-payment fulfillment
      return {
        success: true
      };
    } else {
      // Invalid status
      return {
        error: 'Invalid PaymentIntent status'
      };
    }
  };

  service.createPayment = async ({ payment_method_id, amount, currency }) => {
    try {
      let intent;
      if (payment_method_id) {
        // Create the PaymentIntent
        intent = await stripe.paymentIntents.create({
          payment_method: payment_method_id,
          amount: amount, // 1099
          currency: currency, // usd
          confirmation_method: 'manual',
          confirm: true
        });
      }
      // Send the response to the client
      return generateResponse(intent);
    } catch (e) {
      // Display error on client
      return { error: e.message };
    }
  };

  service.confirmPayment = async ({ payment_intent_id }) => {
    try {
      let intent;
      if (payment_intent_id) {
        intent = await stripe.paymentIntents.confirm(payment_intent_id);
      }
      // Send the response to the client
      return generateResponse(intent);
    } catch (e) {
      // Display error on client
      return { error: e.message };
    }
  };

  return service;
};
