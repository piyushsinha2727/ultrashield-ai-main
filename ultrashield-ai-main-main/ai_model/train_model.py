import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
import joblib

data = {
    "text": [
        # adult
        "free porn videos xxx adult streaming",
        "nude cam girls live streaming",
        "watch explicit adult movies online",
        "18+ sex chat live",
        "best porn websites free xxx",

        # phishing
        "verify your paypal account login now",
        "bank login verify password immediately",
        "confirm your account to avoid suspension",
        "update your credit card information now",
        "secure login verify your bank account",

        # malware
        "download cracked software free keygen",
        "free software crack download full version",
        "install this patch to unlock premium",
        "download hack tool free",
        "free game cheats download",

        # scam
        "online casino betting win money",
        "win lottery claim your prize now",
        "crypto giveaway send 1 bitcoin get 10",
        "investment double money fast",
        "online betting jackpot win",

        # safe
        "learn python programming tutorial",
        "latest tech news and gadgets",
        "how to cook pasta recipe",
        "weather forecast today",
        "football match highlights today"
    ],

    "label": [
        "adult","adult","adult","adult","adult",
        "phishing","phishing","phishing","phishing","phishing",
        "malware","malware","malware","malware","malware",
        "scam","scam","scam","scam","scam",
        "safe","safe","safe","safe","safe"
    ]
}
df = pd.DataFrame(data)

X_train, X_test, y_train, y_test = train_test_split(
    df["text"], df["label"], test_size=0.2, random_state=42
)
#  /*machine learning pipeline with TF-IDF and logistic regression*/
model = Pipeline([
    ("tfidf", TfidfVectorizer()),
    ("clf", LogisticRegression())
])

model.fit(X_train, y_train)

print("Accuracy:", model.score(X_test, y_test))

joblib.dump(model, "website_threat_model.pkl")