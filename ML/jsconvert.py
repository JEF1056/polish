from transformers import AutoTokenizer
from transformers import TFT5ForConditionalGeneration
import os
import json
import tensorflow as tf
import sentencepiece as spm

model = "/mnt/c/Users/jfan/Documents/GitHub/grammarly/ML/models/asset_jfleg_completion/simplet5-epoch-6-train-loss-1.2141-val-loss-1.3325"
path = "exported/asset_jfleg_completion"

max_len = 64

class CustomTFT5(TFT5ForConditionalGeneration):
    def __init__(self, *args, log_dir=None, cache_dir=None, **kwargs):
        super().__init__(*args, **kwargs)

    @tf.function(input_signature=[{
        "input_ids": tf.TensorSpec([None, max_len], tf.int32, name="input_ids"),
        "attention_mask": tf.TensorSpec([None, max_len], tf.int32, name="attention_mask"),
        "decoder_input_ids": tf.TensorSpec([None, max_len], tf.int32, name="decoder_input_ids"),
        "decoder_attention_mask": tf.TensorSpec([None, max_len], tf.int32, name="decoder_attention_mask"),
    }])
    def serving(self, inputs):
      output = self.call(inputs)
      return self.serving_output(output)

os.system(f"rm -rf {path}")

tokenizer = AutoTokenizer.from_pretrained(model)
model = CustomTFT5.from_pretrained(model, from_pt=True)

# Save the tokenizer files
tokenizer.save_pretrained(os.path.join(path, "tokenizer"), saved_model=True)
tokenizer.save_vocabulary(os.path.join(path, "tokenizer"))

# Save vocab list
json.dump([i[0] for i in json.load(open(os.path.join(path, "tokenizer", "tokenizer.json"), "r"))["model"]["vocab"]], open(os.path.join(path, "tokenizer", "vocab.json"), "w"))

# Load sentencepiece model and pair vocab ids with model scores
sp = spm.SentencePieceProcessor(model_file=os.path.join(path, "tokenizer", 'spiece.model'))
vals = json.load(open(os.path.join(path, "tokenizer", "vocab.json"), "r"))

temp = []
for i in range(len(vals)):
    try:
        temp.append([vals[i], sp.GetScore(i)])
    except: pass
print(len(temp))
json.dump(temp, open(os.path.join(path, "tokenizer", "vocab_model.json"), "w"))

model.save_pretrained(os.path.join(path, "model"), saved_model=True)

os.system(f"tensorflowjs_converter --input_format=tf_saved_model --quantize_uint8='*' {path}/model/saved_model/1 {path}/web")