import requests
from flask import Flask, Response

from bs4 import BeautifulSoup
from webargs import fields
from webargs.flaskparser import use_kwargs

app = Flask(__name__)


@app.route('/')
@use_kwargs({'link': fields.Str(required=True)}, location="query")
def hello_world(link):
    response = requests.get(link)
    html = response.text
    soup = BeautifulSoup(html, "html.parser")
    text = soup.get_text()
    clean_text = text.strip().replace("\n", " ")[:1000]
    print(link, clean_text)
    if clean_text:
        return Response(clean_text, status=200)
    else:
        return Response('error', status=500)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=9000)
