//所有功能JS的家
Vue.config.devtools = true; //这步很重要


/*
新北市Youbike API
sno(站點代號)、
sna(中文場站名稱)、
tot(場站總停車格)、
sbi(可借車位數)、
sarea(中文場站區域)、
mday(資料更新時間)、
lat(緯度)、
lng(經度)、
ar(中文地址)、
sareaen(英文場站區域)、
snaen(英文場站名稱)、
aren(英文地址)、
bemp(可還空位數)、
act(場站是否暫停營運)
*/

var startVue = new Vue({
    el: '#app',
    data: {
        bikeDataArray: [],  //顯示的陣列
        dataFile: [],       //放所有筆數的陣列
        count: 0,           //現在數
        maxCount: '',       //最大數
        showNum: 10,        //想顯示的筆數(預設10筆),
        numInput: '',
        prev: 'prev',
        next: 'next',
    },
    methods: {
        callAjax: function(){
            var obj = '';
            var request = new XMLHttpRequest();

            request.addEventListener("load", function(){
                //回應狀態碼判斷  判斷是 2xx 的成功、3xx 的重新導向 或 4xx 客戶端錯誤
                if (request.status >= 200 && request.status < 400) {

                    // Success!
                    // console.log(request.responseText);

                    //這裡的 this 等於 XMLHttpRequest
                    //console.log(this); == XMLHttpRequest

                    //把對方回傳的資料轉成JSON格式
                    obj = JSON.parse(request.responseText);

                    startVue.dataFile = obj.result.results; //將取得的資料放入陣列

                    if ( startVue.count == 0 ) {
                        startVue.bikeDataArray = obj.result.results.slice(0, 10); //成功讀取後 先秀10筆資料
                        startVue.maxCount = Math.floor( obj.result.count / 10 );
                    }
                }
            });

            request.open('GET', 'https://data.ntpc.gov.tw/api/v1/rest/datastore/382000000A-000352-001', true);
            request.send();
        },
        timerAjax: function(){

            var _this = this;

            setInterval(function(){
                _this.callAjax();
            }, 100000);
        },
        changeShowNum: function(){
            
            if ( this.$refs.numInput.value == '' ) {
                this.showNum = 0;
            }else {
                this.showNum = parseInt( this.$refs.numInput.value );
            }

            this.maxCount = Math.floor( this.dataFile.length / this.showNum );

            this.changeDataEvent();
        },
        changeDataEvent: function(){
            //動態切換事件
            // this.bikeDataArray = this.dataFile.slice(10, 20);

            // `event` 是原生 DOM 事件
            if ( event.target.control == 'prev' && this.count > 0 ) {
                this.count -= 1;
            }
            if ( event.target.control == 'next' && this.maxCount > this.count ) {
                this.count += 1;
            }

            var head = (this.count * this.showNum),
                foot = (this.count * this.showNum) + this.showNum;

            this.bikeDataArray = this.dataFile.slice(head, foot);
        }
    },
    mounted(){
        this.callAjax();

        this.timerAjax();
    }
});

