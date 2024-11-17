const helpers = require('handlebars');

// Este helper nos permite comparar 2 valores en la plantilla handlebars
helpers.registerHelper('ifCond', function (v1, operator, v2, options) {
    // Verifica si el operador es de tipo '=='
    if (operator === '==') {
        return v1 == v2 ? options.fn(this) : options.inverse(this);
    }
    // Verifica si el operador es de tipo '==='
    if (operator === '===') {
        return v1 === v2 ? options.fn(this) : options.inverse(this);
    }
    // Si no es ningún operador válido, no hace nada
    return options.inverse(this);
});

module.exports = helpers;

const Handlebars = require('handlebars');

module.exports = {
    eq: (a, b) => a === b
};

