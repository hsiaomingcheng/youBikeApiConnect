//所有功能JS的家


var startVue = new Vue({
    el: '#app',
    data: {
        bikeDataArray: [],
        dataFile: [],
        count: '',
        maxCount : '',

        prev: 'prev',
        next: 'next',
    },
    methods: {
        changeDataEvent(){
            //動態切換事件
            // this.bikeDataArray = this.dataFile.slice(10, 20);

            // `event` 是原生 DOM 事件
            if ( event.target.control == 'prev' && this.count > 0 ) {
                this.count -= 1;
            }
            if ( event.target.control == 'next' && this.maxCount > this.count ) {
                this.count += 1;
            }

            var head = (this.count * 10),
                foot = (this.count * 10) + 10;

            this.bikeDataArray = this.dataFile.slice(head, foot);
        }
    },
    mounted(){
        var obj = '';
        var request = new XMLHttpRequest();

        request.onload = function() {

            //回應狀態碼判斷  判斷是 2xx 的成功、3xx 的重新導向 或 4xx 客戶端錯誤
            if (request.status >= 200 && request.status < 400) {

                // Success!
                // console.log(request.responseText);

                //把對方回傳的資料轉成JSON格式
                obj = JSON.parse(request.responseText);

                startVue.bikeDataArray = obj.result.results.slice(0, 10); //成功讀取後 先秀10筆資料
                startVue.count    = 0; //指定初始count為0
                startVue.maxCount = Math.floor( obj.result.count / 10 );

                startVue.dataFile = obj.result.results; //將取得的資料放入陣列
            }
            console.log(obj);
        };

        // request.open('GET', 'http://e-traffic.taichung.gov.tw/DataAPI/api/YoubikeAllAPI', true);
        request.open('GET', 'https://data.taipei/opendata/datalist/apiAccess?scope=resourceAquire&rid=ddb80380-f1b3-4f8e-8016-7ed9cba571d5', true);
        request.send();
    }
});

