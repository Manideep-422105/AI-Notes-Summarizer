const express=require('express');
const router=express.Router();
const summaryRoutes = require('./SummaryRoutes');
router.use('/summary',summaryRoutes);

module.exports=router;