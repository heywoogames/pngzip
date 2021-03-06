
const fs = require("fs");
var path = require('path');
const child = require('child_process')
const PNGInfo = require('png-info');

// 获取目录下的所有js文件
const jsFiles = [];

let g_ignore = [];

/**
 * 文件遍历方法
 * @param filePath 需要遍历的文件路径
 */
 function getFiles(filePath) {

    let files = fs.readdirSync( filePath );
    //console.log( files );
    files.forEach(function(filename) {
        //获取当前文件的绝对路径
        var filedir = path.join(filePath, filename);
        //根据文件路径获取文件信息，返回一个fs.Stats对象
        let stats = fs.statSync( filedir );
        var isFile = stats.isFile(); //是文件
        var isDir = stats.isDirectory(); //是文件夹
        if (isFile) {
            let pathT = path.parse( filename );
            let ig = false;
            if( g_ignore.length > 0 ) {
                for(let it of g_ignore) {
                    if( pathT.name.startsWith(it) ) {
                        ig = true;
                        break;
                    }
                }
            }
            
            if( pathT.ext === '.png' && ig===false ) {
                jsFiles.push( `${filePath}/${filename}` );
            }
        }
        if (isDir) {
            getFiles(filedir); //递归，如果是文件夹，就继续遍历该文件夹下面的文件
        }
    });
}

const args = process.argv.slice(2);
console.log(args);
let handlePath = '';
if( args.length > 0 ) {
    if( fs.existsSync( args[0] ) === true ) {
        handlePath = args[0];
    } else {
        console.error('路径错误', );
    }

    if( args.length > 1 ) {
        for(let i = 1; i<args.length;i++){
            let a = args[i].split('=');
            if(a.length=== 2){
                console.log(a);
                switch(a[0]){
                    case '-e':
                    {
                        g_ignore = a[1].split(',');
                    }break;
                }
            }

        }
    }
}


if( handlePath.length > 0 ) {
    getFiles(handlePath);

    let chkSize = 4 * 1024;
    for( let it of jsFiles )
    {
        let stats = fs.statSync( it );
        let imgInfo = fs.readFileSync(it);

        let pngInfo = null;
        try{
            pngInfo = new PNGInfo(imgInfo);
        }catch(err){
            continue;
        }
        
        let bitDepth = pngInfo.chunks.IHDR.chunkData.readUint8(8);
        let colorType = pngInfo.chunks.IHDR.chunkData.readUint8(9);
        let cT = 8;
        
        if(bitDepth === 8 && colorType === 3) {
            cT = 8;
        } else if(bitDepth === 8 && colorType === 2) {
            cT = 24;
        } else if(bitDepth === 8 && colorType === 6) {
            cT = 32;
        }

        if( cT > 8 ) {
            if( (stats.size >= chkSize) ) {
                console.log( `--- convert ${cT} ${it}`);
                child.execSync(`pngquant ${it} --ext .png --force`)
            }
        }
    }
}






