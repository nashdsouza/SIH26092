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

## Run locally

Install Python 3.10 or newer, then install the dependencies once:

```powershell
python -m venv .venv
.venv\Scripts\python -m pip install -r backend/requirements.txt
```

From the repository root, start the local Flask server:

```powershell
.venv\Scripts\python backend/app.py
```

Open [http://127.0.0.1:5001/](http://127.0.0.1:5001/) in a browser. The server
binds to localhost only; no account or external API key is required.

On macOS or Linux, use `.venv/bin/python` in place of `.venv\Scripts\python`.

## Run in VS Code

1. Open this repository folder in VS Code and install the recommended Python and Python Debugger extensions.
2. Create the virtual environment using the commands above. Run **Python: Select Interpreter** from the Command Palette and select `.venv`.
3. Press **F5** and choose **Yojana Disha: run website**. Dependencies are checked automatically and the browser opens when the server is ready.
4. Stop the debugger before starting another copy of the server; the website uses port **5001**.

Use **Tasks: Run Test Task** to run the backend tests. Serve the site through Flask, rather than opening the HTML file or using Live Server: scheme matching needs the `/api` routes on the same server.

## Interface

The interface retains the original Yojana Disha names and blue/navy identity.
Start by choosing whether you are starting, growing, or exploring a business.
Scheme Finder groups questions into short sections, shows relevant conditional
fields, and includes a review before matching. Answers survive a refresh in the
same tab using session storage; **Clear answers** removes that draft.

Results show the first three matches with other matches available on demand.
Each match opens its own Document Passport checklist. Yojana GPS retains route
previews, comparisons, and what-if scenarios, with advanced controls in
expandable sections. Dashboard progress, Disha AI, document OCR, downloads,
and shared results remain available.

English, Hindi, Kannada, and Marathi are supported. Browser Back/Forward,
Ctrl/Cmd+K navigation and scheme search, visible keyboard focus, a skip link,
reduced-motion support, and recoverable API errors are included.

## Document verification

Yojana Passport can check uploaded PDF, JPG and PNG files in the browser. It
uses OCR to read visible text, compares that text with the selected checklist
item, and marks each file as verified or needing review. Recognised text is
not stored or sent to the Flask API. This is a document-type check, not proof
that a document is genuine or issued by a government authority.

## Project Status

Working prototype with local scheme matching, route planning, document
checklists, browser-side document verification, and a floating Disha AI
assistant. The assistant provides grounded navigation help, offers a guided
profile setup in all four interface languages, and explains recommendations
from the same deterministic matcher used by Scheme Finder.

Disha AI's automatic-journey action evaluates a completed profile, builds the
GPS route, and opens the best-match Document Passport checklist. If required
answers are missing, it starts guided profile setup. Merely opening the helper
does not run matches on assumed personal details. It never fabricates missing
documents or claims to submit an official application.

The assistant does not claim that a user is approved. It leaves unconfirmed
special eligibility statements unticked and directs users to each scheme's
official portal for current rules.

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

For browser journey and automated accessibility checks, keep Flask running,
then use Node.js 20 or newer:

```powershell
npm ci
npx playwright install chromium
npm run test:ux
```

To use an installed Edge browser instead of downloading Chromium:

```powershell
$env:BROWSER_CHANNEL = "msedge"
npm run test:ux
```

The checks cover real profile entry, validation, conditional questions, draft
restoration, review, slow/failed requests, retry, scheme shortlists, documents,
route scenarios, sharing, empty results, keyboard navigation, four languages,
and six viewport sizes. Screenshots and an axe accessibility report are written
to `outputs/ux/`. Automated accessibility checks complement manual review;
they do not constitute a complete accessibility certification.
