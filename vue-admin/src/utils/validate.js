//过滤特殊字符


export function stripscript(s){
    var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&mdash;—|{}【】‘；：”“'。，、？%_+]")
    var rs = "";
    for (var i = 0; i<s.length;i++){
        rs = rs+s.substr(i,1).replace(pattern,'');
    }
    return rs;
}
