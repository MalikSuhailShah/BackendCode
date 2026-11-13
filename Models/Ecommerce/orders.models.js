import mongoose from 'mongoose'

const OrderItemSchema = new mongoose.Schema({
  
    ProductId:{
      type:String,
      required:true
    },
    Quantity:{
      type:Number,
      required:true
    }
  
})

const orderSchema = new mongoose.Schema({
  OrderPrice:{
    type:Number,
    required:true
  },
  ItemQuantity:{
      type:[OrderItemSchema]
  },
  Address:{
      type:String,
      required:true
  },
  status:{
    type:String,
    enum:["PENDING", "DELIVERED", "CANCELLED"]
  },
  customer:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  }
}, {timestamps:true})


export const Order = mongoose.model("Order", orderSchema)