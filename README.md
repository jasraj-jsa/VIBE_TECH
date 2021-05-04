## Visionary Idea Browsing Environment (V.I.B.E)

# There are a lot of people in this world that solve their problems on a regular basis by some form of innovation. They want to create something of their own but lack the resources to do so. They require other like-minded people who can work with them and turn these ideas to reality. But it’s not easy to come up with an idea for which you can totally dedicate yourself into and to find the right set of people to pursue it with.
# But what if we could create a platform that solves this problem. A platform where you can search for new ideas based on what you want to do. A platform where you can share your ideas with others and collaborate with them to take it further.
# By providing users with a relatively easy to use platform, they can come up with new ideas, post ideas and collaborate with like minded people and develop something great.
# Our aim is to create a platform where we will be able to provide the users with the tools to collaborate with each other.

There are 4 aspects to our application:
1) Social Media Platform (Technologies Used: MERN (MongoDB, Express.js, React.js, Node.js)
2) Search Engine (Google based search and Local Elastic search based search engine) (Running on a flask server)
3) Recommendation System (ML based TF-IDF Model)
4) Idea Analysis (Classifying comments using sentiment analysis) (Running on a flask server)


# Extra dependecies
1) Please download elastic search: https://www.elastic.co/downloads/elasticsearch
   Go to the folder downloaded and execute ./bin/elasticsearch
2) Make sure you have node/npm installed in your system as well.

Steps to run the application:

1) Go to Front-End folder and type npm install --save, then start the server using npm start.
2) Go to Back-End folder and type npm install --save, then start the server using npm start.
3) Go to Sentiment-Analysis Model folder and type pip install -r requirements.txt, then start using the server using python3 main.py
4) Go to Search-Engine Model folder and type pip install -r requirements.txt, then start using the server using python3 main.py

Hope this idea inspires others to contribute and make an impact.


