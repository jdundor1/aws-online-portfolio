import os
import datetime
import boto3
import jwt
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.backends import default_backend
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

CLOUDFRONT_KEY_ID = os.getenv("CLOUDFRONT_KEY_ID")
PRIVATE_KEY_PATH = os.getenv("PRIVATE_KEY_PATH")
CLOUDFRONT_DOMAIN = os.getenv("CLOUDFRONT_DOMAIN")

def generate_signed_url(file_path, expire_minutes=5):
    with open(PRIVATE_KEY_PATH, 'rb') as key_file:
        private_key = serialization.load_pem_private_key(
            key_file.read(),
            password=None,
            backend=default_backend()
        )

    expire_time = datetime.datetime.utcnow() + datetime.timedelta(minutes=expire_minutes)

    policy = {
        "Statement": [
            {
                "Resource": f"https://{CLOUDFRONT_DOMAIN}/{file_path}",
                "Condition": {
                    "DateLessThan": {"AWS:EpochTime": int(expire_time.timestamp())}
                }
            }
        ]
    }

    policy_encoded = jwt.encode(policy, private_key, algorithm='RS256')

    signed_url = f"https://{CLOUDFRONT_DOMAIN}/{file_path}?Policy={policy_encoded}&Key-Pair-Id={CLOUDFRONT_KEY_ID}"
    return signed_url

if __name__ == "__main__":
    test_file = "posts/first-post.md"
    url = generate_signed_url(test_file)
    print("Signed URL:", url)
