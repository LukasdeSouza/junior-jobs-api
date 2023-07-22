const router = require('express').Router()

const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)

// router.post('/create-user', async (req, res) => {
//   try {
//     const customer = await stripe.customers.create({
//       email: req.body.email,
//       description: 'new user'
//     })
//     res.send(customer)
//   } catch (e) {
//     res.status(500).json({ error: e.message })
//   }
// })

router.post('/create-subscription', async (req, res) => {
  const { name, email, priceId, cardExpMonth, cardExpYear, cardNumber, cvc } = req.body

  const paymentMethod = await stripe.paymentMethods.create({
    type: 'card',
    card: {
      exp_month: cardExpMonth,
      exp_year: cardExpYear,
      number: cardNumber,
      cvc: cvc
    }
  })

  const customer = await stripe.customers.create({
    name: name,
    email: email,
    payment_method: paymentMethod.id,
    invoice_settings: {
      default_payment_method: paymentMethod.id,
    },
  });

  // const attachPaymentMethod = await stripe.paymentMethods.attach(
  //   paymentMethod.id,
  //   { customer: customer.id }
  // );

  try {
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      payment_settings: {
        payment_method_options: {
          card: {
            request_three_d_secure: 'any',
          },
        },
        payment_method_types: ['card'],
        save_default_payment_method: 'on_subscription',
      },
      expand: ['latest_invoice.payment_intent'],
    });

    res.json({
      message: 'Inscrição efetuada com Sucesso!',
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
      subscriptionId: subscription.id,
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Erro ao efetuar inscrição" });
  }

})

router.post('/cancel-subscription', async (req, res) => {
  const deletedSubscription = await stripe.subscriptions.del(
    req.body.subscriptionId
  );
  res.send(deletedSubscription);
});


module.exports = router