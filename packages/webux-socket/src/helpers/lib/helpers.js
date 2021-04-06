/**
 * File: helpers.js
 * Author: Tommy Gingras
 * Date: 2019-05-25
 * License: All rights reserved Studio Webux S.E.N.C 2015-Present
 */

/**
 * this function takes a text and return the first letter in upper case.
 * @param {String} text mandatory
 * @return {String} return the string with the first letter modified to be Uppercased
 */
function FirstLetterCaps(text) {
  if (text) {
    return text[0].toUpperCase() + text.substring(1);
  }
  return text;
}

module.exports = {
  FirstLetterCaps,
};
