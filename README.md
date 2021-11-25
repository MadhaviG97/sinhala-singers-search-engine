# sinhala-singers-search-engine

## Description

*Sinhala Information retrieval system which gives information about Sri Lankan Singers*

## Build and Run

- start elasticsearch service

``service elasticsearch start``

- Active virtual enviornment (do this for each new terminal you use)

``. venv/bin/activate``

- Start backend

``cd webapp && export FLASK_APP=app && flask run``

- Start frontend

``cd ui && npm install && npm start``

## Dataset

 This IR system has been developed to search for famous singers in Sri Lanka. The data was collected using [Wikipedia](https://en.wikipedia.org/wiki/List_of_Sri_Lankan_musicians) and [FM Derana](http://www.fmderana.lk/sri-lankan-artists) sites. Using FM Derana websites, the names of the singers was collected. To scrape the details of the particular singers, the Wikipedia URLs were generated. Using the Wikipedia python library and Beautifulsoup the data was scraped.  The fields and their respective types that are included in a document are as follows.

- name(text)  - the name of the singer
- summary(text) - a bio or a short - description about the singer
- birth(integer) - the birth year of the singer
- genres(text, keyword) - the genres he/she has sung.

## Techniques used in designing indexing and querying

When creating the index a custom analyser was created. For tokenization of the documents, the standard tokenizer was used. Since we should exclude the stop words from creating the index, a filter with all the stop words was included in the analyser. The custom analyser was used to tokenize only the name, summary and genres fields only. 

As mentioned in the field list the genres field was classified as a text field and also a keyword field. Because genres field is being used to aggregate the results. To aggregate a field, that field has to be a keyword field. 

## Advanced features

- The search engine is capable of performing phrase queries as expected in the assignment given. 

- Users can filter the results by the singer’s genres and birth years.

- Users can do wildcard query searches.

- If the search term does not have any hits, the query will give a suggestion which can be the correct search term. If the user thinks it is correct, the user can search using that keyword. 

- If there are no suggestions for a particular keyword, the system will suggest the user to do a wildcard search.


## Queries
1. Simple keyword search - ශ්‍රී ලංකා සංගීතඥය
2. Pagination
3. Facet search by Genre, birth year
4. Wildcard search - 
4. Spell Correction/Suggestion - පෙරේර
