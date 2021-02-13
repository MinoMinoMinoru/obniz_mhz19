var Obniz = require("obniz");

var obniz;
obniz = new Obniz("xxxx-xxxx");

const { Mh_z19 } = require('./mh_z19');
const { TempClient } = require('./callTemp');
var request = require('request')

var mh_z19 = new Mh_z19(obniz);
var co2_value;

var tempClient = new TempClient();

async function storeData() {
    await sleep(180000)
    while (true) {
        await sleep(5000)

        let getData = await getTemp()
        let temp = await getData.temperature;
        let humid = await getData.humidity;
        let pressure = await getData.pressure;

        let lightSensor = await obniz.wired("Grove_LightSensor", {gnd:5, vcc:4, signal: 2});
        let lightValue = await lightSensor.getWait();

        co2_value = await mh_z19.read_co2_concentration();

        // sendDate(temp, humid, co2_value)
        let body = {
            "temp": temp,
            "humid": humid,
            "co2": co2_value,
            "pressure" : pressure,
            "light":lightValue
        }
        console.dir(body);
        sendDate(body)
        await sleep(600000)
    }
}

async function getTemp() {
    let result = await tempClient.getTemp()
    result = JSON.parse(result)
        // console.dir(result.temperature)
    return result
}

async function sleep(time) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, time);
    });
}

function sendDate(temp, humid, co2) {
    var options = {
        uri: "https://script.google.com/macros/s/AKfycbxzvMb943FEZuRG4WtZQTP8IPe0myOZz4zmzJTGeFrv9N2bpfrrCQnS/exec",
        headers: {
            "Content-type": "application/json",
        },
        json: {
            "temp": temp,
            "humid": humid,
            "co2": co2
        }
    };
    request.post(options, function(error, response, body) {});
}

function sendDate(body) {
    var options = {
        uri: "https://script.google.com/macros/s/AKfycbxzvMb943FEZuRG4WtZQTP8IPe0myOZz4zmzJTGeFrv9N2bpfrrCQnS/exec",
        headers: {
            "Content-type": "application/json",
        },
        json: body
    };
    request.post(options, function(error, response, body) {});
}

storeData()