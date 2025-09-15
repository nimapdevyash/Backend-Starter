
exports.create = async ({
  model,
  body,
  isBulk = false,
  transaction = null,
}) => {
  const options = transaction ? { transaction } : {};
  return isBulk
    ? await model.bulkCreate(body, options)
    : await model.create(body, options);
};

exports.findOne = async ({
  model,
  condition,
  include,
  attributes,
  raw = true,
  distinct = false,
  transaction = null
}) => {
  const fetchedRecord = await model.findOne({
    where: condition,
    ...(include && { include: include }),
    ...(attributes && { attributes: attributes }),
    ...(transaction && {transaction}),
    distinct,
    raw,
  });
  return fetchedRecord;
};

exports.update = async ({ model, condition, updatedBody, returning = false , individualHooks = true , transaction = null }) => {

  const updateRecord = await model.update(updatedBody, {
    where: condition,
    returning,
    individualHooks,
    ...(transaction && {transaction})
  });
  return updateRecord;
};

exports.destroy = async ({ model, condition, force = false }) => {
  const deletedRecord = await model.destroy({
    where: condition,
    force,
  });
  return deletedRecord;
};

exports.findAll = async ({
  model,
  condition,
  attributes,
  include,
  group,
  order,
  limit,
  offset,
  transaction,
  nested = true,
  raw = false,
  distinct = false,
  subQuery,
}) => {
  const fetchedRecord = await model.findAndCountAll({
    ...(condition && { where: condition }),
    ...(attributes && { attributes }),
    ...(include && { include }),
    ...(group && { group }),
    ...(order && { order }),
    ...(limit !== undefined && { limit }),
    ...(offset !== undefined && { offset }),
    ...(transaction && { transaction }),
    ...(!subQuery && subQuery === false ? { subQuery } : {}),
    distinct,
    raw,
    nested,
  });

  return fetchedRecord;
};

exports.findByPk = async ({
  model,
  id,
  condition,
  include,
  attributes,
  subQuery,
  raw = true,
}) => {
  const fetchedRecord = await model.findByPk(id, {
    ...(condition && { where: condition }),
    ...(include && { include: include }),
    ...(attributes && { attributes: attributes }),
    ...(!subQuery && subQuery === false ? { subQuery } : {}),
    raw,
  });
  return fetchedRecord;
};

exports.count = async ({ model, condition }) => {
  const count = await model.count({
    where: condition,
  });
  return count ? count : 0;
};