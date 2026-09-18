import joblib

model = joblib.load("website_threat_model.pkl")

def detect_threat(text):

    # convert text to lowercase
    text_lower = text.lower()

    # adult keywords for strong detection
    adult_keywords = [
        "porn", "xxx", "sex", "nude", "adult",
        "cam girls", "18+", "explicit"
    ]

    # phishing keywords
    phishing_keywords = [
        "verify account", "login now", "confirm password",
        "bank login", "update payment"
    ]

    # malware keywords
    malware_keywords = [
        "download crack", "free keygen", "hack tool",
        "software crack"
    ]

    # keyword override detection (good for hackathon demo)
    if any(k in text_lower for k in adult_keywords):
        return "adult"

    if any(k in text_lower for k in phishing_keywords):
        return "phishing"

    if any(k in text_lower for k in malware_keywords):
        return "malware"

    # fallback to ML model
    prediction = model.predict([text])[0]
    return prediction


# test example
print(detect_threat("free nude adult cam streaming"))