from flask import Flask, request, jsonify
import joblib

app = Flask(__name__)

model = joblib.load("website_threat_model.pkl")

def detect_threat(text):

    text_lower = text.lower()

    adult_keywords = ["porn","xxx","sex","nude","adult"]

    if any(k in text_lower for k in adult_keywords):
        return "adult"

    prediction = model.predict([text])[0]
    return prediction


@app.route("/predict", methods=["POST"])
def predict():

    data = request.json
    text = data["text"]

    category = detect_threat(text)

    return jsonify({"category": category})


if __name__ == "__main__":
    app.run(port=5001)