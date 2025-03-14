const mongoose = require('mongoose');

function abstractSchema(fields){
    const schema = new mongoose.Schema(
{
        ...fields,
        is_deleted: {type: Boolean, default: false},
        deleted_date: {type: mongoose.Schema.Types.Number, required: false},
        created_at: {type: mongoose.Schema.Types.Number, required: false},
        updated_at: {type: mongoose.Schema.Types.Number, required: false},
        }
    );

    // schema.pre(/.*/, function() {
    //     this.findOne({isDeleted: false});
    // })

    schema.pre(/^find/, function (next) {
        this.where({ is_deleted: false });
        if(this.photo){
            this.populate('photo');
        }
        next();
    });
    //
    schema.pre(/^findOne/, function (next) {
        this.where({ is_deleted: false });
        if(this.photo){
            this.populate('photo');
        }
        next();
    });
    //
    //
    schema.pre(/^update/, function(next) {
        this.where({ is_deleted: false });
        next();
    });

    return schema;
}



module.exports = abstractSchema;