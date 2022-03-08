#!/usr/bin/env node
module.exports = function compile(file) {
    let nontext = (file.match(/[\s\S]*?(?=^===$)/m) || [""]).join('');

    let setup = (nontext.match(/(?<!^#.*)[^#\s].+(?=\n*?)/gm) || [""]).join('\n\n');

    let text = '\n\nwrite(`' + (file.match(/(?<=^===$\n)[\s\S]*/m) || [""]).join('') + '`)';
    if (!nontext) return text;

    let declarations = nontext.match(/(?<=#define ).*?(?=\n)/g);
    if (declarations) {
        declarations = declarations.map(e => [e.slice(0, e.indexOf(' ')), e.slice(e.indexOf(' ') + 1)]);

        declarations = declarations.map(e => {
            if (e[0].includes('*') && e[0].length > 1)
                return [[e[0].substring(0, e[0].indexOf('*')).replaceAll(/[\s\S]/g, "[$&]"), e[0].substring(e[0].indexOf('*') + 1, e[0].length).replaceAll(/[\s\S]/g, "[$&]")], e[1]];
            else
                return e;
        });
        for (let i = 0; i < declarations.length; i++) {
            if (declarations[i][0] instanceof Array) {
                while (eval(`text.match(/${declarations[i][0][0]}[\\s\\S]*?${declarations[i][0][1]}/)`) != null) {
                    const args = eval(`text.match(/(?<=${declarations[i][0][0]})[\\s\\S]*?(?=${declarations[i][0][1]})/)`).join('');
                    text = eval(`text.replace(/${declarations[i][0][0]}[\\s\\S]*?${declarations[i][0][1]}/, "\`); \\n ${declarations[i][1].replaceAll("*", `${args.replaceAll(/\\(?=\S)/g, '\\\\').replaceAll('\n', ' ').replaceAll('"', '\\"').replaceAll("'", "\\'")}`)}\\nwrite(\`")`);
                }
            } else {
                text = text.replaceAll(declarations[i][0], "\`); \n" + declarations[i][1] + '\nwrite(\`');
            }
        }
    }
    return setup + text;
}
