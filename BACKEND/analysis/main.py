import json

from analysis.summarizer import CybercrimeSummarizer
from analysis.extractor import EntityExtractor


transcript = """

OFFICER: Cyber Helpline 1930, Delhi Police. Bataiye kya hua?
VICTIM: Sir hello? Suniye sir mera sab kuch chala gaya! Main loot gaya sir completely!
OFFICER: Shanti rakhiye, bataye hua kya hai? Aapka naam?
VICTIM: Mera naam Rahul Sharma hai sir, main Shahdara se bol raha hoon. Mujhe ek fake call aaya abhi thodi der pehle. Unhone bola mera PNB account block ho jayega agar maine password nahi bataya. Main darr gaya sir aur abhi dekha toh Rs.408921 rupaye kat gaye mere pure!
OFFICER: Kisi ko OTP share kiya tha aapne?
VICTIM: Nahi sir maine koi OTP nahi diya, unhone pata nahi kaise bina bataye mera sara balance khali kar diya. Woh fraud bande ka number 9730741651 hai, bol raha tha woh KYC Verification Agent se hai. Sir mera paisa wapas dilwa do please.
OFFICER: Thik hai, aapka helpline number register ho raha hai aaj June 13 ko. Aapka registered number 9676717342 hi hai na?
VICTIM: Haan sir wahi hai. Please kuch kijiye.

"""


# ======================================
# Summarization
# ======================================

summarizer = CybercrimeSummarizer()

summary = summarizer.summarize(
    transcript
)


# ======================================
# Entity Extraction
# ======================================

extractor = EntityExtractor()

entities = extractor.extract(
    transcript
)


# ======================================
# Merge
# ======================================

result = {
    **summary,
    **entities
}


# ======================================
# Print JSON
# ======================================

print(
    json.dumps(
        result,
        indent=4,
        ensure_ascii=False
    )
)