import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET);

export const status = async (parent) => {
  console.log();
  return (await stripe.paymentIntents.retrieve(parent)).status;
};
