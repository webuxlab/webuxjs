/**
 * Retrieve the value of a named cookie
 * @param {String} name The cookie name
 * @return {Promise} Cookie value
 */
function getCookies(name) {
  return new Promise((resolve, reject) => {
    const value = window.$cookies.get(name);
    if (!value) {
      return reject(new Error("The key doesn't have a value"));
    }
    return resolve(value);
  });
}
/**
 * Set the Authentication cookies
 * @param {String} accessToken
 * @returns {VoidFunction}
 */
function setCookies(accessToken = null) {
  if (accessToken) {
    window.$cookies.set("accessToken", accessToken);
  }

  return;
}

export { getCookies, setCookies };
