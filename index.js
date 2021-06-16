const http = require('http');
const fs = require('fs');
var requests = require("requests");

const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempVal, orgVal) => {

    let temperature = tempVal.replace("{%tempval%}", (orgVal.main.temp-273.15).toFixed(2));
    temperature = temperature.replace("{%tempmin%}", (orgVal.main.temp_min-273.15).toFixed(2));
    temperature = temperature.replace("{%tempmax%}", (orgVal.main.temp_max-273.15).toFixed(2));
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);

    return temperature;

}

const server = http.createServer((req, res) => {
    if(req.url == "/"){
        requests(
            'https://api.openweathermap.org/data/2.5/weather?q=Toronto&appid=b58a2bc7dfc2d4b6e251714287d28055'
        )
        .on('data', (chunk) => {
          const objData = JSON.parse(chunk);
          const arrData = [objData];
        //   console.log(arrData[0].main.temp - 273);
          const realTimeData = arrData
          .map((val) => replaceVal(homeFile, val)).join("");
          res.write(realTimeData);
        })

        .on('end', (err) => {
          if (err) return console.log('connection closed due to errors', err);
          res.end();
        });
    }
});

server.listen(8000, "127.0.0.1");