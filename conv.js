function roundN(num, n) {
    return Number(num.toFixed(n));
}

async function main(){
    const fs = require('fs');
    const path = require('path');
    
    let rawData = fs.readFileSync('data.json');
    let data = JSON.parse(rawData);
    
    const extractorModule = await import('@xenova/transformers');
    const extractor = await extractorModule.pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    
    const embeddings = [];

    const alphabet = '_abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-';

    for(let i=0;i<data.length;i++){
        const text = data[i];
        let name = text.split(/\W+/).slice(0, 6).join('_').toLowerCase();

        const output = await extractor([text], { pooling: 'mean', normalize: true });

        // Map a number between -1 and 1 to a number between 0 and 63
        const embedding = Object.values(output.data).map(e=>alphabet[Math.round((e + 1) * 31.5)]).join('');

        //const embedding = Object.values(output.data).map(e=>roundN(e,4)); // save some space

        embeddings.push({
            name,
            href: `/articles/${name}.html`,
            preview: text.slice(0,100)+'...',
            embedding
        });
        console.log(name)
        let filePath = path.join(__dirname, 'site', 'articles', `${name}.page.js`);
        let content = `const layout = require("../components/layout");\nmodule.exports = function () {return layout(html\`\n<p>${text}</p>\n\`)}\n`;
        fs.writeFileSync(filePath, content);
    }
    //function(){return    }
    fs.writeFileSync('site/assets/articleEmbeddings.js', 'export const articleEmbeddings = '+JSON.stringify(embeddings,null,2));
}

main();