const Joi = require('joi');
module.exports.listingSchema=Joi.object({
   listing:Joi.object({
    title:Joi.string()
    .required()
    .min(1),
    description:Joi.string()
    .required()
    .min(1),
    image:{
        filename:Joi.string()
        .required()
        .min(1),
        url:Joi.string()
        .allow("",null),

    },
    price:Joi.number()
    .required()
    .min(1),
    location:Joi.string()
    .required()
    .min(1),
    country:Joi.string()
    .required()
    .min(1),

   })
    

})