from math import sin
import requests as req
from bs4 import BeautifulSoup
from googletrans import Translator
import wikipedia
import json
import pandas as pd

singers = pd.read_csv('singers.csv')['0'].values

documents = {}
translator = Translator()
for singer in singers:
    page_object = wikipedia.page(singer)
    
    dictionary = {
        "name" : translator.translate(page_object.original_title, dest='si', src='en').text,
        "bio": translator.translate(page_object.content, dest='si', src='en').text,
    }

    documents[translator.translate(page_object.original_title, dest='si', src='en').text] = dictionary


# Serializing json 
json_object = json.dumps(dictionary, indent = 4)
  
# Writing to sample.json
with open("document.json", "w") as outfile:
    outfile.write(json_object)

# no_bio=0
# bio_fields = {"Born"}
# for link in links[:3]:
#     document = {}
#     res = req.get('https://en.wikipedia.org/'+link)
#     soup = BeautifulSoup(res.text, 'lxml')

#     bio = soup.find('table', {'class':'biography'}) or soup.find('table', {'class':'infobox vcard plainlist'})
#     if bio!=None:
#         name = translate(bio.th.text)
#         print("***************", name, "***************")

#         for tr in bio.find_all('tr'):
#             th, td = tr.th, tr.td

#             if th!=None and td!=None:
#                 field = translate(th.text)
#                 bio_fields.add(field)
                
#                 more = td.find('div', {'class': 'hlist-separated'})
#                 values = []
#                 if more != None:
#                     for li in more.ul:
#                         values.append(translate(li.text))
#                 else:
#                     values.append(translate(td.text))
#                 document[field] = values
#         write_to_file(document, name)
#     else:
#         no_bio+=1


# # translator = Translator()
# # print(translator.translate('Good morning', dest='si', src='en'))

# # # Data to be written
# dictionary ={
#     "name" : name,
#     "age" :,
#     "Born":,
#     "Died":,
#     "Education":,
#     "Occupation":,
#     "Spouses":,
#     "Children":,
#     "Genres":,
#     "Instruments":,
#     "Year active":,
#     "Labels":,
#     "Associated acts":
# }

# # Serializing json 
# json_object = json.dumps(dictionary, indent = 4)
  
# # Writing to sample.json
# with open(name+".json", "w") as outfile:
#     outfile.write(json_object)
