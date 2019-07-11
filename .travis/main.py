import json
import os
import requests
files = ['latest', 'stories_top100_thisweek', 'stories_top100_thismonth', 'stories_top100_thisyear', 'stories_top100_alltime', 'authors_top100_thisweek', 'authors_top100_thismonth', 'authors_top100_thisyear', 'authors_top100_alltime', 'stats', "filters"]
PATH = os.environ['DATA_SOURCE']
for file in files:
    r = requests.get(PATH + file + ".json")
    data = json.loads(r.text)
    json.dump(data,open("data/"+file+".json", "w"))
