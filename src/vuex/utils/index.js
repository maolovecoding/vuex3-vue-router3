function forEachValue(modules, cb) {
  Object.keys(modules).forEach((key) => {
    cb(key, modules[key]);
  });
}
export {
  forEachValue
}