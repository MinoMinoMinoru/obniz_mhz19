const { Mh_z19 } = require('./mh_z19');
const { TempClient } = require('./callTemp');
var request = require('request')

// Read environment variables from .env file
require('dotenv').config();

// initializing obniz
var Obniz = require("obniz");
const obnizID = process.env.OBNIZ_ID;
const gasEndpoint =  process.env.GAS_ENDPOINT;
var obniz = new Obniz(obnizID);

var mh_z19 = new Mh_z19(obniz);
var co2_value;

var tempClient = new TempClient();

async function storeData() {
    // we need 3 minutes for MH_Z19 to get first CO2 data
    await sleep(180000)
    while (true) {
        // we must to wait for MH_Z19 to get CO2 data
        await sleep(5000)

        // get sensor date form raspi
        let raspiData = await getRaspiData()
        let temp = await raspiData.temperature;
        let humid = await raspiData.humidity;
        let pressure = await raspiData.pressure;

        let lightSensor = await obniz.wired("Grove_LightSensor", {gnd:5, vcc:4, signal: 2});
        let lightValue = await lightSensor.getWait();

        co2_value = await mh_z19.read_co2_concentration();

        let body = {
            "temp": temp,
            "humid": humid,
            "co2": co2_value,
            "pressure" : pressure,
            "light":lightValue
        }

        console.dir(body);
        sendData(body)
        await sleep(600000)
    }
}

async function getRaspiData() {
    let result = await tempClient.getTemp()
    result = JSON.parse(result)
    return result
}

async function sleep(time) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, time);
    });
}

function sendData(body) {
    var options = {
        uri: gasEndpoint,
        headers: {
            "Content-type": "application/json",
        },
        json: body
    };
    request.post(options, function(error, response, body) {});
}

storeData()
