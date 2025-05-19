import Joi from 'joi';

export const tournamentSchema = Joi.object({
  name: Joi.string().required(),
  numberOfTeams: Joi.number().min(2).required(),
  playersEachTeam: Joi.number().min(1).required(),
  amountPerTeam: Joi.number().min(0).required()
});