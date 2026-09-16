import re
from analysis.regex_patterns import (
    PHONE_REGEX,
    EMAIL_REGEX,
    UPI_REGEX,
    PAN_REGEX,
    AADHAAR_REGEX,
    ACCOUNT_REGEX,
    IFSC_REGEX,
    TRANSACTION_REGEX,
    AMOUNT_REGEX,
    URL_REGEX
)


class EntityExtractor:

    # ============================================
    # Remove duplicates while preserving order
    # ============================================

    @staticmethod
    def unique(items):

        return list(
            dict.fromkeys(items)
        )


    # ============================================
    # Normalize phone numbers
    # ============================================

    @staticmethod
    def normalize_phone(phone):

        phone = phone.replace(" ", "")
        phone = phone.replace("-", "")

        return phone


    # ============================================
    # Normalize Aadhaar
    # ============================================

    @staticmethod
    def normalize_aadhaar(aadhaar):

        aadhaar = aadhaar.replace(" ", "")
        aadhaar = aadhaar.replace("-", "")

        return aadhaar


    # ============================================
    # Main extraction function
    # ============================================

    def extract(self, text):

        # -----------------------------
        # Preprocess: spoken "@" → "@"
        # Whisper often transcribes "nikhil at the rate gmail.com"
        # instead of "nikhil@gmail.com". Replace the phrase so
        # existing email and UPI regexes can match correctly.
        # -----------------------------

        text = re.sub(r'\bat\s+the\s+rate\b', '@', text, flags=re.IGNORECASE)


        # -----------------------------
        # Emails
        # -----------------------------

        emails = self.unique(

            EMAIL_REGEX.findall(text)

        )


        # -----------------------------
        # UPI IDs
        # -----------------------------

        upi_ids = self.unique(

            UPI_REGEX.findall(text)

        )


        # -----------------------------
        # Remove Emails from UPI IDs
        # -----------------------------

        email_set = {

            email.lower()

            for email in emails

        }


        clean_upi = [

            upi

            for upi in upi_ids

            if upi.lower() not in email_set

        ]


        # -----------------------------
        # Phones
        # -----------------------------

        phones = []

        for phone in PHONE_REGEX.findall(text):

            phones.append(

                self.normalize_phone(

                    phone

                )

            )


        # -----------------------------
        # Aadhaar
        # -----------------------------

        aadhaar_numbers = []

        for aadhaar in AADHAAR_REGEX.findall(text):

            aadhaar_numbers.append(

                self.normalize_aadhaar(

                    aadhaar

                )

            )


        # -----------------------------
        # Bank Accounts
        # -----------------------------

        accounts = ACCOUNT_REGEX.findall(

            text

        )


        # -----------------------------
        # Final JSON
        # -----------------------------

        result = {

            "phone_numbers":

                self.unique(

                    phones

                ),


            "upi_ids":

                self.unique(

                    clean_upi

                ),


            "pan_numbers":

                self.unique([

                    pan.upper()

                    for pan in

                    PAN_REGEX.findall(text)

                ]),


            "aadhaar_numbers":

                self.unique(

                    aadhaar_numbers

                ),


            "emails":

                emails,


            "urls":

                self.unique(

                    URL_REGEX.findall(text)

                ),


            "amounts":

                self.unique(

                    AMOUNT_REGEX.findall(text)

                ),


            "ifsc_codes":

                self.unique([

                    code.upper()

                    for code in

                    IFSC_REGEX.findall(text)

                ]),


            "bank_account_numbers":

                self.unique(

                    accounts

                ),


            "transaction_ids":

                self.unique([

                    transaction.upper()

                    for transaction in

                    TRANSACTION_REGEX.findall(text)

                ])

        }

        return result