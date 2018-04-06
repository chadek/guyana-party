exports.getPagedItems = async (model, page, limit, find, projection, sort) => {
  page = parseInt(page);
  limit = parseInt(limit);
  if (!page || !limit) return { isErrorPage: true, error: "page and limit parameters must be integers" };
  const skip = page * limit - limit;
  const itemsPromise = model.find(find, projection)
    .skip(skip)
    .limit(limit)
    .sort(sort);
  const [items, count] = await Promise.all([itemsPromise, model.count(find)]);
  return {
    items,
    page,
    pages: Math.ceil(count / limit),
    count,
    isErrorPage: !items.length && skip
  };
};
