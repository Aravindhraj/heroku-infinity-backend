require('dotenv').config();
const fast2sms = require('fast-two-sms');

exports.sendSMS = async (input) => {
  
var options = {authorization : process.env.FASTSMS_API_KEY , message : input.message ,  numbers : [input.phone_number]} 

fast2sms.sendMessage(options).then(function (data) {
    console.log('Message sent to '+input.phone_number, data);
}).catch(function (error) {
    console.log('Message sending failed', error);
})}


exports.getWalletBalance = async (input) => {
  fast2sms.getWalletBalance(process.env.FASTSMS_API_KEY).then(function (data) {
      console.log('Retreived Wallet balance', data);
  }).catch(function (error) {
      console.log('Error while retreiving wallet balance', error);
  })}
