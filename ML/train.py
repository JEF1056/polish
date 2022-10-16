import pandas as pd
from simplet5 import SimpleT5

# Load the csv as a pandas dataframe
train_ds = pd.read_csv("ML/datasets/asset/valid.csv").dropna().astype(str)
valid_ds = pd.read_csv("ML/datasets/asset/test.csv").dropna().astype(str)

# Using T5 instead of T5v1.1 sbecasue it already has summarization embeddings
model = SimpleT5()
model.from_pretrained("t5","t5-small")

model.train(train_df=train_ds,
            eval_df=valid_ds,
            source_max_token_len = 64, 
            target_max_token_len = 64,
            batch_size = 46,
            max_epochs = 25,
            use_gpu = True,
            outputdir = "mdoels/assetonly",
            early_stopping_patience_epochs = 2,
            precision = 16
            )