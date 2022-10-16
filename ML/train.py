import pandas as pd
from simplet5 import SimpleT5

# Load the csv as a pandas dataframe
train_ds_asset = pd.read_csv("datasets/asset/valid.csv").dropna().astype(str)
valid_ds_asset = pd.read_csv("datasets/asset/test.csv").dropna().astype(str)

train_ds_jfleg = pd.read_csv("datasets/jfleg/dev.csv").dropna().astype(str)
valid_ds_jfleg = pd.read_csv("datasets/jfleg/test.csv").dropna().astype(str)

train_ds = pd.concat([train_ds_asset, train_ds_jfleg], axis=0)
valid_ds = pd.concat([valid_ds_asset, valid_ds_jfleg], axis=0)

# Beleive it or not, this is how you shuffle lmao
train_ds = train_ds.sample(frac=1).reset_index(drop=True)
valid_ds = valid_ds.sample(frac=1).reset_index(drop=True)

print(train_ds.head())
print(valid_ds.head())

# Using T5 instead of T5v1.1 sbecasue it already has summarization embeddings
model = SimpleT5()
model.from_pretrained("t5","t5-small")

model.train(train_df=train_ds,
            eval_df=valid_ds,
            source_max_token_len = 64, 
            target_max_token_len = 64,
            batch_size = 68,
            max_epochs = 25,
            use_gpu = True,
            outputdir = "models/asset_jfleg",
            early_stopping_patience_epochs = 2,
            precision = 16
            )