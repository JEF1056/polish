from flask import Flask
# pip install flask
app = Flask(__name__)
@app.route("/")

def home():
   return “This is the <h1>home page</h1>”
   app.run()
