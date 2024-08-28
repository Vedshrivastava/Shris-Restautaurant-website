import orderModel from "../models/Order.js";
import userModel from "../models/user.js";
import Stripe from "stripe";

const stripe = new Stripe("sk_test_51Ob6YWSEU0XhnlPBHkHVXPRK8pgyVoo9C7ETttYBcz4stnsOXOhVLWyIdLlZ7lLp2SjTGHy0a0V2qqf8l5KPeCf300Fxmeq9oj")
const frontend_url = "http://localhost:5173"

const placeOrder = async (req, res) => {
    try {
        const newOrder = new orderModel({
            // userId:req.body.userId,
            items:req.body.items,
            amount:req.body.amount,
            address:req.body.address
        })
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId,{cartData:{}});

        const line_items = req.body.items.map((item) => ({
            price_data:{
                currency:"inr",
                product_data:{
                    name:item.name
                },
                unit_amount:item.price*100
            },
            quantity:item.quantity
        }))

        line_items.push({
            price_data:{
                currency:"inr",
                product_data:{
                    name:'Delivery Charges'
                },
                unit_amount:20*100
            },
            quantity:1
        })

        const session = await stripe.checkout.sessions.create({
            line_items:line_items,
            mode:"payment",
            success_url:"http://localhost:5173/sucess",
            cancel_url:`${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
        })
        res.json({success:true, session_url:session.id})

    } catch (error) {
        console.log(error)
        res.json({success:false, message: "Error"})
    }
}

// USE WEBHOOKS FOR PAYMENT VERIFICATION

const verifyOrders = async (req, res) => {
    const {orderId, success} = req.body;
    try {
        if(success=="true") {
            await orderModel.findByIdAndUpdate(orderId,{payment:true});
            res.json({success:true, message:"Payment Done"})
        }
        else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({success:false, message:"Payment not done"})
        }
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error"})
    }
}

const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({userId:req.body.userId});
        res.json({success:true, data:orders})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:"Error"})
    }
}



const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({success:true, data:orders});
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error"});
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

export {placeOrder, verifyOrders,userOrders,listOrders, updateStatus}