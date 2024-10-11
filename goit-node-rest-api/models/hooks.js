export const handleSaveError = (error, data, next) => {
  const { name, code } = error;
  name === "MongoServerError" && code === 11000
    ? (error.status = 409)
    : (error.status = 400);
  next();
};

export const setUpdateSetting = function (next) {
  //Урок Модуль 3. REST API. MongoDB и Mongoose 50-55мин
  this.options.new = true;
  this.options.runValidators = true;
  next();
};
