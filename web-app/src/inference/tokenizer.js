const stringToChars = (input) => {
    const symbols = [];
    for (const symbol of input) {
        symbols.push(symbol);
    }
    return symbols;
};

const getToken = (token_score_pair) => {
    return token_score_pair[0];
};

let vocab_model = JSON.parse(localStorage.getItem("vocab_model"));
let vocab = vocab_model ? vocab_model.map(getToken) : null;
let separator = "\u2581";
let tokenizer;

// [token, score, index]
// type OutputNode = [string[], number, number];

class TrieNode {
    constructor(key) {
        this.key = key;
        this.parent = null;
        this.children = {};
        this.end = false;
    }

    /**
     * Traverse upwards through the trie to construct the token.
     */
    getWord() {
        const output = [];
        let node = this;

        while (node !== null) {
            if (node.key !== null) {
                output.unshift(node.key);
            }
            node = node.parent;
        }

        return [output, this.score, this.index];
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode(null);
    }

    /**
     * Checks whether a node starts with ss.
     *
     * @param ss The prefix.
     * @param node The node currently being considered.
     * @param arr An array of the matching tokens uncovered so far.
     */
    findAllCommonPrefixes(ss, node, arr) {
        if (node.end) {
            const word = node.getWord();
            if (ss.slice(0, word[0].length).join("") === word[0].join("")) {
                arr.unshift(word);
            }
        }

        for (const child in node.children) {
            this.findAllCommonPrefixes(ss, node.children[child], arr);
        }
    }

    /**
     * Inserts a token into the trie.
     */
    insert(word, score, index) {
        let node = this.root;

        const symbols = stringToChars(word);

        for (let i = 0; i < symbols.length; i++) {
            if (!node.children[symbols[i]]) {
                node.children[symbols[i]] = new TrieNode(symbols[i]);
                node.children[symbols[i]].parent = node;
            }

            node = node.children[symbols[i]];

            if (i === symbols.length - 1) {
                node.end = true;
                node.score = score;
                node.index = index;
            }
        }
    }

    /**
     * Returns an array of all tokens starting with ss.
     *
     * @param ss The prefix to match on.
     */
    commonPrefixSearch(ss) {
        const node = this.root.children[ss[0]];
        const output = [];
        if (node) {
            this.findAllCommonPrefixes(ss, node, output);
        } else {
            output.push([[ss[0]], 0, 0]); // unknown token
        }
        return output;
    }
}

function processInput(str) {
    const normalized = str.normalize("NFKC");
    return separator + normalized.replace(/ /g, separator);
}

// type Vocabulary = Array<[string, number]>;

// type Score = {
//   key: string[],
//   score: number,
//   index: number
// };

class SentencePieceTokenizer {
    constructor(Vocabulary) {
        this.vocabulary = Vocabulary;
        this.trie = new Trie();

        for (let i = 0; i < this.vocabulary.length; i++) {
            this.trie.insert(this.vocabulary[i][0], this.vocabulary[i][1], i);
        }
    }

    encode(input) {
        const nodes = [];
        const words = [];
        const best = [];

        input = processInput(input);

        const symbols = stringToChars(input);

        for (let i = 0; i <= symbols.length; i++) {
            nodes.push({});
            words.push(0);
            best.push(0);
        }

        // Construct the lattice.
        for (let i = 0; i < symbols.length; i++) {
            const matches = this.trie.commonPrefixSearch(symbols.slice(i));

            for (let j = 0; j < matches.length; j++) {
                const piece = matches[j];
                const obj = { key: piece[0], score: piece[1], index: piece[2] };

                const endPos = piece[0].length;
                if (nodes[i + endPos][i] == null) {
                    nodes[i + endPos][i] = [];
                }

                nodes[i + endPos][i].push(obj);
            }
        }

        for (let endPos = 0; endPos <= symbols.length; endPos++) {
            for (const startPos in nodes[endPos]) {
                const arr = nodes[endPos][startPos];

                for (let j = 0; j < arr.length; j++) {
                    const word = arr[j];
                    const score = word.score + best[endPos - word.key.length];

                    if (best[endPos] === 0 || score >= best[endPos]) {
                        best[endPos] = score;
                        words[endPos] = arr[j].index;
                    }
                }
            }
        }

        const results = [];

        // Backward pass.
        let iter = words.length - 1;
        while (iter > 0) {
            results.push(words[iter]);
            iter -= this.vocabulary[words[iter]][0].length;
        }

        // Merge consecutive unks.
        const merged = [];
        let isPreviousUnk = false;
        for (let i = 0; i < results.length; i++) {
            const id = results[i];
            if (!(isPreviousUnk && id === 0)) {
                merged.push(id);
            }

            isPreviousUnk = id === 0;
        }

        return merged.reverse();
    }
}

if (vocab === null || vocab_model === null) {
    fetch("model/tokenizer/vocab_model.json")
        .then((result) => result.json())
        .then((output) => {
            localStorage.setItem("vocab_model", JSON.stringify(output));
            vocab_model = output;
            vocab = output.map(getToken);
            tokenizer = new SentencePieceTokenizer(vocab_model);
        })
        .catch((err) => console.error(err));
} else {
    tokenizer = new SentencePieceTokenizer(vocab_model);
}

// Wow, finally writing some useful functions
function detokenize(input_ids) {
    if (!input_ids) {
        return "";
    }
    let [start, end] = [0, input_ids.length];
    if (input_ids[0] === 0) {
        start = 1;
    }
    if (input_ids[input_ids.length - 1] === 1) {
        end = -1;
    }
    return input_ids
        .slice(start, end)
        .map((token) => vocab[token])
        .join("")
        .replaceAll("▁", " ")
        .trim();
}

// yay, boilerplate becasue I don't want to spend any effort rn
function tokenize(text) {
    let encoded = tokenizer.encode(text);
    encoded.push(1);
    return encoded;
}

export { tokenize, detokenize };
