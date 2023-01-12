from flask import Flask,request,jsonify
import os
import pathlib
import pandas as pd
# from sklearn.metrics import classification_report
import ktrain
from ktrain import text
# import tensorflow.keras
from keras_bert import get_custom_objects
from tensorflow.keras.models import load_model

app = Flask(__name__)
train_path="trainStackOverFlow.csv"
test_path="testStackOverFlow.csv"
tr_path= pathlib.Path(train_path)
te_path=pathlib.Path(test_path)
if tr_path.exists ():
    print("Train data path set.")
else: 
    raise SystemExit("Train data path does not exist.")
#showing the first 5 lines of the train data
train_df=pd.read_csv(train_path, encoding='utf-16', sep=';', header=None)
train_df.head()
if te_path.exists ():
    print("Test data path set.")
else: 
    raise SystemExit("Test data path does not exist.")
#showing the first 5 lines of the test data
test_df=pd.read_csv(test_path, encoding='utf-16', sep=';', header=None)
test_df.head()

(x_train, y_train), (x_test, y_test), preproc =  text.texts_from_array(train_df[2].tolist(), train_df[1].tolist(),  x_test=test_df[2].tolist(), y_test=test_df[1].tolist(), 
                                                                    maxlen=500, preprocess_mode='bert')
                                                                    

model=load_model('stackoverflow_model.h5', custom_objects=get_custom_objects())
learner = ktrain.get_learner(model, 
                            train_data=(x_train, y_train), 
                            val_data=(x_test, y_test), 
                            batch_size=6)
@app.route('/getSentimentForComment', methods=['GET','POST'])
def getSentimentForComment():
    data=request.get_json()
    comment=data['comment']

    predictor = ktrain.get_predictor(learner.model, preproc)
    y_pred = predictor.predict(comment)
        # y_pred = predictor.predict("This is a poor idea")
    return y_pred

# @app.route('/hello',methods=['POST'])
# def hello():
#     data=request.get_json()
#     print(data)
#     return "Hello World!"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=6000, debug=True)
