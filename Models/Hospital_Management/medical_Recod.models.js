import mongoose from "mongoose"

const medicalrecordSchema = new mongoose.Schema(
  {
    patient:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Patient"
    },
    disease:{
      type:String,
      required:true
    },
    doctor:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Doctor"
    },
    Hospital:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Hospital"
    },
    prescription:{
      type:String,
      required:true
    }
  },{timestamps:true})

  export const MedicalRecord = mongoose.model("MedicalRecord", medicalrecordSchema)