const cron=require("node-cron");
const {subDays, startOfDay, endOfDay}=require("date-fns");
const ConnectionRequestModel = require("../models/connectionRequest");
const sendEmail=require("./sendEmail");
// This cron job executes:
// Every day at 8:00 AM (server time)
cron.schedule("0 8 * * *",async ()=>{
    console.log("cron job running");
    //Send email to all users who got requests the previous day
    try{
        const yesterday=subDays(new Date(),1);
        const yesterdayStart=startOfDay(yesterday);//12:00:00 AM
        console.log('yesterdayStart: ', yesterdayStart);
        const yesterdayEnd=endOfDay(yesterday);//11:59:59 PM
        console.log('yesterdayEnd: ', yesterdayEnd);
        const pendingRequestsOfYesterday=await ConnectionRequestModel.find({status:"interested",
            createdAt:{
                $gte:yesterdayStart,
                $lte:yesterdayEnd
            }
        }).populate("fromUserId toUserId");
        console.log("Pending requests populated:", pendingRequestsOfYesterday);

        // If you use .populate 
//  You get full user documents in place of just ObjectIds.
        const listOfEmails=[...new Set(pendingRequestsOfYesterday
            .map((request)=>request?.toUserId?.emailId)
            
        )];
        console.log('listOfEmails: ', listOfEmails);

        for(const email of listOfEmails){
            console.log('email: ', email);

            //send email to email
            try{
            const res=await sendEmail.run("New friend Request is Pending for "+email,"Please check your friend requests");
            console.log('res: ', res);
            }catch(err){
                console.log(err);
            }
        }   
    }catch(err){
        console.log(err);
    }
});