# app.py
from flask import Flask, render_template
import requests

#Flask 객체 인스턴스 생성
app = Flask(__name__)

@app.route('/') # 접속하는 url
def index():
  return render_template('index.html')

@app.route('/update', methods=['GET'])
def get_metric():
    try:
        response = requests.get('http://10.0.5.20:32555/analysis/web/metric')

        if response.status_code == 200:
            return response.json()
        else:
            return 'Error: Unable to fetch data from the remote server'
    except:
        return {}

if __name__=="__main__":
  app.run(debug=True)
  app.run(host="10.0.5.20", port="5000", debug=True)