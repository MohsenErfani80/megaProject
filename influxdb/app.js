const express = require('express');
const { InfluxDB, Point } = require('@influxdata/influxdb-client');

const app = express();
const port = 3001;
app.use(express.json());

// تنظیمات InfluxDB
const token = 't3jC-E5Pr8ruv9PlCFmDIduK5fcSUQUlMnhDTIV4AorGHk5qjMSNTikFZnpm_-ktK5KW6DcTVpsxW0y8nENfdQ==';  // توکنی که از InfluxDB ایجاد کرده‌اید
const org = 'my-org';  // نام سازمان
const bucket = 'my-bcket';  // نام بانک اطلاعاتی
const url = 'http://influxdb:8086';


const client = new InfluxDB({ url, token });
const writeApi = client.getWriteApi(org, bucket, 'ns');
const queryApi = client.getQueryApi(org);

// مسیر POST برای نوشتن داده در InfluxDB
app.post('/write', async (req, res) => {
    try {
        const { tag, value } = req.body;  // دریافت تگ و مقدار از بدنه درخواست

        // ایجاد یک نقطه (Point) برای نوشتن داده‌ها
        const point = new Point('sensor_data')
            .tag('tag', tag)  // اضافه کردن تگ
            .floatField('value', value);  // اضافه کردن مقدار (field)

        // نوشتن داده‌ها در InfluxDB
        writeApi.writePoint(point);
        await writeApi.flush();  // منتظر می‌ماند تا داده‌ها نوشته شوند

        res.status(200).json({ message: 'Data written to InfluxDB' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// مسیر GET برای خواندن داده از InfluxDB
app.get('/read', async (req, res) => {
    try {
        const fluxQuery = `from(bucket: "${bucket}") |> range(start: -1h) |> filter(fn: (r) => r._measurement == "sensor_data")`;
        const result = [];

        for await (const { values, tableMeta } of queryApi.iterateRows(fluxQuery)) {
            result.push(tableMeta.toObject(values));
        }

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/read/filter', async (req, res) => {
    try {
        const start = req.headers['start'];
        const stop = req.headers['stop'];
        const tag = req.headers['tag'];
        console.log(start , stop , tag);
        

        if (!start || !stop || !tag) {
            return res.status(400).json({ error: "هدرهای 'start', 'stop' و 'tag' الزامی هستند." });
        }

        const fluxQuery = `
            from(bucket: "${bucket}")
            |> range(start: ${start}, stop: ${stop})
            |> filter(fn: (r) => r._measurement == "sensor_data" and r.tag == "${tag}")
        `;

        const result = [];

        for await (const { values, tableMeta } of queryApi.iterateRows(fluxQuery)) {
            result.push(tableMeta.toObject(values));
        }

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
