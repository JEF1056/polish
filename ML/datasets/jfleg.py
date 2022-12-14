import os
import re
import pandas as pd
root = "ML/datasets/jfleg"
dev = root + "/dev"
test = root + "/test"
splits = {
    "dev": [],
    "test": []
}

splits_orig = {
    "dev": open(os.path.join(dev, "dev.spellchecked.src"), "r").read().splitlines(),
    "test": open(os.path.join(test, "test.spellchecked.src"), "r").read().splitlines()
}

def cleanup(text):
    while "  " in text:
        text = text.replace("  ", " ")
    text = re.sub(r"\s([\.?>,!)\]\-+';:\"}])|\s(n't)", r"\1\2",text)
    return text.strip()

def format(path):
    for file in os.listdir(path):
        if not (file.endswith(".orig") or file.endswith(".json") or file.endswith("csv") or file.__contains__("spellchecked")):
            with open(os.path.join(path, file), "r") as f:
                split = file.split(".")[0]
                data = f.read().splitlines()
                for i in range(len(splits_orig[split])):
                    source = cleanup(splits_orig[split][i])
                    target = cleanup(data[i])
                    # Going to overwrite the model's existing "summarize:" prefix to speed up training
                    source = "improve: " + source
                    splits[split].append([source, target])

format(dev)
format(test)

# Print some tokenized statistics (for reference later in training)
for split in splits:
    pd.DataFrame(splits[split], columns = ["source_text", "target_text"]).to_csv(os.path.join(root, split+".csv"), index=False)