# HPFanfiction Recommender Website
![Travis CI](https://travis-ci.org/HackeSta/hpffrec-website.svg?branch=master) [![Netlify Status](https://api.netlify.com/api/v1/badges/d8c46cf8-28c2-4f65-b279-9238a94d272b/deploy-status)](https://app.netlify.com/sites/hpffrec/deploys)  
This repo contains the source code for the front-end website of [HPFanfiction Recommender](https://hpffrec.hackesta.org/)  
 
[Read my blog post on creating HPFanfiction Recommender](https://blog.haideralipunjabi.com/posts/making-hpfanfiction-recommender/)

## How it works
A Python Backend uses data from [pushshift.io](https://pushshift.io/) to fetch comments made by [u/FanfictionBot](https://www.reddit.com/user/FanfictionBot/) in [r/HPFanfiction](https://www.reddit.com/r/HPFanfiction/) and extracts relevant data from them and stores it in a database. JSON files are made from that database, which are then commited to this repo using [Travis-CI](https://travis-ci.org/)  

The backend is currently hosted on a free server from [PythonAnywhere](https://pythonanywhere.com), and the server is restricted within its limits.

## Contributing
Pull Requests are welcome. You can work with the data in `/data` folder, which is updated by a backend server using [Travis-CI](https://travis-ci.org/)  
If you want more data to be available in the `/data/` folder, open an issue and we will discuss it.