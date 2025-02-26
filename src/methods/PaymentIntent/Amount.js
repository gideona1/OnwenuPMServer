import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET);

export const amount = async (parent) => {
  return (await stripe.paymentIntents.retrieve(parent)).amount;
  // return 80099;
};
