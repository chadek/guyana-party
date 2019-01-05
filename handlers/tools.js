/* Tools for controllers */

exports.getPagedItems = async (model, page, limit, find, projection, sort) => {
  page = parseInt(page)
  limit = parseInt(limit)
  if (isNaN(page) || isNaN(limit)) {
    return {
      isErrorPage: true,
      error: 'page and limit parameters must be integers'
    }
  }
  const skip = page * limit - limit
  const itemsPromise = model
    .find(find, projection)
    .skip(skip)
    .limit(limit)
    .sort(sort)
  const [items, count] = await Promise.all([itemsPromise, model.count(find)])
  return {
    items,
    page,
    pages: Math.ceil(count / limit),
    count,
    limit,
    isErrorPage: !items.length && skip
  }
}

exports.confirmOwner = function (model, user) {
  if (!user || !model.author.equals(user._id)) {
    throw Error('Vous ne pouvez pas effectuer cet action !')
  }
}

exports.asyncForEach = async function (array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}
