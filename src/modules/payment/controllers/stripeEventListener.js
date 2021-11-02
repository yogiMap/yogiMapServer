const clientGetByStripeIdQuery = require('../../client/queries/getByStripeId');
const { get } = require('lodash');
const createPaymentQuery = require('../queries/create');
const clientAddPaymentQuery = require('../../client/queries/addPayment');
const mongoose = require('mongoose');
//const getByStripeId = require('../../invoice/queries/getByStripeId');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY_TEST);

const endpointSecret = 'whsec_O4wq0ZYDzlW9jz4DujmEKraxCWK8ta40';

module.exports = async function getStripeEvents(request, response) {
  const _id = new mongoose.Types.ObjectId();

  let event;

  try {
    event = request.body;
  } catch (err) {
    request.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;

      const customerStripeId = await clientGetByStripeIdQuery(
        paymentIntent.charges.data[0].customer,
      );
      const clientId = get(customerStripeId, 'payload._id', '');
      const email = get(customerStripeId, 'payload.email', '');

      const invoiceStripeId = await getByStripeId(paymentIntent.invoice);
      const invoiceId = get(invoiceStripeId, 'payload.numberShortCode', '');
      const ownerId = get(invoiceStripeId, 'payload.owner', '');
      const teacherAccountId = get(invoiceStripeId, 'payload.teacherAccount', '');

      const createPaymentDocument = await createPaymentQuery({
        _id: _id,
        paymentNumber: '000000000000000',
        numberShortCode: invoiceId,
        amount: paymentIntent.amount / 100,
        paymentType: 'credit card',
        creditCardLast4: paymentIntent.charges.data[0].payment_method_details.card.last4,
        creditCardStatus: 'success',
        creditCardEmail: email,
        owner: ownerId,
        client: clientId,
        teacherAccount: teacherAccountId,
      });

      const clientAddPaymentDocument = clientAddPaymentQuery({
        paymentId: _id,
        clientId,
      });

      const PromiseAllResult = await Promise.all([
        createPaymentDocument,
        clientAddPaymentDocument,
      ]);
      const createPaymentResult = PromiseAllResult[0];
      const clientAddPaymentResult = PromiseAllResult[1];

      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  response.json({ received: true });
};
