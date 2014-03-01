var request = require("request");

/*
 * GET home page.
 */

// rendering format:
// res.render(page, { message: 'Login', navig: page});

render = function(res, data){
    res.render(data.navig, data);
}

exports.generator = function(req, res){
    render(res, {navig: 'generator'});
};

exports.templates = function(req, res){
    render(res, {navig: 'templates'});
};

exports.data = function(req, res){
    render(res, {navig: 'data'});
};

exports.home = function(req, res){
    render(res, {navig: 'home'});
};

