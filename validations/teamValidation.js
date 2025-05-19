import Joi from 'joi';
import JoiObjectId from 'joi-objectid';
Joi.objectId = JoiObjectId(Joi);

export const teamSchema = Joi.object({
    _id: Joi.string().required(),      // ✅ name is now _id
    owner: Joi.string().required(),
    players: Joi.array().items(Joi.objectId()),
    lock: Joi.boolean()
});
