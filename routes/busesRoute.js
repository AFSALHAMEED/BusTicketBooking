const router = require("express").Router();

const Bus = require("../models/busModel");

const authmiddleware = require('../middlewares/authMiddleware');

// add bus

router.post("/add-bus",authmiddleware, async (req, res) => {
  try {
    const existingBus = await Bus.findOne({ number: req.body.number });
    if (existingBus) {
      return res.status(200).send({
        message: "Bus Already Exist",
        success: false,
      });
    }
    else{
        const newBus = new Bus(req.body)
        await newBus.save()
        return res.status(200).send({
            success:true,
            message:"Bus Added Successfully"
        })
    }
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

// update bus

router.post('/update-bus',authmiddleware,async (req,res)=>{
      try {
        await Bus.findByIdAndUpdate(req.body._id,req.body)
        res.status(200).send({
          success:true,
          message:"Bus Updated Successfully"
        })
      } catch (error) {
        res.status(500).send({
          success:false,
          message:error.message
        })
       
      }
})

// delete bus

router.post('/delete-bus',authmiddleware,async (req,res)=>{
  try {
    await Bus.findByIdAndDelete(req.body._id)
  return res.status(200).send({
    success:true,
    message:"Bus Updated Successfully"
  })
  } catch (error) {
    res.status(500).send({
      success:false,
      message:error.message
    })
  }
  
})

// get all buses

router.post('/get-all-buses',authmiddleware,async (req,res)=>{

  try {
    const buses = await Bus.find(req.body)
  return res.status(200).send({
    success:true,
    message:"Buses Fetched Successfully",
    data:buses
  })
  } catch (error) {
    res.status(500).send({
      success: false,
       message: error.message
    })
  }
  
})

// get bus by id

router.post("/get-bus-by-id",authmiddleware, async (req, res) => {
  try {
    const bus = await Bus.findById(req.body._id);
    return res.status(200).send({
      success: true,
      message: "Bus Fetched Successfully",
      data: bus,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});
module.exports=router;