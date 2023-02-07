new Vue({
    el: '#app',
    data: {
        currentStep: 1,
        bdstoken: localStorage.getItem('Blink_bdstoken'),
        savePath: '/',
        link: location.pathname.slice(1) + decodeURI(location.hash),
        raw_result: '',
        quickmode: localStorage.getItem('Quick_mode')
    },
    mounted() {
        if(this.quickmode){
            this.currentStep = 5
            this.submitLink()
        }
    },
    methods: {
        set_quickmode(value){
            localStorage.setItem("Quick_mode",value);
            this.quickmode = value
        },
        get_result() {
            let str = this.raw_result
            let error = JSON.parse(str);
            let errno = error.errno;
            let msg = '';
            switch (errno) {
                case 0:
                    msg = '秒传成功';
                    break;
                case -6:
                    msg = '认证失败';
                    break;
                case -8:
                    msg = '路径下存在同名文件/文件夹';
                    break;
                case 20:
                case -10:
                    msg = '网盘容量已满';
                    break;
                case -7:
                    msg = '转存路径含有非法字符';
                    break;
                case 404:
                case 31190:
                    msg = '秒传未生效';
                    break;
                default:
                    msg = '未知错误';
            }
            // return msg;
            alert(msg)
        },
        nextStep() {
            this.currentStep++
        },
        get_bdstoken() {
            if (this.bdstoken.length !== 32) {
                var json = JSON.parse(this.bdstoken);
                this.bdstoken = json.result.bdstoken;
            }
            this.nextStep()
        },
        submitLink() {
            let savePath = this.savePath;
            let bdstoken = this.bdstoken.trim();
            if (!(checkBdstoken(bdstoken) && checkPath(savePath))) return;
            if (savePath.charAt(savePath.length - 1) !== '/') savePath += '/';
            const data = DuParser.parse(this.link)
            if (!data.length) {
                alert('未检测到有效的秒传链接');
                return;
            }
            data.forEach(file => {
                saveFile2(
                    file.md5,
                    file.size,
                    savePath + file.path.replace(illegalPathPattern, "_")
                );
            });
            this.nextStep()
            console.log(this.currentStep)
        }
    }
})