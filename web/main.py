from flask import Flask
# pip install flask
app = Flask(__name__)
@app.route("/")
@app.route("/test")
