const transforms = require("../../../utilities/transform");
// const  Kafka = require("kafkajs");
const dataRepository = require("../repositories/data.repository");
// const producer = Kafka.producer();

// const sendToKafka = async (data) => {
//     try {
//         await producer.connect();
//         await producer.send({
//             topic: "sensor-data", // نام تاپیک Kafka
//             messages: [{ value: JSON.stringify(data) }],
//         });
//         return transforms.success(res, data, "اطلاعات با موفقیت داخل کافکا ثبت شد");
//     } catch (error) {
//         return transforms.internalServerError(res, "خطا در ثبت اطلاعات، لطفا مجدد تلاش کنید");
//     } finally {
//         await producer.disconnect();
//     }
// };

module.exports = new (class dataController {

insertData = async (req, res) => {
    const  connectionName  = req.params; 
    const { ts, name, value } = req.body; 
    
    try {
        const connetion = await dataRepository.findOne({ name : connectionName.connectionName });
        
        if (!connetion) {
            return await transforms.notFound(res, "هیچ کانکشنی با این نام یافت نشد");
        }
        const connectionId = connetion._id;
 

        // ساخت داده نهایی برای Kafka
        const taggedData = {
            ts,
            name,
            value,
            tag: connectionId, // اضافه کردن ID کانکشن به عنوان تگ
        };

        // ارسال داده به Kafka
        await dataRepository.sendToKafka(res, taggedData);

        // ارسال داده به influx
        const url = 'http://host.docker.internal:3001/write';
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({

                
                    "tag": taggedData.tag.toString(), 
                    "value": taggedData.value
                    

            })
        })
            .then(response => response.json())
            .then(data => console.log('Response:', data))
            .catch(error => console.error('Error:', error));


        return transforms.success(res, taggedData, "اطلاعات با موفقیت داخل کافکا ثبت شد");
    } catch (error) {
        console.log(error)

        return transforms.internalServerError(res, "خطا در ثبت اطلاعات، لطفا مجدد تلاش کنید");
    }
};



});
