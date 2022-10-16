import pandas as pd
from simplet5 import SimpleT5

# Load the csv as a pandas dataframe
train_ds = pd.read_csv("asset-valid.csv").dropna().astype(str)
valid_ds = pd.read_csv("asset-test.csv").dropna().astype(str)

# train_df, eval_df = train_test_split(df, test_size=0.2)
# train_df.shape, eval_df.shape

model = SimpleT5()
model.from_pretrained("t5","t5-small")

model.train(train_df=train_ds,
            eval_df=valid_ds,
            source_max_token_len = 64, 
            target_max_token_len = 64,
            batch_size = 68,
            max_epochs = 25,
            use_gpu = True,
            outputdir = "asset-test-e",
            early_stopping_patience_epochs = 2,
            precision = 16
            )