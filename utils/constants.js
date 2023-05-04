/* eslint-disable no-control-regex */
module.exports.ERROR_INCORRECT_DATA = 400;
module.exports.ERROR_UNAUTHORIZED = 401;
module.exports.ERROR_NOT_FOUND = 404;
module.exports.ERROR_CONFLICT = 409;
module.exports.ERROR_DEFAULT = 500;
module.exports.SECRET_KEY = 'super_key';
// eslint-disable-next-line prefer-regex-literals, no-useless-escape
module.exports.urlR = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;
