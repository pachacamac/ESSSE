module.exports = function (content) {
return html`

<input id="searchbox" type="text" placeholder="search ...">
<div style="border: 1px solid silver; padding: 0 1em;" id="searchresults"></div>

<script type="module">
    import { articleEmbeddings } from '/assets/articleEmbeddings.js';
    import { pipeline } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers';
    const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');

    setTimeout(()=>{
        const index = document.getElementById('index');
        if(index) index.innerHTML = articleEmbeddings.map(r=>'<a href="'+r.href+'">'+r.name+'</a><div class="small-text">'+r.preview+'</div>').join('');
    }, 200);
    
    async function generateEmbedding(text){
        const output = await extractor([text], { pooling: 'mean', normalize: true });
        const embedding = Object.values(output.data);
        return embedding;
    }

    function debounce(callback, wait) {
        let timeoutId = null;
        return (...args) => {
            window.clearTimeout(timeoutId);
            timeoutId = window.setTimeout(() => {
            callback(...args);
            }, wait);
        };
    }
    function dotProduct(x, y) {
        let result = 0;
        for (let i = 0, l = Math.min(x.length, y.length); i < l; i += 1) {
            result += x[i] * y[i];
        }
        return result;
    }

    function normalize(x) {
        let result = 0;
        for (let i = 0, l = x.length; i < l; i += 1) {
            result += x[i]**2;
        }
        return Math.sqrt(result);
    }

    function cosineSimilarity(x, y) {
        return dotProduct(x, y) / (normalize(x) * normalize(y));
    }

    function roundN(num, n) {
        return Number(num.toFixed(n));
    }

    async function search(text, embeddings){
        const emb = await generateEmbedding(text);
        return embeddings.map(e=>{
            e.cosim = cosineSimilarity(emb, e.embedding);
            return e;
        }).sort((a,b)=>b.cosim-a.cosim).slice(0,5);
    }

    document.getElementById('searchbox').addEventListener('keyup', debounce((e)=>{
        search(e.target.value, articleEmbeddings).then(res => {
            const sr = document.getElementById('searchresults');
            sr.innerHTML = res.map(r => '<a href="'+r.href+'">'+r.name+'</a><div class="small-text">'+roundN(r.cosim,4)+' &mdash; '+r.preview+'</div>').join('');
        })
    }, 500));

</script>
`};