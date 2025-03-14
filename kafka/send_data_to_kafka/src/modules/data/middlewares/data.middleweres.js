const transforms = require("../../../utilities/transform");

module.exports = new (class dataMiddlewares {
    validateData(req, res, next) {
        const { ts, name, value } = req.body;
        console.log(req.body)
        if (!ts || typeof ts !== 'number') {
            return transforms.invalidData(res, "زمان را به صورت عددی وارد کنید");
        }

        if (!name || typeof name !== 'string') {
            return transforms.invalidData(res, "نام را به صورت رشته وارد کنید");
        }

        if (!value || isNaN(parseFloat(value))) {
            return transforms.invalidData(res, "مقدار را به صورت عددی وارد کنید");
        }

        req.processedData = {
            ts: ts,
            name: name,
            value: parseFloat(value)
        };
        console.log('hy')
        next();
    }
})();