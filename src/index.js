const formatMap = {
    'pdf': ['25', '50', '44', '46'],
    'file2003': ['d0', 'cf', '11', 'e0'],
    'file2007': ['50', '4b', '03', '04', '14', '00', '06', '00'],
}
//区分xlsx,pptx,docx三种格式的buffer码。通过每个文件末尾的关键词检索判断
const format2007Map = {
    xlsx: ['77', '6f', '72', '6b', '73', '68', '65', '65', '74', '73', '2f'],// 转换成ascii码的含义是 worksheets/
    docx: ['77', '6f', '72', '64', '2f'],// 转换成ascii码的含义是 word/
    pptx: ['70', '70', '74', '2f'],// 转换成ascii码的含义是 ppt/
}
//区分xls,ppt,doc三种格式的buffer码，xls从文件开头判断，其他两种从文件末尾判断
const pptFormatList = ['50', '6f', '77', '65', '72', '50', '6f', '69', '6e', '74', '20', '44', '6f', '63', '75', '6d', '65', '6e', '74'];// 转换成ascii码的含义是 PowerPoint Document
const format2003Map = {
    xls: ['4d', '69', '63', '72', '6f', '73', '6f', '66', '74', '20', '45', '78', '63', '65', '6c'],// 转换成ascii码的含义是 Microsoft Excel
    doc: ['4d', '69', '63', '72', '6f', '73', '6f', '66', '74', '20', '57', '6f', '72', '64'],// 转换成ascii码的含义是 Microsoft Word
    ppt: pptFormatList.join(',00,').split(',')
}
//判断文件类型
/**
 * 
 * @param {*} arr  ArrayBuffer 
 */
export default function getFileTypeFromArrayBuffer(arrayBuffer) {
    try {
        if (Object.prototype.toString.call(arrayBuffer) !== '[object ArrayBuffer]') {
            throw new TypeError("The provided value is not a valid ArrayBuffer type.")
        }
        let arr = new Uint8Array(arrayBuffer);
        let str_8 = getSliceArrTo16(arr, 0, 8).join('');
        //将数据转化成16进制，与各个格式模数对比
        //第一次匹配，只匹配arrayBuffer前八位数，得到大范围的模糊类型
        //console.log('str8', str_8)
        let result = '';
        //第一次匹配
        for (let type in formatMap) {
            let target = formatMap[type].join('');
            if (~str_8.indexOf(target)) { //相当于(str_8.indexOf(target) !== '-1')
                result = type;
                break;
            }
        }
        if (!result) {
            //未匹配，有可能是html格式的xls文件
            let arr_start_16 = getSliceArrTo16(arr, 50, 150);
            let xlsHtmlTarget = ['6f', '66', '66', '69', '63', '65', '3a', '65', '78', '63', '65', '6c']; // 转换成ascii码的含义是 office:excel
            //通过前50-150位置判断是否是xls
            if (~(arr_start_16.join('').indexOf(xlsHtmlTarget.join('')))) {
                return 'xls';
            }
            return 'other';
        }
        if (result == 'pdf') {
            return result;
        }
        if (result == 'file2007') {
            //默认是xlsx,pptx,docx三种格式中的一种，进行第二次匹配.如果未匹配到，结果仍然是file2007
            let arr_500_16 = getSliceArrTo16(arr, -500);
            for (let type in format2007Map) {
                let target = format2007Map[type];
                if (isListContainsTarget(target, arr_500_16)) {
                    result = type;
                    break;
                }
            }
            return result;
        }
        if (result == 'file2003') {
            let arr_end_16 = getSliceArrTo16(arr, -550, -440);
            for (let type in format2003Map) {
                let target = format2003Map[type];
                //通过倒数440-550位置判断是否是doc/ppt
                if (~(arr_end_16.join('').indexOf(target.join('')))) {
                    result = type;
                    break
                }
            }
            return result;
        }
        //未匹配成功
        return 'other';
    } catch (e) {
        console.log(e);
    }

}

//arr数组是否包含target数组
function isListContainsTarget(target, arr) {
    let i = 0;
    while (i < arr.length) {
        if (arr[i] == target[0]) {
            let temp = arr.slice(i, i + target.length);
            if (temp.join() === target.join()) {
                return true
            }
        }
        i++;
    }
}

//截取部分数组，并转化成16进制
function getSliceArrTo16(arr, start, end) {
    let newArr = arr.slice(start, end);
    return Array.prototype.map
        .call(newArr, (x) => ('00' + x.toString(16)).slice(-2));
}