from logging import NullHandler
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
    page = request.args.get('page')

    if page==None:
        page=1
    else:
        page = int(page)
    
    print(start, end, page)
        
    if genre!=None and start!=None and end!=None:
        print(1)
        return filterBy(query, genre=genre, start=int(start), end=int(end), page=page)
    elif genre!=None:
        print(2)
        return filterByGenre(query, genre=genre, page=page)
    elif start!=None and end!=None:
        if start.isdigit() and end.isdigit():
            print(3)
            return filterByActiveYear(query, start=int(start), end=int(end), page=page)
        else:
            print(4)
            return generalSearch(query, page=page)
    else:
        print(5)
        return generalSearch(query, page=page)

@app.route("/genres", methods=['GET'])
def genres():
    return allGenres()

if __name__ == "__main__":
    app.run(debug=True)