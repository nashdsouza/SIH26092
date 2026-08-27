# SIH26092

## AI-Driven Scheme Matching for Marginalized Entrepreneurs

A platform that helps marginalized entrepreneurs discover government schemes they may be eligible for by comparing their personal and business profiles against structured eligibility rules.

## Core Flow

Entrepreneur Profile
→ Eligibility Engine
→ Scheme Matching
→ Ranking
→ Explainability
→ Scheme Details
→ Next Steps

## Document verification

Yojana Passport can check uploaded PDF, JPG and PNG files in the browser. It
uses OCR to read visible text, compares that text with the selected checklist
item, and marks each file as verified or needing review. Recognised text is
not stored or sent to the Flask API. This is a document-type check, not proof
that a document is genuine or issued by a government authority.

## Project Status

Working prototype with local scheme matching, route planning, document
checklists and browser-side document verification.

## Scheme catalogue and QA

The website uses `backend/schemes.json` as its live catalogue. It includes
active SC/ST-specific routes from NSSH, NSFDC, NSTFDC, VCF-SC/VCF-ST,
PM-DAKSH, PM-AJAY, NAMASTE, procurement and complementary MSME programmes.
Superseded or announced-but-not-operational schemes are retained only in the
research workbook and are filtered from live recommendations.

Run the regression and API smoke tests with:

```powershell
python -m unittest discover -s backend -p "test_*.py" -v
```
