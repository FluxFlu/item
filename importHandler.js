#!/usr/bin/env node
const fs = require('fs/promises');
module.exports = async function importHandler(file) {

    let nontext = (file.match(/[\s\S]*?(?=^===$)/m) || [""]).join('');

    let imports = nontext.match(/(?<=#include ).*?(?=\n)/g);

    let libImports = [];
    let localImports = [];


    for (let i in imports) {
        if (imports[i][0] == "<" && imports[i][imports[i].length - 1] == ">")
            libImports.push(imports[i].substring(1, imports[i].length - 1));
        else if (imports[i][0] == '"' && imports[i][imports[i].length - 1] == '"')
            localImports.push(imports[i].substring(1, imports[i].length - 1));
    }
    let finish = () => console.error("Failed to AWAIT.");
    function localImportHandler(i) {
        if (i < localImports.length) {
            fs.readFile(`./${localImports[i]}`, "utf-8").then((file) => {
                imports += `${file}\n\n`;
            }).then(() => {
                localImportHandler(i + 1);
            });
        } else {
            finish(imports);
        }
    }
    imports = "";
    function libImportHandler(i) {
        if (i < libImports.length) {
            fs.readFile(`${__dirname}/ITEMLib/${libImports[i]}`, "utf-8").then((file) => {
                imports += `${file}\n\n`;
            }).then(() => {
                libImportHandler(i + 1);
            });
        } else {
            localImportHandler(0);
        }
    }
    return new Promise(resolve => {
        finish = resolve;
        libImportHandler(0);
    });
}