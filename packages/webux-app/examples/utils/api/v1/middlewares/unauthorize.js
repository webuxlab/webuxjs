export default (req, res, next) => {
  console.log("Check if you are authorized ...");
  return next();
};
