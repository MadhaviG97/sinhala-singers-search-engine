from elasticsearch import Elasticsearch
from flask import Flask, request
from helpers.search import search

app = Flask(__name__)
es = Elasticsearch([{'host': 'localhost', 'port': 9200}])
es = Elasticsearch(timeout=30, max_retries=10, retry_on_timeout=True)

@app.route("/<query>", methods=['GET'])
def index(query=None):
    res=search(query)
    # res = query
    return res
    

if __name__ == "__main__":
    app.run(debug=True)