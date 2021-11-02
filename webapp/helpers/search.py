import re
from elasticsearch import Elasticsearch
import os
from dotenv import load_dotenv

load_dotenv()
INDEX = os.getenv('INDEX')

es = Elasticsearch([{'host': 'localhost', 'port': 9200}])
es = Elasticsearch(timeout=30, max_retries=10, retry_on_timeout=True)

def generalSearch(query):
    res = es.search(
        index=INDEX, size=100, body=
            {
                "query": {
                    "bool": {
                        "must": {
                            "multi_match": {
                                "query": query,
                                "fields": [
                                    "document.name",
                                    "document.summary",
                                    "document.genres"
                                ]
                            }
                        }
                    }
                },
                "aggs": {
                    "genres": {
                        "terms": {
                            "field": "document.genres.keyword",
                            "size": 100
                        }
                    }
                }
            }
    )
    return postProcess(res)

def filterByGenre(query, queryParam=None):
    res = es.search(
        index=INDEX, size=100, body=
            {
                "query": {
                    "bool": {
                        "must": {
                            "multi_match": {
                                "query": query,
                                "fields": [
                                    "document.name",
                                    "document.summary",
                                    "document.genres"
                                ]
                            }
                        },
                        "filter": {
                            "term": {"document.genres": queryParam}
                        }
                    }
                },
                "aggs": {
                    "genres": {
                        "terms": {
                            "field": "document.genres.keyword",
                            "size": 100
                        }
                    }
                }
            }
    )
    return postProcess(res)

def filterByBirthYear(query, start, end):
    res = es.search(
        index=INDEX, size=100, body=
            {
                "query": {
                    "bool": {
                        "must": {
                            "multi_match": {
                                "query": query,
                                "fields": [
                                    "document.name",
                                    "document.summary",
                                    "document.genres"
                                ]
                            }
                        },
                        "filter": {
                            "range": {
                                "document.birth": {
                                    "gte": start,
                                    "lte": end
                                }
                            }
                        }
                    }
                },
                "aggs": {
                    "genres": {
                        "terms": {
                            "field": "document.genres.keyword",
                            "size": 100
                        }
                    }
                }
            }
    )
    return postProcess(res)

def allGenres():
    res = es.search(
        index=INDEX, size=0, body=
            {
                "query": {
                    "match_all": {}
                },
                "aggs": {
                    "genres": {
                        "terms": {
                            "field": "document.genres.keyword",
                            "size": 100
                        }
                    }
                }
            }
    )
    return {"genres": res["aggregations"]['genres']['buckets']}

def postProcess(response):
    common_genres = response["aggregations"]['genres']['buckets']
    hits = response["hits"]["hits"]
    totalCount = response["hits"]["total"]["value"]
    search_results = []
    for hit in hits:
        singer = hit["_source"]["document"]
        search_results.append(singer)
    
    return {"totalCount": totalCount, "documents": search_results, "genres": common_genres}
