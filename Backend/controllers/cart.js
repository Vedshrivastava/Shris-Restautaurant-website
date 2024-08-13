import userModel from '../models/user.js'

const addToCart = async (req, res) => {
    try {
        const userData = await userModel.findOne({_id:req.body.userId});
        const cartData = userData.cartData;
        if(!cartData[req.body.itemId])
        {
            cartData[req.body.itemId] = 1;
        }
        else
        {
            cartData[req.body.itemId] += 1;
        }
        await userModel.findByIdAndUpdate(req.body.userId,{cartData})
        res.json({success:true, message:"Added to cart"})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:"Failed to add to cart"})
    }

}

const updateCartQuantity = async (req, res) => {
    try {
        const { userId, itemId, quantity } = req.body;
        const userData = await userModel.findOne({ _id: userId });
        if (!userData) {
            return res.json({ success: false, message: 'User not found' });
        }
        const cartData = userData.cartData || {};
        if (quantity <= 0) {
            delete cartData[itemId];
        } else {
            cartData[itemId] = quantity;
        }
        await userModel.findByIdAndUpdate(userId, { cartData });
        res.json({ success: true, message: 'Cart item quantity updated' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: 'Failed to update cart item quantity' });
    }
}


const removeFromCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        let cartData = userData.cartData;
        cartData[req.body.itemId] = 0;
        await userModel.findByIdAndUpdate(req.body.userId,{cartData});
        res.json({success:true, message:"Removed from cart"})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:"Failed to remove"})
    }
}

const getCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId);

        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        let cartData = userData.cartData;

        res.json({ success: true, cartData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error retrieving cart data" });
    }
};


export {addToCart, removeFromCart, getCart, updateCartQuantity}