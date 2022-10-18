from simplet5 import SimpleT5

# instantiate
model = SimpleT5()

model.load_model("t5","/mnt/c/Users/jfan/Documents/GitHub/grammarly/ML/models/improve_continue/simplet5-epoch-8-train-loss-1.5955-val-loss-1.7738", use_gpu=True)

# predict
while True:
    print(model.predict(input("> ")))