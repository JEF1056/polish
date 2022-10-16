import os
import json
import pandas as pd
from transformers import AutoTokenizer

temp = {}
tokenizer = AutoTokenizer.from_pretrained("t5-small")

for folder in ["asset", "jfleg"]:
    temp[folder] = {}
    for file in os.listdir(folder):
        if file.endswith(".csv"):
            source = []
            target = []
            df = pd.read_csv(os.path.join(folder, file))
            df = df.reset_index()
            for index, row in df.iterrows():
                source.append(len(tokenizer(row["source_text"]).input_ids))
                target.append(len(tokenizer(row["target_text"]).input_ids))
            temp[folder][file.split(".")[0]] = [{
                "min":min(lenlist),
                "max":max(lenlist),
                "avg":sum(lenlist)/len(lenlist),
                "std_dev": (sum([((x - sum(lenlist)/len(lenlist)) ** 2) for x in lenlist]) / len(lenlist)) ** 0.5
            } for lenlist in [source, target]]

print(json.dumps(temp, indent=2))