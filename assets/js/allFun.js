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


Vue.component('check-box-area', {
    data(){
        return {
            checkNames: [],
            ids: [
                {
                    id: 'sno',
                    text: '站點代號'
                },
                {
                    id: 'sna',
                    text: '中文場站名稱'
                },
                {
                    id: 'tot',
                    text: '場站總停車格'
                },
                {
                    id: 'sbi',
                    text: '可借車位數'
                },
                {
                    id: 'sarea',
                    text: '中文場站區域'
                },
                {
                    id: 'ar',
                    text: '中文地址'
                },
                {
                    id: 'sareaen',
                    text: '英文場站區域'
                },
                {
                    id: 'snaen',
                    text: '英文場站名稱'
                },
                {
                    id: 'aren',
                    text: '英文地址'
                },
                {
                    id: 'bemp',
                    text: '可還空位數'
                },
                {
                    id: 'act',
                    text: '場站是否暫停營運'
                }
            ]
        }
    },
    methods: {
        inputCheck: function(){
            // console.log(event.target.value);

            var name  = '[data-name="'+ event.target.value +'"]',
                named = document.querySelectorAll(name);

            var etValue = event.target.value;

            for (var index = 0; index < startVue.filed.length; index++) {
                if ( startVue.filed[index] === etValue ) {

                    startVue.filed.splice(index, 1);
                    for (var index = 0; index < named.length; index++) {
                        named[index].style.display = "none";
                    }
                    return
                }else if ( index + 1 == startVue.filed.length && startVue.filed[index] !== etValue ) {

                    startVue.filed.push( etValue );
                    for (var index = 0; index < named.length; index++) {
                        named[index].style.display = "block";
                    }
                }
            }
        }
    },
    template: '<ul><li v-for="list in ids"><input type="checkbox" :value="list.id" v-model="checkNames" @change="inputCheck()">{{list.text}}</li></ul>',
});


var startVue = new Vue({
    el: '#app',
    data: {
        bikeDataArray: [],  //顯示的陣列
        dataFile: [],       //放所有筆數的陣列
        dataFileBox: [],    //所有筆數的儲藏處
        count: 0,           //現在數
        maxCount: '',       //最大數
        showNum: 10,        //想顯示的筆數(預設10筆),
        filed: ['sna','sbi','bemp','tot'],     //顯示的欄位(預設sna可以看到)
        numInput: '',
        prev: 'prev',
        next: 'next',
        area: [
            '全區域','板橋區','三重區','中和區','新莊區','永和區',
            '新店區','土城區','蘆洲區','樹林區','汐止區','三峽區',
            '淡水區','鶯歌區','五股區','泰山區','林口區','瑞芳區',
            '深坑區','石碇區','坪林區','三芝區','石門區','八里區',
            '平溪區','雙溪區','貢寮區','金山區','萬里區','烏來區',
        ]
    },
    methods: {
        callAjax: function(){
            var obj = '';

            axios
            .get('https://script.google.com/macros/s/AKfycbxs3QX-GGwWZiGEloxDiuM81fu6IXidHesQEZaGinQ7YEbMmf0/exec?url=data.ntpc.gov.tw/api/v1/rest/datastore/382000000A-000352-001')
            .then(function (response) {
                // handle success
                // console.log(response);

                obj = response.data;

                startVue.dataFileBox = obj.result.records;
                startVue.dataFile    = startVue.dataFileBox;

                if ( startVue.count == 0 ) {
                    startVue.bikeDataArray = startVue.dataFileBox.slice(0, 10);
                    startVue.maxCount = Math.floor( obj.result.total / 10 );

                    //對預設顯示的欄位所對應的checkbox打勾
                    var dRight = document.querySelector('.dRight'),
                        li     = dRight.querySelectorAll('li');

                    for (let index = 0; index < startVue.filed.length; index++) {
                        dRight.querySelectorAll('li input[value="'+ startVue.filed[index] +'"]')[0].checked = true;
                    }
                }

                setTimeout(function(){
                    startVue.showFiledEvent();
                }, 0);
            });
        },
        timerAjax: function(){

            var _this = this;

            setInterval(function(){
                _this.callAjax();
            }, 120000);
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

            setTimeout(function(){
                startVue.showFiledEvent();
            }, 0);
        },
        selectDataEvent: function(){
            var tempArray = [],
                sarea     = '',
                value     = this.$refs.selectValue.value;

            if ( value == '全區域' ) {
                this.dataFile = this.dataFileBox;
                this.changeDataEvent();
            }else {
                this.dataFileBox.forEach(function(currentValue, index, arr){
                    sarea = currentValue.sarea;
    
                    if ( sarea == value ) {
                        tempArray.push(arr[index]);
                    }
                });
    
                this.dataFile = tempArray;
                this.changeShowNum();
            }
        },
        showFiledEvent: function(){
            //預設顯示欄位事件
            for (var index = 0; index < startVue.filed.length; index++) {
                var dataName = startVue.filed[index];

                var name  = '[data-name="'+ dataName +'"]',
                    named = document.querySelectorAll( name );

                for (var index2 = 0; index2 < named.length; index2++) {
                    named[index2].style.display = "block";
                }
            }
        }
    },
    mounted(){
        this.callAjax();

        this.timerAjax();
    }
});

