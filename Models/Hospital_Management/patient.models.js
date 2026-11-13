import mongoose from "mongoose"

const patientSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  diagnosedWith: {
    type:String,
    required:true
  },
  adressLine1:{
    type:String,
    required:true
  },
  Age:{
    type:Number,
    required:true
  },
  BloodGroup:{
    type:String,
    required:true
  },
  Gender:{
    type:String,
    enum:["Male", "Female", "Other"]
  },
  admittedIn:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Hospital"
  }
},{timestamps:true})

export const Patient = mongoose.model("Patient", patientSchema) 