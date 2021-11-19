from elasticsearch import Elasticsearch
from flask import Flask, request
from helpers.search import *

app = Flask(__name__)
es = Elasticsearch([{'host': 'localhost', 'port': 9200}])
es = Elasticsearch(timeout=30, max_retries=10, retry_on_timeout=True)

@app.route("/search/<query>", methods=['GET'])
def index(query):
    genre = request.args.get('genre')
    start = request.args.get('start')
    end = request.args.get('end')

    if genre!=None and start!=None and end!=None:
        res=filterBy(query, genre=genre, start=int(start), end=int(end))
    elif genre!=None:
        res=filterByGenre(query, genre=genre)
    elif activeYears!=None:
        res=filterByActiveYear(query, start=int(start), end=int(end))
    else:
        res=generalSearch(query)
    return res

@app.route("/genres", methods=['GET'])
def genres():
    res=allGenres()
    return res

@app.route("/active-years", methods=['GET'])
def activeYears():
    res=allActiveYears()
    return res

if __name__ == "__main__":
    app.run(debug=True)