import orderModel from "../models/Order.js";
import userModel from "../models/user.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const frontend_url = "http://localhost:5173"

const placeOrder = async (req, res) => {
    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
            payment: false
        });
        const savedOrder = await newOrder.save();

        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100
            },
            quantity: item.quantity
        }));

        line_items.push({
            price_data: {
                currency: "inr",
                product_data: {
                    name: 'Delivery Charges'
                },
                unit_amount: 20 * 100
            },
            quantity: 1
        });

        // Create a PaymentIntent to support UPI payment method
        const paymentIntent = await stripe.paymentIntents.create({
            amount: req.body.amount * 100, // Total amount in cents
            currency: 'inr',
            payment_method_types: ['upi'], // Allow UPI as a payment method
        });

        // Create the checkout session
        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            mode: "payment",
            success_url: `${frontend_url}/verify?success=true&orderId=${savedOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${savedOrder._id}`,
            customer_email: req.userEmail,
            shipping_address_collection: {
                allowed_countries: ['IN'],
            },
            metadata: {
                orderId: savedOrder._id.toString(),
                paymentIntentId: paymentIntent.id // Attach the payment intent ID to the session
            },
        });

        // Return sessionId instead of session_url
        res.json({ success: true, sessionId: session.id });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error creating checkout session" });
    }
};




// USE WEBHOOKS FOR PAYMENT VERIFICATION

const stripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];

    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.log(`⚠️  Webhook signature verification failed: ${err.message}`);
        return res.sendStatus(400);
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            const orderId = session.metadata.orderId;

            // Update the order status to paid
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            break;

        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.status(200).send('Received');
};

const userOrders = async (req, res) => {
    try {
        console.log("This is userID in order Controller", req.userId);

        // Fetch only paid orders for the specific user
        const orders = await orderModel.find({ 
            userId: req.userId, 
            payment: true  // Ensure that only orders with payment confirmed are retrieved
        }).sort({ date: -1 });

        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error retrieving orders" });
    }
};




const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({payment: true}).sort({ date: -1 });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

const updateStatus = async (req, res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status})
        res.json({success:true, message:"Status Updated Successfully"});
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error"});
    }
}

export {placeOrder, stripeWebhook,userOrders,listOrders, updateStatus}