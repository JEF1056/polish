import os
import pandas as pd
from transformers import AutoTokenizer

root = "ML/datasets/asset"

tokenizer = AutoTokenizer.from_pretrained("t5-small")

splits = {
    "valid": [],
    "test": []
}

splits_orig = {
    "valid": open(os.path.join(root, "asset.valid.orig"), "r").read().splitlines(),
    "test": open(os.path.join(root, "asset.test.orig"), "r").read().splitlines()
}

def cleanup(text):
    while "  " in text:
        text = text.replace("  ", " ")
        
    return text.strip()

for file in os.listdir(root):
    if not (file.endswith(".orig") or file.endswith(".json") or file.endswith("csv")):
        with open(os.path.join(root, file), "r") as f:
            split = file.split(".")[1]
            data = f.read().splitlines()
            for i in range(len(splits_orig[split])):
                source = cleanup(splits_orig[split][i])
                target = cleanup(data[i])
                est_min = len(source) - len(target)
                # Only accept sentences smaller than the origin
                if est_min < 0: continue
                # Going to overwrite the model's existing "summarize:" prefix to speed up training
                source = "summarize: " + source
                splits[split].append([source, target])

# Print some tokenized statistics (for reference later in training)
for split in splits:    
    pd.DataFrame(splits[split], columns = ["source_text", "target_text"]).to_csv(os.path.join(root, split+".csv"), index=False)