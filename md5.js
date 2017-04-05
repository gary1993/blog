module.exports = function(content){
    var crypto = require('crypto');
    var md5 = crypto.createHash('md5');
    md5.update(content);
    return md5.digest('hex');
}