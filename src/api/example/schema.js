const {
  product: { product },
  cart: { cart },
  customer: { customerSignInResult }
} = require('commercetools-entities-schemas');

const errorResponse = {
  type: 'object',
  properties: {
    errors: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description:
              'unique identifier for this particular occurrence of the problem'
          },
          code: {
            type: 'string',
            enum: ['001'],
            description: `> an internal specific error code:
             - 001: Request schema validation error
             
             `
          },
          status: {
            type: 'string',
            description: 'the HTTP status code applicable to this problem'
          },
          title: {
            type: 'string',
            description: 'a short, human-readable summary of the problem'
          },
          detail: {
            type: 'string',
            description: 'a human-readable explanation'
          },
          meta: {
            type: 'object',
            description:
              'a meta object containing non-standard meta-information',
            additionalProperties: true
          }
        },
        required: ['status']
      }
    }
  },
  required: ['errors']
};

const defaultResponse = {
  '4XX': {
    description: 'Client Error',
    ...errorResponse
  },
  '5XX': {
    description: 'Internal Server Error',
    ...errorResponse
  }
};

const methodSchema = {
  title: 'Method example',
  description: 'Method example descriptions',
  operationId: 'MethodExample',
  tags: ['private', 'public'],
  querystring: {
    type: 'object',
    properties: {
      queryOne: { type: 'string' },
      queryTwo: { type: 'string' }
    },
    required: ['queryOne']
  },

  response: {
    200: {
      type: 'object',
      description: 'Method response example',
      properties: {
        queryOne: { type: 'string' },
        queryTwo: { type: 'string' }
      },
      required: ['queryOne']
    },
    ...defaultResponse
  }
};

const methodCTSchema = {
  title: 'Method with ct request example',
  description: 'Method example descriptions',
  operationId: 'MethodCTExample',
  tags: ['private', 'public'],
  querystring: {
    type: 'object',
    properties: {
      name: { type: 'string' }
    },
    required: ['name']
  },

  response: {
    200: {
      type: 'object',
      description: 'Method response example',
      items: product,
      additionalProperties: true
    },
    ...defaultResponse
  }
};

const discountCodeSchema = {
  title: 'Discount Code',
  description: 'A discount code to add to a cart',
  operationId: 'AddDiscountCodeToCart',
  tags: ['private', 'public'],
  params: {
    type: 'object',
    properties: {
      cartId: { type: 'string' }
    },
    required: ['cartId']
  },
  body: {
    type: 'object',
    properties: {
      code: { type: 'string' }
    },
    required: ['code']
  },
  response: {
    200: {
      type: 'object',
      description: 'Cart with discount code applyed',
      items: cart,
      additionalProperties: true
    },
    ...defaultResponse
  }
};

const customerSchema = {
  title: 'Create a new customer',
  description: 'Creates a new customer with the api',
  operationId: 'NewCustomer',
  tags: ['private', 'public'],
  body: {
    type: 'object',
    properties: {
      email: { type: 'string' },
      password: { type: 'string' },
      firstName: { type: 'string' },
      lastName: { type: 'string' }
    },
    required: ['email', 'password']
  },
  response: {
    200: {
      type: 'object',
      description: 'Succesfully customer created',
      items: customerSignInResult,
      additionalProperties: true
    },
    ...defaultResponse
  }
};

const confirmPaymentSchema = {
  title: 'Process a new payment',
  description: 'Process a new stripe payment',
  operationId: 'NewPayment',
  tags: ['private', 'public'],
  body: {
    type: 'object',
    properties: {
      payment_intent_id: { type: 'string' }
    },
    required: ['payment_intent_id']
  },
  response: {
    ...defaultResponse
  }
};

const createPaymentSchema = {
  title: 'Validate a payment',
  description: 'Validates a payment with stripe api',
  operationId: 'NewPayment',
  tags: ['private', 'public'],
  body: {
    type: 'object',
    properties: {
      payment_method_id: { type: 'string' },
      currency: { type: 'number' },
      amount: { type: 'number' }
    },
    required: ['payment_method_id', 'currency', 'amount']
  },
  response: {
    ...defaultResponse
  }
};

module.exports = {
  methodSchema,
  methodCTSchema,
  discountCodeSchema,
  customerSchema,
  confirmPaymentSchema,
  createPaymentSchema
};
