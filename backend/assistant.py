"""Grounded conversational help for the Yojana Disha workspace.

The assistant deliberately answers from product capabilities and matcher output
instead of inventing scheme eligibility or application guarantees.
"""

from dataclasses import dataclass
from typing import Any

from matcher import match_profile


SUPPORTED_LANGUAGES = {"en", "hi", "kn", "mr"}


@dataclass(frozen=True)
class AssistantReply:
    reply: str
    suggestions: tuple[str, ...]
    action: dict[str, str] | None = None

    def as_dict(self) -> dict[str, Any]:
        payload: dict[str, Any] = {
            "reply": self.reply,
            "suggestions": list(self.suggestions),
        }
        if self.action:
            payload["action"] = self.action
        return payload


COPY = {
    "en": {
        "greeting": "Namaste! I’m Disha AI. I can guide you around the workspace or help you find schemes using your verified profile details.",
        "help": "Start with Scheme Finder for eligibility, use Yojana GPS to explore improvements, and open Document Passport to prepare files. What would you like to do?",
        "finder": "I’ve opened Scheme Finder. Complete the profile carefully—especially the final eligibility checks—then select ‘Find my schemes’ for transparent, ranked results.",
        "finder_needed": "I need a checked entrepreneur profile before I can recommend a scheme. I’ve opened Scheme Finder so we can build one.",
        "gps": "I’ve opened Yojana GPS. It compares your matched schemes and shows honest, practical changes that may strengthen your route.",
        "gps_needed": "Yojana GPS needs scheme matches first. I’ve opened Scheme Finder so you can create them.",
        "passport": "I’ve opened Document Passport. Choose a matched scheme to see its checklist; files stay in this browser.",
        "passport_needed": "Document Passport builds its checklist from your matches. Run Scheme Finder first, then I can take you there.",
        "dashboard": "I’ve taken you to the dashboard, where you can see your progress and recommended next step.",
        "privacy": "Your profile is sent only to this app’s matcher while you use it. Uploaded documents stay in this browser and are not sent to the Flask API. No account is required.",
        "apply": "Open a matched scheme’s official portal to verify current rules and apply. Yojana Disha provides guidance—not approval—and never asks you to pay an agent.",
        "compare": "I’ve opened the comparison area in Yojana GPS. Select two or three matched schemes to compare status, purpose, checks, and required documents.",
        "no_message": "Please enter a question so I can help.",
        "fallback": "I can help with scheme matching, eligibility, route planning, documents, privacy, or navigation. Try asking ‘Which schemes fit me?’",
        "results_intro": "Based on the profile you checked, your strongest current matches are:",
        "results_none": "The checked profile has no actionable match in the current catalogue. Review the details in Scheme Finder, then use Yojana GPS to explore truthful next steps.",
        "eligible": "Eligible",
        "near": "Near match",
        "results_note": "These are guidance, not approval. Verify current rules on each official portal.",
        "explain_intro": "Based on Yojana Disha's structured eligibility check, {scheme} is shown as {status}. This is not official approval.",
        "passed_intro": "Checks satisfied from your profile:",
        "verify_intro": "Still verify:",
        "documents_intro": "The current catalogue checklist for {scheme} includes:",
        "documents_note": "These are indicative checklist items. Confirm the final list on the official portal; document checks in Passport stay in your browser.",
        "suggestions": ("Find schemes", "Explain my top matches", "Prepare documents"),
    },
    "hi": {
        "greeting": "नमस्ते! मैं दिशा AI हूँ। मैं वेबसाइट पर आपका मार्गदर्शन कर सकती हूँ और जाँची हुई प्रोफ़ाइल से सही योजनाएँ खोजने में मदद कर सकती हूँ।",
        "help": "पात्रता के लिए Scheme Finder, बेहतर रास्ते देखने के लिए Yojana GPS और दस्तावेज़ तैयार करने के लिए Document Passport का उपयोग करें।",
        "finder": "मैंने Scheme Finder खोल दिया है। जानकारी और अंतिम पात्रता जाँच सही भरकर ‘मेरी योजनाएँ खोजें’ चुनें।",
        "finder_needed": "योजना सुझाने से पहले मुझे आपकी जाँची हुई उद्यमी प्रोफ़ाइल चाहिए। मैंने Scheme Finder खोल दिया है।",
        "gps": "मैंने Yojana GPS खोल दिया है। यह आपके मैच की तुलना और व्यावहारिक अगले कदम दिखाता है।",
        "gps_needed": "Yojana GPS के लिए पहले योजना मैच चाहिए। मैंने Scheme Finder खोल दिया है।",
        "passport": "मैंने Document Passport खोल दिया है। योजना चुनकर उसकी दस्तावेज़ सूची देखें; फ़ाइलें इसी ब्राउज़र में रहती हैं।",
        "passport_needed": "Document Passport आपकी योजना मैच से सूची बनाता है। पहले Scheme Finder चलाएँ।",
        "dashboard": "मैंने डैशबोर्ड खोल दिया है। यहाँ आपकी प्रगति और अगला कदम दिखता है।",
        "privacy": "आपकी प्रोफ़ाइल केवल इस ऐप के मैचर को भेजी जाती है। अपलोड किए दस्तावेज़ इसी ब्राउज़र में रहते हैं और Flask API को नहीं भेजे जाते।",
        "apply": "वर्तमान नियम जाँचने और आवेदन करने के लिए मैच की आधिकारिक वेबसाइट खोलें। Yojana Disha मार्गदर्शन देता है, मंज़ूरी नहीं।",
        "compare": "मैंने Yojana GPS का तुलना भाग खोल दिया है। तुलना के लिए दो या तीन मैच चुनें।",
        "no_message": "कृपया अपना प्रश्न लिखें।",
        "fallback": "मैं योजना मैच, पात्रता, अगले कदम, दस्तावेज़, गोपनीयता और वेबसाइट नेविगेशन में मदद कर सकती हूँ।",
        "results_intro": "आपकी जाँची हुई प्रोफ़ाइल के अनुसार सबसे मजबूत मैच हैं:",
        "results_none": "वर्तमान सूची में कोई उपयोगी मैच नहीं मिला। Scheme Finder में जानकारी जाँचें और Yojana GPS में सही अगले कदम देखें।",
        "eligible": "पात्र",
        "near": "करीबी मैच",
        "results_note": "यह केवल मार्गदर्शन है। आधिकारिक पोर्टल पर वर्तमान नियम जाँचें।",
        "explain_intro": "Yojana Disha की संरचित पात्रता जाँच के आधार पर {scheme} को {status} दिखाया गया है। यह आधिकारिक मंज़ूरी नहीं है।",
        "passed_intro": "आपकी प्रोफ़ाइल से पूरी हुई जाँच:",
        "verify_intro": "अभी जाँचें:",
        "documents_intro": "{scheme} की वर्तमान सूची में ये दस्तावेज़ शामिल हैं:",
        "documents_note": "यह संकेतात्मक सूची है। अंतिम सूची आधिकारिक पोर्टल पर जाँचें; Passport की दस्तावेज़ जाँच इसी ब्राउज़र में रहती है।",
        "suggestions": ("योजनाएँ खोजें", "मेरे अच्छे मैच समझाएँ", "दस्तावेज़ तैयार करें"),
    },
    "kn": {
        "greeting": "ನಮಸ್ಕಾರ! ನಾನು ದಿಶಾ AI. ವೆಬ್‌ಸೈಟ್‌ನಲ್ಲಿ ದಾರಿ ತೋರಿಸಿ, ಪರಿಶೀಲಿಸಿದ ಪ್ರೊಫೈಲ್ ಆಧಾರದಲ್ಲಿ ಸರಿಯಾದ ಯೋಜನೆಗಳನ್ನು ಹುಡುಕಲು ಸಹಾಯ ಮಾಡುತ್ತೇನೆ.",
        "help": "ಅರ್ಹತೆಗೆ Scheme Finder, ಮುಂದಿನ ಹೆಜ್ಜೆಗಳಿಗೆ Yojana GPS ಮತ್ತು ದಾಖಲೆಗಳಿಗೆ Document Passport ಬಳಸಿ.",
        "finder": "Scheme Finder ತೆರೆದಿದ್ದೇನೆ. ವಿವರಗಳು ಮತ್ತು ಅಂತಿಮ ಅರ್ಹತಾ ಪರಿಶೀಲನೆಗಳನ್ನು ಸರಿಯಾಗಿ ತುಂಬಿ ‘ನನ್ನ ಯೋಜನೆಗಳನ್ನು ಹುಡುಕಿ’ ಆಯ್ಕೆಮಾಡಿ.",
        "finder_needed": "ಯೋಜನೆ ಸೂಚಿಸಲು ಮೊದಲು ಪರಿಶೀಲಿಸಿದ ಉದ್ಯಮಿ ಪ್ರೊಫೈಲ್ ಬೇಕು. Scheme Finder ತೆರೆದಿದ್ದೇನೆ.",
        "gps": "Yojana GPS ತೆರೆದಿದ್ದೇನೆ. ಇದು ನಿಮ್ಮ ಹೊಂದಾಣಿಕೆಗಳು ಮತ್ತು ಪ್ರಾಯೋಗಿಕ ಮುಂದಿನ ಹೆಜ್ಜೆಗಳನ್ನು ತೋರಿಸುತ್ತದೆ.",
        "gps_needed": "Yojana GPSಗೆ ಮೊದಲು ಯೋಜನೆ ಹೊಂದಾಣಿಕೆಗಳು ಬೇಕು. Scheme Finder ತೆರೆದಿದ್ದೇನೆ.",
        "passport": "Document Passport ತೆರೆದಿದ್ದೇನೆ. ಯೋಜನೆ ಆಯ್ಕೆಮಾಡಿ ಅದರ ದಾಖಲೆ ಪಟ್ಟಿಯನ್ನು ನೋಡಿ; ಫೈಲ್‌ಗಳು ಈ ಬ್ರೌಸರ್‌ನಲ್ಲೇ ಇರುತ್ತವೆ.",
        "passport_needed": "Document Passport ನಿಮ್ಮ ಹೊಂದಾಣಿಕೆಗಳಿಂದ ಪಟ್ಟಿ ಸಿದ್ಧಪಡಿಸುತ್ತದೆ. ಮೊದಲು Scheme Finder ಬಳಸಿ.",
        "dashboard": "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ತೆರೆದಿದ್ದೇನೆ. ಇಲ್ಲಿ ಪ್ರಗತಿ ಮತ್ತು ಶಿಫಾರಸು ಮಾಡಿದ ಮುಂದಿನ ಹೆಜ್ಜೆ ಕಾಣುತ್ತದೆ.",
        "privacy": "ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಈ ಆ್ಯಪ್‌ನ matcherಗೆ ಮಾತ್ರ ಹೋಗುತ್ತದೆ. ಅಪ್‌ಲೋಡ್ ದಾಖಲೆಗಳು ಬ್ರೌಸರ್‌ನಲ್ಲೇ ಇರುತ್ತವೆ.",
        "apply": "ಪ್ರಸ್ತುತ ನಿಯಮ ಪರಿಶೀಲಿಸಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಲು ಹೊಂದಾಣಿಕೆಯ ಅಧಿಕೃತ ಪೋರ್ಟಲ್ ತೆರೆಯಿರಿ. Yojana Disha ಮಾರ್ಗದರ್ಶನ ನೀಡುತ್ತದೆ, ಅನುಮೋದನೆ ಅಲ್ಲ.",
        "compare": "Yojana GPSನ ಹೋಲಿಕೆ ಭಾಗ ತೆರೆದಿದ್ದೇನೆ. ಹೋಲಿಸಲು ಎರಡು ಅಥವಾ ಮೂರು ಯೋಜನೆಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ.",
        "no_message": "ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ನಮೂದಿಸಿ.",
        "fallback": "ಯೋಜನೆ ಹೊಂದಾಣಿಕೆ, ಅರ್ಹತೆ, ಮುಂದಿನ ಹೆಜ್ಜೆಗಳು, ದಾಖಲೆಗಳು, ಗೌಪ್ಯತೆ ಅಥವಾ ನ್ಯಾವಿಗೇಶನ್‌ನಲ್ಲಿ ಸಹಾಯ ಮಾಡಬಹುದು.",
        "results_intro": "ನೀವು ಪರಿಶೀಲಿಸಿದ ಪ್ರೊಫೈಲ್ ಆಧಾರದಲ್ಲಿ ಉತ್ತಮ ಹೊಂದಾಣಿಕೆಗಳು:",
        "results_none": "ಪ್ರಸ್ತುತ ಪಟ್ಟಿಯಲ್ಲಿ ಉಪಯುಕ್ತ ಹೊಂದಾಣಿಕೆ ಸಿಗಲಿಲ್ಲ. Scheme Finderನಲ್ಲಿ ವಿವರ ಪರಿಶೀಲಿಸಿ Yojana GPS ಬಳಸಿ.",
        "eligible": "ಅರ್ಹ",
        "near": "ಸಮೀಪದ ಹೊಂದಾಣಿಕೆ",
        "results_note": "ಇದು ಮಾರ್ಗದರ್ಶನ ಮಾತ್ರ. ಅಧಿಕೃತ ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ಪ್ರಸ್ತುತ ನಿಯಮ ಪರಿಶೀಲಿಸಿ.",
        "explain_intro": "Yojana Disha ರಚನಾತ್ಮಕ ಅರ್ಹತಾ ಪರಿಶೀಲನೆಯ ಆಧಾರದಲ್ಲಿ {scheme} ಅನ್ನು {status} ಎಂದು ತೋರಿಸಲಾಗಿದೆ. ಇದು ಅಧಿಕೃತ ಅನುಮೋದನೆ ಅಲ್ಲ.",
        "passed_intro": "ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಪೂರೈಸಿದ ಪರಿಶೀಲನೆಗಳು:",
        "verify_intro": "ಇನ್ನೂ ಪರಿಶೀಲಿಸಿ:",
        "documents_intro": "{scheme} ಪ್ರಸ್ತುತ ಪರಿಶೀಲನಾಪಟ್ಟಿಯಲ್ಲಿ ಇವು ಸೇರಿವೆ:",
        "documents_note": "ಇದು ಸೂಚಕ ಪಟ್ಟಿ. ಅಂತಿಮ ಪಟ್ಟಿಯನ್ನು ಅಧಿಕೃತ ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ಪರಿಶೀಲಿಸಿ; Passport ದಾಖಲೆ ಪರಿಶೀಲನೆ ಬ್ರೌಸರ್‌ನಲ್ಲೇ ಇರುತ್ತದೆ.",
        "suggestions": ("ಯೋಜನೆ ಹುಡುಕಿ", "ಉತ್ತಮ ಹೊಂದಾಣಿಕೆ ವಿವರಿಸಿ", "ದಾಖಲೆ ಸಿದ್ಧಪಡಿಸಿ"),
    },
    "mr": {
        "greeting": "नमस्कार! मी दिशा AI आहे. वेबसाइटवर मार्गदर्शन करून तपासलेल्या प्रोफाइलवर योग्य योजना शोधण्यात मदत करते.",
        "help": "पात्रतेसाठी Scheme Finder, पुढील मार्गासाठी Yojana GPS आणि कागदपत्रांसाठी Document Passport वापरा.",
        "finder": "मी Scheme Finder उघडले आहे. माहिती आणि अंतिम पात्रता तपासण्या अचूक भरून ‘माझ्या योजना शोधा’ निवडा.",
        "finder_needed": "योजना सुचवण्यापूर्वी तपासलेले उद्योजक प्रोफाइल आवश्यक आहे. मी Scheme Finder उघडले आहे.",
        "gps": "मी Yojana GPS उघडले आहे. ते तुमचे जुळलेले पर्याय आणि व्यावहारिक पुढील पावले दाखवते.",
        "gps_needed": "Yojana GPS साठी आधी योजना जुळणे आवश्यक आहे. मी Scheme Finder उघडले आहे.",
        "passport": "मी Document Passport उघडले आहे. योजना निवडून कागदपत्र यादी पहा; फाइल्स याच ब्राउझरमध्ये राहतात.",
        "passport_needed": "Document Passport तुमच्या योजना जुळण्यावरून यादी बनवते. आधी Scheme Finder चालवा.",
        "dashboard": "मी डॅशबोर्ड उघडला आहे. येथे प्रगती आणि शिफारस केलेले पुढील पाऊल दिसते.",
        "privacy": "तुमचे प्रोफाइल फक्त या अॅपच्या matcherकडे जाते. अपलोड केलेली कागदपत्रे याच ब्राउझरमध्ये राहतात.",
        "apply": "सध्याचे नियम तपासण्यासाठी आणि अर्ज करण्यासाठी अधिकृत पोर्टल उघडा. Yojana Disha मार्गदर्शन देते, मंजुरी नाही.",
        "compare": "मी Yojana GPS मधील तुलना भाग उघडला आहे. दोन किंवा तीन योजना निवडून तुलना करा.",
        "no_message": "कृपया तुमचा प्रश्न लिहा.",
        "fallback": "मी योजना जुळवणी, पात्रता, पुढील पावले, कागदपत्रे, गोपनीयता आणि नेव्हिगेशनमध्ये मदत करू शकते.",
        "results_intro": "तपासलेल्या प्रोफाइलनुसार तुमचे सर्वात मजबूत पर्याय:",
        "results_none": "सध्याच्या यादीत उपयोगी जुळणी मिळाली नाही. Scheme Finderमधील माहिती तपासा आणि Yojana GPS वापरा.",
        "eligible": "पात्र",
        "near": "जवळचा पर्याय",
        "results_note": "हे मार्गदर्शन आहे. अधिकृत पोर्टलवर सध्याचे नियम तपासा.",
        "explain_intro": "Yojana Disha च्या संरचित पात्रता तपासणीनुसार {scheme} हे {status} दाखवले आहे. ही अधिकृत मंजुरी नाही.",
        "passed_intro": "तुमच्या प्रोफाइलमधून पूर्ण झालेल्या तपासण्या:",
        "verify_intro": "अजून पडताळा:",
        "documents_intro": "{scheme} च्या सध्याच्या यादीत हे दस्तावेज आहेत:",
        "documents_note": "ही सूचक यादी आहे. अंतिम यादी अधिकृत पोर्टलवर तपासा; Passport मधील दस्तावेज तपासणी ब्राउझरमध्येच राहते.",
        "suggestions": ("योजना शोधा", "चांगले पर्याय समजवा", "कागदपत्रे तयार करा"),
    },
}


KEYWORDS = {
    "greeting": ("hello", "hi", "hey", "namaste", "नमस्ते", "नमस्कार", "ನಮಸ್ಕಾರ"),
    "privacy": ("privacy", "private", "safe", "data", "store", "गोपनीय", "सुरक्षित", "डेटा", "ಗೌಪ್ಯ"),
    "explain": ("why", "explain", "reason", "near match", "क्यों", "समझा", "कारण", "का जुळ", "ಏಕೆ", "ವಿವರಿಸಿ"),
    "compare": ("compare", "comparison", "difference", "तुलना", "तुलनेसाठी", "ಹೋಲಿಕೆ", "ಹೋಲಿಸಿ"),
    "passport": ("document", "documents", "passport", "upload", "file", "कागदपत्र", "दस्तावेज", "फ़ाइल", "ದಾಖಲೆ"),
    "gps": ("gps", "route", "improve", "next step", "plan", "मार्ग", "पुढील", "अगला", "ಮುಂದಿನ"),
    "dashboard": ("dashboard", "home", "progress", "डैशबोर्ड", "डॅशबोर्ड", "प्रगती", "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್"),
    "apply": ("apply", "application", "official", "portal", "agent", "अर्ज", "आवेदन", "अधिकृत", "ಅರ್ಜಿ"),
    "scheme": ("scheme", "schemes", "eligible", "eligibility", "match", "recommend", "right", "योजना", "पात्र", "मैच", "जुळ", "पर्याय", "ಯೋಜನೆ", "ಅರ್ಹ", "ಹೊಂದಾಣಿಕೆ"),
    "help": ("help", "what can", "guide", "मदद", "मदत", "सहाय्य", "ಸಹಾಯ"),
}
DETAILED_EXPLANATION_KEYWORDS = (
    "why", "reason", "near match", "क्यों", "कारण", "का जुळ", "ಏಕೆ"
)


def _contains(message: str, intent: str) -> bool:
    return any(keyword in message for keyword in KEYWORDS[intent])


def _reply_for_matches(profile: dict[str, Any], copy: dict[str, Any]) -> AssistantReply:
    actionable = [result for result in match_profile(profile) if result["status"] != "NOT ELIGIBLE"]
    if not actionable:
        return AssistantReply(
            copy["results_none"],
            ("Review my profile", "Open Yojana GPS"),
            {"type": "navigate", "view": "matcher"},
        )

    lines = []
    for result in actionable[:3]:
        status = copy["eligible"] if result["status"] == "ELIGIBLE" else copy["near"]
        purpose = result.get("purpose", "").strip()
        detail = f" — {purpose}" if purpose else ""
        lines.append(f"{len(lines) + 1}. {result['short_name']} ({status}){detail}")
    reply = f"{copy['results_intro']}\n" + "\n".join(lines) + f"\n{copy['results_note']}"
    return AssistantReply(
        reply,
        ("Compare these schemes", "Prepare documents", "Open Scheme Finder"),
        {"type": "navigate", "view": "matcher"},
    )


def _selected_match(
    profile: dict[str, Any], selected_scheme_id: str | None
) -> dict[str, Any] | None:
    results = match_profile(profile)
    if selected_scheme_id:
        selected = next((result for result in results if result["id"] == selected_scheme_id), None)
        if selected:
            return selected
    return next((result for result in results if result["status"] != "NOT ELIGIBLE"), None)


def _reply_for_explanation(
    profile: dict[str, Any], copy: dict[str, Any], selected_scheme_id: str | None
) -> AssistantReply:
    result = _selected_match(profile, selected_scheme_id)
    if not result:
        return AssistantReply(
            copy["results_none"],
            ("Review my profile", "Open Yojana GPS"),
            {"type": "navigate", "view": "matcher"},
        )

    status = copy["eligible"] if result["status"] == "ELIGIBLE" else copy["near"]
    sections = [copy["explain_intro"].format(scheme=result["name"], status=status)]
    passed_checks = result.get("passed_checks", [])[:3]
    if passed_checks:
        sections.append(copy["passed_intro"] + "\n" + "\n".join(f"✓ {item}" for item in passed_checks))

    verification_items = result.get("failures", [])[:3]
    if verification_items:
        sections.append(copy["verify_intro"] + "\n" + "\n".join(f"• {item}" for item in verification_items))
    elif result.get("verification_required"):
        sections.append(f"{copy['verify_intro']}\n• {result['summary']}")

    sections.append(copy["results_note"])
    return AssistantReply(
        "\n\n".join(sections),
        ("What documents do I need?", "Compare these schemes", "What should I do next?"),
        {"type": "navigate", "view": "matcher"},
    )


def _reply_for_documents(
    profile: dict[str, Any], copy: dict[str, Any], selected_scheme_id: str | None
) -> AssistantReply:
    result = _selected_match(profile, selected_scheme_id)
    if not result:
        return AssistantReply(
            copy["passport_needed"], copy["suggestions"],
            {"type": "navigate", "view": "matcher"},
        )

    documents = result.get("required_documents", [])
    required = [item for item in documents if item.get("required")]
    visible = (required or documents)[:6]
    lines = [f"• {item.get('label', 'Document')}" for item in visible]
    document_text = "\n".join(lines) if lines else "• Confirm the scheme-specific checklist on the official portal."
    reply = (
        copy["documents_intro"].format(scheme=result["name"]) + "\n" +
        document_text + "\n\n" + copy["documents_note"]
    )
    return AssistantReply(
        reply,
        ("Open Document Passport", "Explain this match", "What should I do next?"),
        {"type": "navigate", "view": "passport"},
    )


def answer_assistant(
    message: str,
    *,
    language: str = "en",
    profile: dict[str, Any] | None = None,
    has_matches: bool = False,
    selected_scheme_id: str | None = None,
) -> dict[str, Any]:
    """Return a safe response and, when useful, a client navigation action."""
    lang = language if language in SUPPORTED_LANGUAGES else "en"
    copy = COPY[lang]
    normalized = " ".join(str(message or "").casefold().split())

    if not normalized:
        return AssistantReply(copy["no_message"], copy["suggestions"]).as_dict()

    if _contains(normalized, "privacy"):
        response = AssistantReply(copy["privacy"], copy["suggestions"])
    elif _contains(normalized, "explain") and profile:
        wants_selected_explanation = selected_scheme_id or any(
            keyword in normalized for keyword in DETAILED_EXPLANATION_KEYWORDS
        )
        response = (
            _reply_for_explanation(profile, copy, selected_scheme_id)
            if wants_selected_explanation
            else _reply_for_matches(profile, copy)
        )
    elif _contains(normalized, "compare"):
        key = "compare" if has_matches else "gps_needed"
        view = "gps" if has_matches else "matcher"
        action = {"type": "navigate", "view": view}
        if has_matches:
            action["target"] = "gps-compare-search"
        response = AssistantReply(copy[key], copy["suggestions"], action)
    elif _contains(normalized, "passport"):
        if profile and has_matches:
            response = _reply_for_documents(profile, copy, selected_scheme_id)
        else:
            key = "passport" if has_matches else "passport_needed"
            view = "passport" if has_matches else "matcher"
            response = AssistantReply(copy[key], copy["suggestions"], {"type": "navigate", "view": view})
    elif _contains(normalized, "gps"):
        key = "gps" if has_matches else "gps_needed"
        view = "gps" if has_matches else "matcher"
        response = AssistantReply(copy[key], copy["suggestions"], {"type": "navigate", "view": view})
    elif _contains(normalized, "dashboard"):
        response = AssistantReply(copy["dashboard"], copy["suggestions"], {"type": "navigate", "view": "dashboard"})
    elif _contains(normalized, "apply"):
        response = AssistantReply(copy["apply"], ("Show my matches", "Prepare documents"))
    elif _contains(normalized, "scheme"):
        if profile:
            response = _reply_for_matches(profile, copy)
        else:
            response = AssistantReply(
                copy["finder_needed"],
                ("Guide me step by step", "Open Scheme Finder"),
                {"type": "navigate", "view": "matcher"},
            )
    elif _contains(normalized, "greeting"):
        response = AssistantReply(copy["greeting"], copy["suggestions"])
    elif _contains(normalized, "help"):
        response = AssistantReply(copy["help"], copy["suggestions"])
    else:
        response = AssistantReply(copy["fallback"], copy["suggestions"])

    return response.as_dict()
