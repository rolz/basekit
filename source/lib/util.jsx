'use strict';

/*
 * SuperAgent: a light-weight progressive ajax API
 * http://visionmedia.github.io/superagent/
 */

module.exports = {
  setLogger() {
    /*
     * Logger setting
     * https://www.npmjs.com/package/js-logger
     */
    Logger.useDefaults();

    /*
     * Only debug if you have "debug=true" in query
     * https://www.npmjs.com/package/query-string
     */
    // if (qs.debug !== 'true') {
    //   Logger.setLevel(Logger.WARN);
    // }
    Logger.setLevel(Logger.DEBUG);
  }
}
