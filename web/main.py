from flask import Flask, render_template
# pip install flask
app = Flask(__name__)
@app.route('/html')

def home():
   return render_template('support.html')
   app.run()
