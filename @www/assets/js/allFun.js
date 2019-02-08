//所有功能JS的家

const bikeDataArray = [];

var request = new XMLHttpRequest();

request.onload = function() {

    //回應狀態碼判斷  判斷是 2xx 的成功、3xx 的重新導向 或 4xx 客戶端錯誤
    if (request.status >= 200 && request.status < 400) {

        // Success!
        console.log(request.responseText);

        //把對方回傳的資料轉成JSON格式
        obj = JSON.parse(request.responseText);
        console.log(obj[0]);
        console.log(obj[0].Position);

        bikeDataArray.push(obj[0]);

        console.log(bikeDataArray);
    }
};

request.open('GET', 'http://e-traffic.taichung.gov.tw/DataAPI/api/YoubikeAllAPI', true);
request.send();



//=========================================================================//
Vue.component('station-name', {
    template: `
        <div class="stationArea">
            <h4>123</h4>
        <div>
    `,
});

var app = new Vue({
    el: '#app',
});