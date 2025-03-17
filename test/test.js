const axios = require('axios');

const apis = [
    "http://localhost:3002/data/v1/insert_data/connection_1742244990090",
    "http://localhost:3002/data/v1/insert_data/connection_1742245140510",
    "http://localhost:3002/data/v1/insert_data/connection_1742246819982",
    "http://localhost:3002/data/v1/insert_data/connection_1742246833677",
    "http://localhost:3002/data/v1/insert_data/connection_1742246844555",
    "http://localhost:3002/data/v1/insert_data/connection_1742246925867",
    "http://localhost:3002/data/v1/insert_data/connection_1742246926887",
    "http://localhost:3002/data/v1/insert_data/connection_1742246928148",
    "http://localhost:3002/data/v1/insert_data/connection_1742246931318",
    "http://localhost:3002/data/v1/insert_data/connection_1742246932614"
];

// تابع تولید نام تصادفی با حروف
function generateRandomName(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

// تابع برای تولید مقدار تصادفی
function generateRandomData() {
    return {
        ts: Date.now(), // تایم‌استمپ کنونی
        name: generateRandomName(8), // نام تصادفی شامل ۸ حرف
        value: (Math.random() * 100).toFixed(2) // مقدار تصادفی بین 0 تا 100
    };
}

// ارسال درخواست به یک API خاص
async function sendRequests(api) {
    const requests = Array.from({ length: 10 }, () =>
        axios.post(api, generateRandomData())
            .then(() => console.log(`Success: ${api}`))
            .catch(error => console.error(`Error (${api}):`, error.message))
    );

    await Promise.all(requests);
}

// ارسال درخواست‌ها فقط یک‌بار برای همه API‌ها
async function main() {
    await Promise.all(apis.map(api => sendRequests(api)));
    console.log("All requests sent successfully.");
}

// اجرای تابع اصلی
main();


































// const axios = require('axios');

// const apis = [
//     "http://localhost:3002/data/v1/insert_data/connection_1741949073244",
//     "http://localhost:3002/data/v1/insert_data/connection_1741950257656",
//     "http://localhost:3002/data/v1/insert_data/connection_1741956882462",
//     "http://localhost:3002/data/v1/insert_data/connection_1741956890567",
//     "http://localhost:3002/data/v1/insert_data/connection_1741956892090",
//     "http://localhost:3002/data/v1/insert_data/connection_1741956893285",
//     "http://localhost:3002/data/v1/insert_data/connection_1741956894558",
//     "http://localhost:3002/data/v1/insert_data/connection_1741956895550",
//     "http://localhost:3002/data/v1/insert_data/connection_1741956897307",
//     "http://localhost:3002/data/v1/insert_data/connection_1741956898204"
// ];

// // تابع تولید نام تصادفی با حروف
// function generateRandomName(length = 6) {
//     const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
//     return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
// }

// // تابع برای تولید مقدار تصادفی
// function generateRandomData() {
//     return {
//         ts: Date.now(), // تایم‌استمپ کنونی
//         name: generateRandomName(8), // نام تصادفی شامل ۸ حرف
//         value: (Math.random() * 100).toFixed(2) // مقدار تصادفی بین 0 تا 100
//     };
// }

// // ارسال درخواست به یک API خاص
// async function sendRequests(api) {
//     const requests = [];
    
//     // ساخت 10 درخواست به طور همزمان برای هر API
//     for (let i = 0; i < 10; i++) {
//         requests.push(
//             axios.post(api, generateRandomData())
//                 .then(response => console.log(`Success: ${api}`))
//                 .catch(error => console.error(`Error (${api}):`, error.message))
//         );
//     }

//     // اجرای همه درخواست‌ها به طور همزمان
//     await Promise.all(requests);
// }

// // اجرای درخواست‌ها برای همه API‌ها در هر ثانیه
// setInterval(() => {
//     apis.forEach(api => sendRequests(api));
// }, 1000);
