from flask import Flask, render_template, send_from_directory
import os


app = Flask(__name__)
model_path = "../model"

@app.route('/model/<path:filename>', methods=['GET'])
def download_model(filename):
    return send_from_directory(os.path.join(model_path, "web"), filename, as_attachment=True)

@app.route('/tokenizer/<path:filename>', methods=['GET'])
def download_tokenizer(filename):
    return send_from_directory(os.path.join(model_path, "tokenizer"), filename, as_attachment=True)

@app.route('/', methods=['GET'])
def index():
    return render_template("index.html")

if __name__ == "__main__":
    app.run(port=5000, debug=True)