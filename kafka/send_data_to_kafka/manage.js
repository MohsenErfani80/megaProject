const args = process.argv;
const fs = require('fs');
const path = require('path');

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const getModelFileText = () => {
    return  "const mongoose = require('mongoose');\n" +
        "const mongoosePaginate = require('mongoose-paginate-v2');\n" +
        "const Schema = mongoose.Schema;\n"+
        "const types = Schema.Types;\n" +
        "const AbstractSchema = require('../../../schema/abstract/abstract.schema');\n" +
        `const ${args[3]}Schema = new AbstractSchema(\n` +
        "    {\n" +
        "    }\n" +
        "); \n" +
    `module.exports = mongoose.model('${args[3]}', ${args[3]}Schema,'${args[3]}');`
}

const getRepositoryFileText = (name) => {
    return `
    const Models = require('../../models');
    module.exports = new class ${capitalizeFirstLetter(name)}Repository extends Models{
        async findOne(condition){
            return await this.models.${name}.findOne(condition);
        }
        
        async finById(id){
            return await this.models.${name}.findById(id);
        }
        
        async find(condition){
            return await this.models.${name}.find(condition);
        }
    
        async create(data){
            return await this.models.${name}.create(data);
        }
} 
    `
}


switch (args[2]){
    case 'create-module':
        const dir = path.join(__dirname, 'src', 'modules', args[3]);
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir, { recursive: true });
            fs.mkdirSync(path.join(dir, "controllers"), { recursive: true });
            fs.mkdirSync(path.join(dir, "models"), { recursive: true });
            fs.mkdirSync(path.join(dir, "repositories"), { recursive: true });
            fs.mkdirSync(path.join(dir, "routes"), { recursive: true });

            if(args[4] && args[4] === "create-js"){
                fs.writeFileSync(path.join(dir, "controllers", `${args[3]}.controller.js`), `module.exports = new class ${capitalizeFirstLetter(args[3])}Controller{\n\n}`, "utf8");
                fs.writeFileSync(path.join(dir, "models", `${args[3]}.model.js`), getModelFileText(args[3]), "utf8");
                fs.writeFileSync(path.join(dir, "repositories", `${args[3]}.repository.js`), getRepositoryFileText(args[3]), "utf8");
                fs.writeFileSync(path.join(dir, "routes", `${args[3]}.routes.js`), "", "utf8");
            }
        }

        break;
}

