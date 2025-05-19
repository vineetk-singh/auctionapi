import Joi from 'joi';

export const playerSchema = Joi.object({
  _id: Joi.string().required(), // name
  age: Joi.number().min(15).max(50).required(),
  country: Joi.string().required(),
  role: Joi.string().valid('batting', 'bowling', 'allrounder').required(),
  basePrice: Joi.number().min(0).required(),

  records: Joi.object({
    batting: Joi.object({
      totalRuns: Joi.number().default(0),
      total4s: Joi.number().default(0),
      total6s: Joi.number().default(0),
      totalCenturies: Joi.number().default(0),
      total50s: Joi.number().default(0),
      total20s: Joi.number().default(0),
      total30s: Joi.number().default(0),
      total40s: Joi.number().default(0),
      battingAverage: Joi.number().default(0)
    }),
    bowling: Joi.object({
      totalOvers: Joi.number().default(0),
      totalWides: Joi.number().default(0),
      totalRuns: Joi.number().default(0),
      totalNoBalls: Joi.number().default(0),
      totalWickets: Joi.number().default(0)
    }),
    fielding: Joi.object({
      totalCatches: Joi.number().default(0),
      totalRunOuts: Joi.number().default(0)
    })
  }).default({})
});
