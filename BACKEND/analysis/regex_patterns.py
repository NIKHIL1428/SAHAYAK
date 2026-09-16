import re


PHONE_REGEX = re.compile(
    r"(?<![A-Za-z0-9])"
    r"(?:\+91[\s-]?)?"
    r"[6-9]\d{9}"
    r"(?!\d)"
)


EMAIL_REGEX = re.compile(
    r"\b"
    r"[A-Za-z0-9._%+-]+"
    r"@"
    r"[A-Za-z0-9.-]+"
    r"\."
    r"[A-Za-z]{2,}"
    r"\b"
)


UPI_REGEX = re.compile(
    r"\b"
    r"[A-Za-z0-9._-]{2,}"
    r"@"
    r"[A-Za-z][A-Za-z0-9.-]*"
    r"\b"
)


PAN_REGEX = re.compile(
    r"\b[A-Z]{5}[0-9]{4}[A-Z]\b",
    re.IGNORECASE
)


AADHAAR_REGEX = re.compile(

    r"\b"

    r"(?:"

    # Aadhaar number is...
    r"(?:aadhaar|aadhar)"
    r"\s*(?:number|no\.?)?"
    r"\s*(?:is|:|-)?"
    r"\s*"

    r")"

    # Capture only the number
    r"(\d{4}[\s-]?\d{4}[\s-]?\d{4})"

    r"\b",

    re.IGNORECASE
)


ACCOUNT_REGEX = re.compile(

    r"\b"

    r"(?:"

    r"(?:bank\s+)?account"

    r"\s*"

    r"(?:number|no\.?)?"

    r"\s*"

    r"(?:is|:|-)?"

    r"\s*"

    r")"

    # Capture only account number
    r"(\d{9,18})"

    r"\b",

    re.IGNORECASE
)


IFSC_REGEX = re.compile(

    r"\b"

    r"[A-Z]{4}"

    r"0"

    r"[A-Z0-9]{6}"

    r"\b",

    re.IGNORECASE
)


TRANSACTION_REGEX = re.compile(

    r"\b"

    r"(?:"

    r"transaction"

    r"|transaction\s+id"

    r"|txn"

    r"|txn\s+id"

    r"|UTR"

    r"|reference"

    r"|reference\s+number"

    r")"

    r"\s*"

    r"(?:number|no\.?|id)?"

    r"\s*"

    r"(?:is|:|-)?"

    r"\s*"

    # Capture transaction ID
    r"([A-Z0-9_-]{6,30})"

    r"\b",

    re.IGNORECASE
)


AMOUNT_REGEX = re.compile(

    r"(?:₹|Rs\.?|INR)"

    r"\s*"

    r"[0-9,]+"

    r"(?:\.\d{1,2})?",

    re.IGNORECASE
)


URL_REGEX = re.compile(

    r"https?://"

    r"[^\s<>\"']+",

    re.IGNORECASE
)