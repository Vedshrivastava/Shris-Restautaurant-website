// import stripe from "stripe";


// const paymentIntent = async(req,res) =>{
//     const { address, items, amount } = req.body;

//   try {
//     // Create a new Stripe Checkout Session
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ['card'], // or ['upi'] for UPI payments
//       line_items: items.map(item => ({
//         price_data: {
//           currency: 'inr',
//           product_data: {
//             name: item.name,
//           },
//           unit_amount: item.price * 100, // Price in paisa
//         },
//         quantity: item.quantity,
//       })),
//       mode: 'payment',
//       success_url: 'https://yourdomain.com/success', // Replace with your success URL
//       cancel_url: 'https://yourdomain.com/cancel', // Replace with your cancel URL
//       customer_email: address.email,
//     });

//     // Send the session URL back to the frontend
//     res.send({ success: true, session_url: session.url });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ success: false, message: 'Failed to create payment session' });
//   }
// }

// export{paymentIntent}

