
const models = require("../../models");
const { Kafka } = require('kafkajs');
const transforms = require("../../../utilities/transform");

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: [ 'kafka:9092'] // آدرس Kafka
});

const producer = kafka.producer();



const runProducer = async () => {
    try {
        await producer.connect();
        console.log("Kafka Producer متصل شد");
    } catch (error) {
        console.error("خطا در اتصال به Kafka:", error);
    }
};

runProducer();

module.exports = new (class dataRepository extends models {

    async findOne(condition) {
        return await this.models.connectionModel.findOne(condition);
    }

    sendToKafka = async ( res , data) => {
        try {
            await producer.connect();
            await producer.send({
                topic: "sensor-data", // نام تاپیک Kafka
                messages: [{ value: JSON.stringify(data) }],
            });
            
            return transforms.success(res, data, "اطلاعات با موفقیت داخل کافکا ثبت شد");
        } catch (error) {
            return transforms.internalServerError(res, "خطا در ثبت اطلاعات، لطفا مجدد تلاش کنید");
        } finally {
            await producer.disconnect();
        }
    };


})();
