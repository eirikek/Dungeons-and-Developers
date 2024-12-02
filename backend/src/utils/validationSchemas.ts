import Joi from 'joi';

export const monsterValidationSchema = Joi.object({
  name: Joi.string().required(),
  size: Joi.string().required(),
  type: Joi.string().required(),
  alignment: Joi.string().required(),
  hit_points: Joi.number().required(),
  image: Joi.string().base64().allow(null).optional(),
});

export const equipmentValidationSchema = Joi.object({
  index: Joi.string().required(),
  name: Joi.string().required(),
  category: Joi.string().required(),
  value: Joi.number().required(),
});

export const classesValidationSchema = Joi.object({
  index: Joi.string().required(),
  name: Joi.string().required(),
  hit_die: Joi.number().required(),
  skills: Joi.array().items(Joi.string().default([])),
});

export const raceValidationSchema = Joi.object({
  index: Joi.string().required(),
  name: Joi.string().required(),
  speed: Joi.number().required(),
  alignment: Joi.string().required(),
  size: Joi.string().required(),
  size_description: Joi.string().required(),
});

export const abilityScoreValidationSchema = Joi.object({
  index: Joi.string().required(),
  name: Joi.string().required(),
  skills: Joi.array().items(Joi.string()).default([]),
  score: Joi.number().integer().default(0),
});
