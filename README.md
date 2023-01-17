# getFileTypeFromArrayBuffer

### Purpose:
Determine the file type of 'pdf,xls,xlsx,doc,docx,ppt,pptx' according to the file arraybuffer achieved by js. File suffix or file name is not required. Further more, it can avoid wrong judgment by the falsy changes of file suffix. 

用途：
通过arraybuffer格式的文件流判断文件类型。类型范围是‘pdf,xls,xlsx,doc,docx,ppt,pptx'’中的一种。无需后端开发同事传递给你文件名称。同时它可以防止由于文件后缀名被非法更改导致的判断错误。

### Usage: 
Step1. Install
```
 $ npm install --save @yiiran/get-file-type  
```

Step2. Get arraybuffer file data  

You may often get it in the following  circumstance：  
输入的arraybuffer数据通常在以下场景中得到：
```
import getFileTypeFromArrayBuffer from '@yiiran/get-file-type';

let req = new XMLHttpRequest();
req.open("GET", "http://someFileUrl");
req.responseType = "arraybuffer";  //arraybuffer
req.onload = function (e) {
    let fileType = getFileTypeFromArrayBuffer(req.response);
    console.log('fileType', fileType)
};
req.send();
```

### Output:
One of  'pdf',' xlsx', 'xls', 'docx', 'doc', 'pptx','ppt', 'file2003', 'file2007', 'other'.

'file2003' meas the file belongs to the versions under Microsoft Office 2007 standard but dosen't belong to any kind of  'xls','doc','ppt'.  
'file2007' meas the file belongs to the version of Microsoft Office 2007 standard but dosen't belong to any kind of  'xlsx','docx','pptx'.  
 'other' means matching failure.  

输出：以上十种字符串中的一种。  
‘file2003’代表该文件遵守的是Microsoft Office 2007标准之前的旧标准，但不属于'xls','doc','ppt'类型；  
‘file2007’代表该文件遵守Microsoft Office 2007新标准，但不属于'xlsx','docx','pptx'类型；  
如果结果为‘other’，说明未匹配成功以上任何一种类型。  

### Notes:
1.Don't transfer the original ArrayBuffer Type to TypedArray or DataView.    
2.Due to possible differences in a few file streams, it's possible to get result incorrectly. The util is recommended to use with other tools.    
说明：  
1.不要将原始的ArrayBuffer数据转化成类型化数组（Uint8Array等），或DataView视图。    
2.由于少数文件结构存在差异的可能，因此判断结果可能出现失误。建议结合其他判断方式共同使用，以增加保险。
