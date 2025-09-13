/**
  * Define every responses which we going to 
  * use while building product CRUD. 
  */

const httpsStatus = require('http-status'); 

module.exports = { 
  /** 
    * successful response 
    * @param {Object<response>} res response object of express.js 
    * @param {Object} options options. 
    * @param {String} options.message message to be pass. 
    * @param {Any}   options.data data be send. 
    */

  ok: (res, options = { message: 'data found' }) => { 
    const opts = { statusCode: httpsStatus.status.OK, ...options }; 
    return res.status(httpsStatus.status.OK).send(opts); 
  }, 

  /** 
    * successful creation 
    * @param {Object<response>} res response object of express.js 
    * @param {Object} options options. 
    * @param {String} options.message message to be pass. 
    * @param {Any}   options.data data be send. 
    */

  created: (res, options = { message: 'data inserted' }) => { 
    const opts = { statusCode: httpsStatus.status.CREATED, ...options }; 
    return res.status(httpsStatus.status.CREATED).send(opts); 
  }, 

  /** 
    * Bad Request 
    * @param {Object<response>} res response object of express.js 
    * @param {Object} options options. 
    * @param {String} options.message message to be pass. 
    * @param {Any}   options.data data be send. 
    */

  badRequest: (res, options = { error: 'bad request' }) => { 
    const opts = { statusCode: httpsStatus.status.BAD_REQUEST, ...options }; 
    return res.status(httpsStatus.status.BAD_REQUEST).send(opts); 
  }, 

  /** 
    * No Data Found. 
    * @param {Object<response>} res response object of express.js 
    * @param {Object} options options. 
    * @param {String} options.message message to be pass. 
    * @param {Any}   options.data data be send. 
    */

  noData: (res, options = { error: 'no data found' }) => { 
    const opts = { statusCode: httpsStatus.status.NOT_FOUND, ...options }; 
    return res.status(httpsStatus.status.NOT_FOUND).send(opts); 
  }, 

  /** 
    * NO CONTENT 
    * @param {Object<response>} res response object of express.js 
    * @param {Object} options options. 
    * @param {String} options.message message to be pass. 
    * @param {Any}   options.data data be send. 
    */

  noContent: (res, options = { error: 'no content' }) => { 
    const opts = { statusCode: httpsStatus.status.NO_CONTENT, ...options }; 
    return res.status(httpsStatus.status.NO_CONTENT).send(opts); 
  }, 

  /** 
    * Unauthorized 
    * @param {Object<response>} res response object of express.js 
    * @param {Object} options options. 
    * @param {String} options.message message to be pass. 
    * @param {Any}   options.data data be send. 
    */

  unauthorized: (res, options = { error: 'Unauthorized' }) => { 
    const opts = { statusCode: httpsStatus.status.UNAUTHORIZED, ...options }; 
    return res.status(httpsStatus.status.UNAUTHORIZED).send(opts); 
  }, 

  /** 
    * Unprocessable Entity 
    * @param {Object<response>} res response object of express.js 
    * @param {Object} options options. 
    * @param {String} options.message message to be pass. 
    * @param {Any}   options.data data be send. 
    */
  unprocessableEntity: (res, options = { error: 'Unprocessable Entity' }) => {
    const opts = { statusCode: httpsStatus.status.UNPROCESSABLE_ENTITY, ...options }; 
    return res.status(httpsStatus.status.UNPROCESSABLE_ENTITY).send(opts); 
  }, 

  /** 
    * Unprocessable Entity 
    * @param {Object<response>} res response object of express.js 
    * @param {Object} options options. 
    * @param {String} options.message message to be pass. 
    * @param {Any}   options.data data be send. 
    */
  forbidden: (res, options = { error: 'Forbidden Entity' }) => {
    const opts = { statusCode: httpsStatus.status.FORBIDDEN, ...options }; 
    return res.status(httpsStatus.status.FORBIDDEN).send(opts); 
  }, 
}; 
