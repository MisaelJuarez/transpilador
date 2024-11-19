const sintaxis = {
    "let" : "",
    "const" : "",
    "if": "if",
    "console.log": "echo",
    "alert": "echo",
    "document.write": "echo",
    "{": "{",
    "}": "}",
    "(": "(",
    ")": ")",
    "||": "or",
    "&&": "and",
    "while": "while",
    "switch": "switch",
    "for": "for",
    "function": "function",
    "class": "class",
    "new": "new"
};

const convertir_lenguaje = (texto) => {
    let codigojs = [], codigophp = [], resultado="", nombresVariable = [];
    
    codigojs = texto.split('\n');

    codigojs.map(e => {
        for (const palabra in sintaxis) {
            if (e.includes(palabra)) {
                if (e.match(/\b(let|const)\s+(\w+)\s*=\s*\(\)\s*=>\s*\{/g)) {
                    codigophp.push(e.replaceAll(/\b(let|const)\s+(\w+)\s*=\s*\(\)\s*=>\s*\{/g,'function $2 () {'));
                    break;
                }else if (e.match(/\b(let|const)\s+(\w+)/g)) {
                    codigophp.push(e.replaceAll(/\b(let|const)\s+(\w+)/g,(match,variable,nombre) => {
                        nombresVariable.push(nombre);
                        return `${nombre}`;
                    }));
                    break;
                }else if (e.match(/(\w+)\(\)\{/)) {
                    codigophp.push(e.replaceAll(/(\w+)\(\)\{/g,'function $1(){'));
                    break;
                }else if(e.match(/^(?!console)(\w+)\.(?!log\(\))(\w+)(\(\))?/)){
                    codigophp.push(e.replaceAll('.','->'));
                    break;
                }else {
                    codigophp.push(e.replaceAll(palabra, sintaxis[palabra]));
                    break;
                }
            }
        }
    });

    codigophp.map(e => resultado += e+"\n");

    if (resultado) {
        if (nombresVariable) {
            nombresVariable.map(e => resultado = resultado.replaceAll(e,`$${e}`));
        }
        return `<?php\n${resultado}?>`;
    }else {
        return "Ingresa codigo javascript";
    }
}

document.getElementById('limpiar').addEventListener('click', () => location.reload());

document.getElementById('convertir').addEventListener('click', () => {
    document.getElementById('lenguaje-php').textContent = convertir_lenguaje(document.getElementById('lenguaje-js').value);
});

document.getElementById('copiar').addEventListener('click', () => {
    navigator.clipboard.writeText(document.getElementById('lenguaje-php').value);
    document.getElementById('copiar').textContent = "copiado";
});