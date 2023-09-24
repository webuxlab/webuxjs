function securePath(startsWith, pathToVerify, log = console) {
  log.verbose('startsWith', startsWith);
  log.verbose('pathToVerify', pathToVerify);
  if (pathToVerify.startsWith(startsWith)) {
    log.verbose('Path is Valid');
    return true;
  }
  log.verbose('Path is Invalid');
  return false;
}

module.exports = {
  securePath,
};
