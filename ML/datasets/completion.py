import pandas as pd
import random
import os

root = "ML/datasets/completion"

# Load the csv as a pandas dataframe
train_ds_asset = pd.read_csv("ML/datasets/asset/valid.csv").dropna().astype(str)
valid_ds_asset = pd.read_csv("ML/datasets/asset/test.csv").dropna().astype(str)

train_ds_jfleg = pd.read_csv("ML/datasets/jfleg/dev.csv").dropna().astype(str)
valid_ds_jfleg = pd.read_csv("ML/datasets/jfleg/test.csv").dropna().astype(str)

train_ds = pd.concat([train_ds_asset, train_ds_jfleg], axis=0)
valid_ds = pd.concat([valid_ds_asset, valid_ds_jfleg], axis=0)

for ds in [["train", train_ds], ["valid", valid_ds]]:
    lists = []
    for index, row in ds[1].iterrows():
        max_len = len(row["target_text"].split(" "))
        if max_len <= 2: continue
        select = random.randint(2, max_len-1)
        subdiv = row["target_text"].strip().split(" ")
        lists.append(["complete: " + ' '.join(subdiv[0:select]).strip(), ' '.join(subdiv[select:max_len]).strip()])
    
    pd.DataFrame(lists, columns = ["source_text", "target_text"]).to_csv(os.path.join(root, f"{ds[0]}.csv"), index=False)