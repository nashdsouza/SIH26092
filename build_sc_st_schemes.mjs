import fs from "node:fs/promises";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const outputDir = "C:\\Users\\HP\\Documents\\GitHub\\SIH26092\\outputs\\sc_st_schemes_20260827";
await fs.mkdir(outputDir, { recursive: true });

const verified = new Date(2026, 7, 27);

const schemes = [
  ["SCST-01", "National SC-ST Hub", "NSSH", "Ministry of MSME / NSIC", "SC and ST", "Aspiring and existing SC/ST entrepreneurs; MSEs", "Umbrella / handholding", "Active; current cycle through 31-Mar-2026; continuation subject to review", "Portal / NSSH offices", "Build capacity, improve competitiveness, create market and credit linkages, and help SC/ST MSEs participate in public procurement.", "Handholding; mentoring; training; vendor development; exhibitions; credit linkage; reimbursements; access to public procurement.", "No single cash ceiling; component-specific support.", "SC/ST entrepreneur or SC/ST-owned MSE; component-specific enterprise, Udyam and procurement conditions.", "Confirm the relevant component, ownership definition, Udyam status, local NSSH office and current intake.", "Caste certificate; Udyam registration; KYC; business profile; component-specific proofs.", "Apply / enquire through NSSH portal, NSSH office or NSIC / implementing agency.", "https://scsthub.in/", "https://msme.gov.in/sites/default/files/Scheme-booklet-Eng.pdf", "Guideline / official portal", "Program-level; do not treat as one flat benefit.", "Must-have for SC/ST procurement and support journey"],
  ["SCST-02", "Special Credit Linked Capital Subsidy Scheme", "SCLCSS", "Ministry of MSME", "SC and ST", "SC/ST-owned micro and small enterprises", "Credit-linked capital subsidy", "Active on official portal; verify current intake", "Prime Lending Institution / SCLCSS MIS", "Technology enablement and expansion through purchase of new plant, machinery or equipment using institutional term credit.", "25% subsidy on eligible institutional finance for plant and machinery/equipment, up to a subsidy cap of ₹25 lakh; finance base up to ₹1 crore.", "25% subsidy; subsidy cap ₹25 lakh; eligible institutional finance up to ₹1 crore.", "SC/ST-owned MSE; manufacturing or service sector; new eligible plant/machinery/equipment; term loan from eligible PLI.", "Ownership and SC/ST control definition; eligible NIC activity; new equipment; PLI and document checklist.", "SC/ST certificate; Udyam registration; DPR; equipment quotations; term-loan application/sanction; bank documents.", "Apply through the bank / PLI; bank or nodal agency uploads claim to SCLCSS portal.", "https://sclcss.msme.gov.in/", "https://sclcss.msme.gov.in/Manual/Guidelines.pdf", "Guideline / official portal", "Directly modelable with capital-expenditure and category rules.", "Top match for technology upgrade or equipment purchase"],
  ["SCST-03", "NSSH Special Marketing Assistance Scheme", "NSSH-SMAS", "Ministry of MSME / NSIC", "SC and ST", "SC/ST MSEs and aspiring entrepreneurs", "Market access / reimbursement", "Active component; verify current window", "NSSH / NSIC / implementing partner", "Expand market access through exhibitions, vendor development programmes, buyer-seller meets and public procurement linkages.", "Marketing, exhibition and vendor development support; exact reimbursement or event rules vary by current component guidelines.", "Component-specific; amount and eligible expenses vary.", "SC/ST-owned MSE or eligible aspiring entrepreneur; activity/event and documentation conditions apply.", "Confirm event eligibility, reimbursement caps, registration, invoices and participation conditions.", "Udyam registration; SC/ST ownership proof; invoices; event registration; business profile.", "Through NSSH / NSIC announcements and participating events.", "https://scsthub.in/", "https://www.msme.gov.in/sites/default/files/MSME-ANNUAL-REPORT-2024-25-ENGLISH.pdf", "Annual report / official portal", "Program-level; support is opportunity-based, not automatic.", "Useful for market-linkage recommendations"],
  ["SCST-04", "NSSH Competitiveness Reimbursements", "NSSH-REIMBURSE", "Ministry of MSME / NSIC", "SC and ST", "SC/ST MSEs", "Reimbursement / competitiveness support", "Active component; verify current window", "NSSH / NSIC", "Reduce entry costs for formalisation, testing, export readiness and public-procurement participation.", "Potential reimbursement of bank loan processing fee, performance bank guarantee charges, testing fees, export-promotion council membership, government e-commerce portal membership and NSIC SPRS registration fee.", "Component-specific reimbursements; no single universal ceiling in summary source.", "Eligible SC/ST MSE; expense and claim must fit the notified component rules.", "Confirm eligible expense, invoice date, claim timing, caps and portal process.", "Udyam; SC/ST certificate; invoices/receipts; bank or membership documents.", "Through NSSH / NSIC component process.", "https://scsthub.in/", "https://www.msme.gov.in/sites/default/files/MSME-ANNUAL-REPORT-2024-25-ENGLISH.pdf", "Annual report / official portal", "Do not combine with SCLCSS; separate reimbursement pathway.", "Helps lower onboarding friction in product"],
  ["SCST-05", "NSSH Capacity Building and Entrepreneurship Development", "NSSH-TRAINING", "Ministry of MSME / NSIC", "SC and ST", "Existing and prospective SC/ST entrepreneurs", "Training / handholding", "Active component; verify schedule", "NSSH offices / training institutions", "Build technical, managerial and tender-readiness capabilities for SC/ST entrepreneurs.", "Free or supported skill, entrepreneurship development, tender-readiness, mentoring and handholding activities; schedules vary.", "Training support; no single cash ceiling.", "SC/ST target group; course-specific selection and attendance requirements.", "Verify course, location, dates, seats and completion requirements.", "SC/ST certificate; KYC; education/experience details where course requires.", "Through NSSH offices, NSIC and notified training institutions.", "https://scsthub.in/", "https://www.msme.gov.in/sites/default/files/MSME-ANNUAL-REPORT-2024-25-ENGLISH.pdf", "Annual report / official portal", "Training opportunity; not a loan or subsidy.", "Useful pre-application next step"],
  ["SCST-06", "Public Procurement Policy for MSEs", "PPP-MSE", "Ministry of MSME", "SC and ST", "MSEs supplying Central Ministries, Departments and CPSEs", "Market access / policy", "Active policy", "Central procurement portals and buyer organisations", "Open a route into government markets through MSE procurement targets and SC/ST sub-target.", "Annual procurement target of 25% from MSEs, including a 4% sub-target from SC/ST-owned MSEs; tender sets free, EMD exemption and other MSE benefits subject to registration and tender rules.", "25% overall MSE target; 4% SC/ST-owned MSE sub-target.", "MSE status; SC/ST ownership definition; procurement/tender-specific compliance.", "Confirm tender, product/service eligibility, registration, technical qualification and buyer-specific conditions.", "Udyam; SC/ST ownership proof; product/service documents; NSIC SPRS or tender registration where applicable.", "Bid through the relevant Central Ministry / CPSE procurement route; use MSME portals.", "https://www.msme.gov.in/public-procrument-policy", "https://my.msme.gov.in/MyMsme/Reg/PPP_Home.aspx", "Policy / official portal", "Market-access policy; not direct finance.", "High-value route after enterprise formalisation"],
  ["SCST-07", "Single Point Registration Scheme", "NSIC-SPRS", "NSIC / Ministry of MSME", "SC and ST benefit within MSE procurement", "Micro and small enterprises", "Registration / procurement access", "Active scheme; verify fee and certificate terms", "NSIC SPRS / procurement", "Register eligible MSEs for participation in government purchases.", "Free tender sets, EMD exemption, L1+15% purchase preference mechanics and access to PPP-MSE benefits; NSSH can reimburse registration fee for eligible SC/ST enterprises where notified.", "No universal cash benefit; procurement benefits are rule-based.", "MSE that has commenced commercial production; registration, inspection and turnover/product conditions apply.", "Confirm commercial production, product/service scope, certificate validity and current NSIC process.", "Udyam / MSE registration; KYC; ownership proof; product/service and financial documents.", "Apply online or through NSIC zonal / branch office.", "https://my.msme.gov.in/MyMsmeMob/MsmeScheme/Pages/1_2_3.html", "https://www.msme.gov.in/sites/default/files/MSME-ANNUAL-REPORT-2024-25-ENGLISH.pdf", "Official scheme page / annual report", "SC/ST is a priority benefit within a broader MSE registration.", "Procurement onboarding step"],
  ["SCST-08", "Venture Capital Fund for Scheduled Castes", "VCF-SC", "Ministry of Social Justice and Empowerment / IFCI Venture", "SC", "SC entrepreneurs, growth-oriented companies and startups", "Venture capital / concessional finance", "Active guidelines through 31-Mar-2026; verify new cycle", "IFCI Venture Capital Funds Ltd.", "Provide concessional finance to innovation- and growth-oriented SC enterprises and support asset-creating ventures.", "Concessional finance typically from ₹10 lakh to ₹15 crore; interest around 4% p.a. and concessional terms for eligible women and Divyang SC entrepreneurs per current government communication.", "₹10 lakh–₹15 crore; around 4% p.a.; term-specific conditions.", "SC promoter/entrepreneur; company or eligible entity; viable growth/innovation proposal; promoter contribution and due diligence.", "Investment committee appraisal, promoter ownership/control, project viability, securities and fund availability require verification.", "SC certificate; incorporation and ownership documents; pitch/DPR; financials; KYC; promoter contribution proof.", "Apply / engage through IFCI Venture / fund process.", "https://www.ifciventure.com/venture-capital-fund-scheduled-castes-vcf-sc-and-venture-capital-fund-backward-classes-vcf-bc.aspx", "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2209488&lang=1&reg=1", "Fund manager / PIB", "Investment product; not a grant and not suitable for every micro-enterprise.", "Startup / scale-up pathway"],
  ["SCST-09", "Ambedkar Social Innovation and Incubation Mission", "ASIIM", "Ministry of Social Justice and Empowerment / IFCI Venture", "SC", "SC students, researchers and startup innovators", "Incubation / concessional finance", "Active as a VCF-SC initiative; verify current cohort", "IFCI Venture / incubation ecosystem", "Promote innovation among SC students and innovators through incubation and concessional finance.", "Concessional finance up to ₹30 lakh for eligible youth beneficiaries, with incubation / mentoring route and selection conditions.", "Up to ₹30 lakh; cohort and selection based.", "SC innovator or eligible student/researcher; innovation/startup through supported incubation ecosystem; due diligence.", "Confirm incubator route, innovation stage, promoter ownership, valuation and current call for applications.", "SC certificate; innovation/pitch deck; incubation or institute proof; KYC; business plan.", "Through IFCI Venture / participating incubators and notified calls.", "https://www.ifciventure.com/venture-capital-fund-scheduled-castes-vcf-sc-and-venture-capital-fund-backward-classes-vcf-bc.aspx", "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2209488&lang=1&reg=1", "Fund manager / PIB", "Treat as startup incubation pathway, not a universal SC loan.", "Best for tech / innovation profiles"],
  ["SCST-10", "Credit Enhancement Guarantee Scheme for Scheduled Castes", "CEGSSC", "Ministry of Social Justice and Empowerment / IFCI", "SC", "SC-promoted enterprises and young/startup entrepreneurs", "Credit guarantee", "Listed by Department; availability must be verified with IFCI", "IFCI / member lending institutions", "Encourage banks and financial institutions to lend to SC entrepreneurs through credit-enhancement guarantees.", "Guarantee support for eligible collateral-free or third-party-guarantee-free credit facilities; historical guidelines describe facilities from ₹25 lakh and guarantee cover up to ₹5 crore.", "Historical guideline: credit facilities ₹25 lakh+; maximum guarantee cover up to ₹5 crore.", "SC promoter ownership/control; eligible company, partnership or sole proprietorship; lender and project conditions.", "Confirm current scheme operation, MLI onboarding, ownership threshold, guarantee fee and live application route.", "SC certificate; incorporation/partnership documents; project report; lender application; financials.", "Through IFCI / registered member lending institution; check live fund manager portal.", "https://socialjustice.gov.in/schemes/32", "https://www.ifcicegssc.in/", "Department page / fund manager", "Availability and live parameters need manual verification.", "Large-ticket SC credit route"],
  ["SCST-11", "NSFDC Term Loan Scheme", "NSFDC-TL", "National Scheduled Castes Finance & Development Corporation", "SC", "SC individuals / eligible entities seeking income-generating activity", "Concessional term loan", "Active; income ceiling effective 07-Jan-2026 per FAQ", "State Channelising Agencies / PM-SURAJ / other channelising agencies", "Finance larger viable income-generating projects for eligible SC beneficiaries.", "Projects above ₹1.40 lakh and up to ₹50 lakh; up to 90% of project cost; beneficiary rate around 8% p.a. for the primary term-loan band in current FAQ.", "Project cost up to ₹50 lakh; loan up to ₹45 lakh; up to 90%; rate around 8% p.a.; repayment up to 7 years.", "SC certificate; annual family income not exceeding ₹5 lakh for loans; viable project; SCA/CA and lender conditions.", "Confirm exact product, SCA, promoter contribution, activity, rate and repayment terms at application.", "SC certificate; income certificate; KYC; DPR; bank details; quotations.", "Apply through authorised State Channelising Agency / CA or PM-SURAJ.", "https://nsfdc.nic.in/faqs", "https://socialjustice.gov.in/schemes/34", "Official FAQ / Department page", "Direct individual scheme; highly relevant for SC matching.", "Core SC finance pathway"],
  ["SCST-12", "NSFDC Micro Finance Scheme", "NSFDC-MFS", "National Scheduled Castes Finance & Development Corporation", "SC", "SC beneficiaries for small business activities", "Micro-credit", "Active; verify channel and product terms", "State Channelising Agencies / channelising agencies", "Provide small-ticket micro-credit for self-employment and business activities.", "Units costing up to ₹1.40 lakh; maximum loan around ₹1.25 lakh; beneficiary rate around 6.5% p.a.; repayment within 3 years including moratorium per current FAQ.", "Project cost up to ₹1.40 lakh; loan up to ₹1.25 lakh; up to 90% of project cost.", "SC certificate; annual family income not exceeding ₹5 lakh for loans; viable small activity; SCA/CA conditions.", "Confirm current rate, contribution, channel, repeat-loan and activity conditions.", "SC certificate; income proof; KYC; simple business plan; bank details.", "Through authorised SCA / CA or PM-SURAJ route where available.", "https://nsfdc.nic.in/faqs", "https://nsfdc.nic.in/", "Official FAQ / official portal", "Direct individual scheme; use for micro-projects.", "Micro-business entry point"],
  ["SCST-13", "NSFDC Aajeevika Micro-Finance Yojana", "NSFDC-AMY", "National Scheduled Castes Finance & Development Corporation", "SC", "SC beneficiaries through selected NBFC-MFIs", "Micro-finance", "Active; verify selected NBFC-MFI availability", "Selected NBFC-MFIs", "Provide prompt and need-based micro-finance for small income-generating activities.", "Projects costing up to ₹1.40 lakh; maximum loan around ₹1.25 lakh; beneficiary rate around 15% p.a.; repayment within 3 years including moratorium per current FAQ.", "Project cost up to ₹1.40 lakh; loan up to ₹1.25 lakh.", "SC certificate; annual family income not exceeding ₹5 lakh for loans; selected NBFC-MFI and borrower conditions.", "Confirm selected NBFC-MFI, rate, documentation and local availability.", "SC certificate; income proof; KYC; business activity and bank details.", "Through selected NBFC-MFIs / authorised channel.", "https://nsfdc.nic.in/faqs", "https://nsfdc.nic.in/", "Official FAQ / official portal", "Direct individual scheme; compare with NSFDC MFS by channel and rate.", "Alternative micro-finance route"],
  ["SCST-14", "NSFDC Udyam Nidhi Yojana", "NSFDC-UNY", "National Scheduled Castes Finance & Development Corporation", "SC", "SC beneficiaries for small/micro activities", "Concessional loan", "Active; verify cooperative / SFB route", "Cooperative societies, cooperative banks and SFBs", "Provide credit for small and micro income-generating activities.", "Projects up to ₹5 lakh; maximum loan around ₹4.50 lakh; current FAQ lists beneficiary rates around 13% through cooperative routes and 15% through SFBs, with repayment within 5 years.", "Project cost up to ₹5 lakh; loan up to ₹4.50 lakh.", "SC certificate; annual family income not exceeding ₹5 lakh for loans; viable activity; channelising-lender conditions.", "Confirm lender route, current rate, contribution, collateral and local product availability.", "SC certificate; income proof; KYC; DPR/business plan; bank details.", "Through eligible cooperative societies, cooperative banks or SFBs.", "https://nsfdc.nic.in/faqs", "https://nsfdc.nic.in/", "Official FAQ / official portal", "Direct individual scheme; product terms vary by lender.", "Small equipment / working capital route"],
  ["SCST-15", "NSFDC Skill Development and Entrepreneurship Support", "NSFDC-SKILL", "National Scheduled Castes Finance & Development Corporation", "SC", "SC candidates / aspiring entrepreneurs", "Training / EDP", "Active via NSFDC / PM-DAKSH ecosystem; verify course", "NSFDC, training partners, PM-DAKSH", "Develop skills and entrepreneurship capabilities that lead to wage or self-employment.", "Free or supported skill and entrepreneurship development programmes; course content, stipend and eligibility vary by route.", "Training support; no single cash ceiling.", "SC candidates; age, course and document conditions; PM-DAKSH commonly 18–45 with no SC income ceiling.", "Confirm whether course is NSFDC-sponsored or PM-DAKSH, current batch and stipend rules.", "SC certificate; KYC; age proof; education / course prerequisites.", "Through NSFDC, PM-DAKSH portal or notified training partner.", "https://nsfdc.nic.in/faqs", "https://socialjustice.gov.in/schemes/100", "Official FAQ / Department page", "Training is a pipeline enabler, not direct finance.", "Prepares users for later matches"],
  ["SCST-16", "Scheme of Assistance to Scheduled Castes Development Corporations", "SCDC-ASSIST", "Department of Social Justice and Empowerment", "SC", "State-level SC Development Corporations and SC families via state projects", "State channel / margin money / subsidy", "Active centrally sponsored framework; state implementation varies", "State Scheduled Castes Development Corporations", "Support state corporations that identify SC families, sponsor credit and provide margin money, subsidy and programme convergence.", "State-level credit sponsorship, margin money at low interest, subsidy and linkages with poverty-alleviation programmes; exact benefit is state-specific.", "State and project-specific; no single national individual ceiling.", "SC family / state programme / poverty and local criteria; SCDC and lender rules.", "State-specific rules, ceilings, documents and availability must be verified.", "Caste/income/residence proof; project report; KYC; state scheme forms.", "Through the relevant State SC Development Corporation or district office.", "https://socialjustice.gov.in/schemes/36", "https://nsfdc.nic.in/", "Department page / official portal", "Program-level; state rules are essential.", "Bridge to state scheme expansion"],
  ["SCST-17", "PM-DAKSH Yojana", "PM-DAKSH", "Department of Social Justice and Empowerment", "SC and sanitation-worker groups; also OBC/EWS/DNT", "SC candidates aged 18–45 and other target groups", "Training / entrepreneurship development", "Active; current corrigendum through 31-Dec-2026", "PM-DAKSH portal / empanelled training centres", "Provide high-quality skilling, reskilling and EDP support leading to self- or wage employment.", "Free training; SC candidates get ₹1,500/month stipend for non-residential training per official page; training cost borne as per common norms.", "Free training; SC stipend ₹1,500/month for non-residential training.", "SC candidate; age 18–45; caste certificate; course and attendance conditions.", "Confirm course, training centre, stipend mode, batch dates and any updated guideline.", "SC certificate; Aadhaar/KYC; age proof; education/course documents.", "Apply through PM-DAKSH portal or notified training centres.", "https://socialjustice.gov.in/schemes/100", "https://pmdaksh.dosje.gov.in/", "Official scheme page / official portal", "Training opportunity; not a finance scheme.", "Strong recommendation before loan application"],
  ["SCST-18", "Pradhan Mantri Anusuchit Jaati Abhyuday Yojana", "PM-AJAY", "Department of Social Justice and Empowerment", "SC", "SC families, communities, state/district projects", "Livelihood grant / skill / infrastructure", "Active; 2026–27 state plans visible on official portal", "State / district implementing agencies", "Reduce poverty through livelihood projects, skill development and critical infrastructure in SC-dominated villages.", "Comprehensive livelihood projects can include skill, infrastructure and financial assistance toward beneficiary loans for assets; the scheme does not allow standalone individual asset distribution.", "Current portal says asset-loan support up to ₹50,000 or 50% of asset cost, whichever is less, under comprehensive projects; state project-specific.", "SC persons/households under state/district project criteria; village and poverty criteria vary by component.", "Confirm state Annual Action Plan, project selection, local agency and whether individual asset is within a comprehensive project.", "Caste, income/BPL or local selection proof; project plan; KYC; state forms.", "Via State/District implementing agencies and PM-AJAY portal; not ordinary direct national loan application.", "https://pmajay.dosje.gov.in/content/about-scheme", "https://pmajay.dosje.gov.in/content/income-generating-schemes", "Official portal / component page", "Indirect / project-level; must not be shown as guaranteed individual cash benefit.", "Community/project pathway"],
  ["SCST-19", "National Action for Mechanised Sanitation Ecosystem", "NAMASTE", "Department of Social Justice and Empowerment + MoHUA", "Sanitation workers, SSWs, waste pickers and dependents; many beneficiaries are SC", "Individual sanitation workers and SHGs / groups", "Capital subsidy / safety / enterprise", "Active; current scheme documents on official portal", "ULBs / NSKFDC / NAMASTE portal", "Formalise and rehabilitate sanitation workers through safety, training, mechanisation and entrepreneurship.", "Upfront capital subsidy for sanitation-related projects: 50% up to ₹5 lakh; ₹2.5 lakh + 25% of balance for ₹5–15 lakh; group projects up to ₹50 lakh with per-member and group caps per FAQ.", "Individual project up to ₹15 lakh; group project up to ₹50 lakh; individual subsidy max ₹3.75 lakh under group structure; exact guideline applies.", "Profiled/identified sanitation worker, SSW, waste picker or dependent; project and ULB/NSKFDC conditions.", "Confirm profiling, ULB coverage, project type, group formation and current subsidy formula.", "Worker/profile proof; KYC; project report; quotations; group/SHG documents where applicable.", "Through ULBs, NSKFDC / NAMASTE implementation route.", "https://socialjustice.gov.in/schemes/37/archive", "https://bmsnamaste.dosje.gov.in/", "Official scheme page / portal", "Targeted livelihood pathway; not a general SC/ST entrepreneur scheme.", "Specialised sanitation-entrepreneur route"],
  ["SCST-20", "NSTFDC Term Loan Scheme", "NSTFDC-TL", "National Scheduled Tribes Finance & Development Corporation", "ST", "ST individuals and eligible entities", "Concessional term loan", "Active; current official scheme page", "State Channelising Agencies / RRBs / partner banks", "Finance viable income-generating ventures in industrial, agricultural and service sectors for ST beneficiaries.", "Viable projects up to ₹50 lakh; NSTFDC term loan up to 90% of unit cost; beneficiary interest rates listed as 6%, 8% and 10% bands; repayment up to 5 years including moratorium.", "Unit cost up to ₹50 lakh; up to 90% of unit cost; 6–10% beneficiary rate bands.", "ST community; annual family income ceiling and residence/tribe notification rules; viable project; SCA/lender conditions.", "Confirm current income ceiling, notified tribe in state/UT, SCA, promoter contribution and lender terms.", "ST certificate; income proof; residence proof; DPR; KYC; quotations; bank details.", "Through authorised SCA, RRB or partner bank.", "https://nstfdc.tribal.gov.in/", "https://nstfdc.tribal.gov.in/(S(k24fnvmki5kgvv0jxhzzeqaj))/frm_term_loan.aspx", "Official portal / scheme page", "Direct individual scheme; state/tribe verification is critical.", "Core ST finance pathway"],
  ["SCST-21", "Adivasi Mahila Sashaktikaran Yojana", "NSTFDC-AMSY", "National Scheduled Tribes Finance & Development Corporation", "ST women", "ST women entrepreneurs", "Concessional term loan", "Active; verify current SCA route", "State Channelising Agencies", "Provide highly concessional finance for economic development of ST women.", "Projects up to ₹2 lakh; up to 90% term loan; beneficiary rate 4% p.a. for loans up to ₹1 lakh in current official page; repayment up to 5 years.", "Unit cost up to ₹2 lakh; up to 90%; 4% p.a. for up to ₹1 lakh loan band.", "ST woman; annual family income ceiling and state/tribe residence rules; SCA conditions.", "Confirm current product band, income ceiling, promoter contribution and SCA availability.", "ST certificate; gender/identity proof; income proof; KYC; project plan; bank details.", "Through authorised SCA.", "https://nstfdc.tribal.gov.in/(S(wdobvikapdpuryzvigs1rpn5))/PublicView_Hindi/frm_amsy.aspx", "https://nstfdc.tribal.gov.in/", "Official scheme page / official portal", "Direct individual scheme; current rate/product must be verified.", "Strong gender + ST match"],
  ["SCST-22", "NSTFDC Micro Credit Scheme for Self Help Groups", "NSTFDC-MCS", "National Scheduled Tribes Finance & Development Corporation", "ST", "ST-member SHGs", "Micro-credit", "Active; verify SCA / bank route", "State Channelising Agencies / partner banks", "Meet small loan requirements of ST members through eligible self-help groups.", "Up to ₹50,000 per member and ₹5 lakh per SHG; official page lists 3% SCA rate and 6% beneficiary rate; repayment up to 4 years at SCA level including moratorium.", "₹50,000 per member; ₹5 lakh per SHG.", "All members ST; existing profit-making SHG requirement under SCA route; state/tribe residence and income conditions.", "Confirm SHG age, profitability, member mix, repeat-loan and local SCA rules.", "ST certificates for members; SHG records; bank account; activity plan; income/residence proof.", "Through authorised SCA / partner bank.", "https://nstfdc.tribal.gov.in/(S(xdrrv2dggok25j0gjxerotfo))/PublicView_Hindi/frm_mcs.aspx", "https://nstfdc.tribal.gov.in/", "Official scheme page / official portal", "Group pathway; do not treat as individual loan.", "ST collective enterprise route"],
  ["SCST-23", "NSTFDC Bridge Loan", "NSTFDC-BRIDGE", "National Scheduled Tribes Finance & Development Corporation", "ST", "ST entrepreneurs arranging permanent finance", "Short-term bridge loan", "Active page; verify current availability", "NSTFDC / SCA / lender", "Bridge a short-term funding gap while the entrepreneur arranges permanent financing or subsidy.", "Income-generation schemes costing up to ₹25 lakh per unit; short-term loan up to one year at term-loan interest rate, with security/conditions as applicable.", "Unit cost up to ₹25 lakh; tenure up to 1 year.", "Eligible ST entrepreneur; credible permanent-finance/subsidy pathway; lender/SCA appraisal.", "Confirm collateral/security, lender sequencing, rate, repayment and availability before matching.", "ST certificate; bridge need evidence; permanent finance application; project report; KYC.", "Through NSTFDC/SCA route; manual verification required.", "https://nstfdc.tribal.gov.in/(S(hlyifbi1ytbrmo53mxcku52t))/frm_bridge_loan.aspx", "https://nstfdc.tribal.gov.in/", "Official scheme page / official portal", "Specialised short-term product; do not rank above ordinary term loan without a financing gap.", "Financing-gap pathway"],
  ["SCST-24", "Venture Capital Fund for Scheduled Tribes", "VCF-ST", "Ministry of Tribal Affairs / IFCI Venture", "ST", "ST entrepreneurs, startups and incubated ideas", "Venture capital / concessional finance", "Active; launched 10-Feb-2024; verify current call", "IFCI Venture / VCF-ST", "Promote ST entrepreneurship, startups and innovative ideas through concessional finance, equity and/or credit support.", "Concessional finance at around 4% p.a. on official fund portal; initial corpus ₹50 crore; supports startups, incubators and technology/business ideas subject to fund rules.", "Around 4% p.a.; initial corpus ₹50 crore; project/investment-specific.", "ST-promoted company or startup; innovation/growth and asset creation; fund appraisal and promoter conditions.", "Confirm ownership, project stage, investment form, security, valuation, current call and fund availability.", "ST certificate; incorporation/ownership; pitch/DPR; financials; promoter contribution; KYC.", "Apply online or through IFCI Venture / VCF-ST process.", "https://www.vcfst.in/", "https://tribal.nic.in/Livelihood.aspx", "Fund manager / Ministry page", "Investment product; not a universal micro-enterprise loan.", "ST startup / scale-up pathway"],
  ["SCST-25", "Pradhan Mantri Janjatiya Vikas Mission / Van Dhan", "PMJVM-VD", "Ministry of Tribal Affairs / TRIFED", "ST", "Tribal SHGs, producer enterprises, MFP collectors and tribal entrepreneurs", "Cluster / value-chain / market support", "Active; current PMJVM / Van Dhan ecosystem", "TRIFED / State implementing agencies / VDVKs", "Create tribal community-owned value chains, add value to minor forest produce and connect tribal producers to markets.", "Training in value addition and enterprise management; equipment, branding, marketing, logistics and buyer linkages; VDVKs can evolve into Van Dhan Producer Enterprises.", "Project / cluster-specific; no single individual cash ceiling.", "Tribal SHG / group / producer enterprise; approved VDVK/VDPE and state implementation conditions.", "Confirm local VDVK/VDPE, eligible MFP/product, state nodal agency, group structure and current project window.", "ST/group proof; SHG records; product/activity evidence; bank details; business plan.", "Through TRIFED, VDVK/VDPE, State Tribal Development agencies.", "https://trifed.tribal.gov.in/index.php/en/pmvdy", "https://tribal.nic.in/Livelihood.aspx", "Official portal / Ministry page", "Indirect/group scheme; not a guaranteed individual loan.", "Tribal value-chain pathway"],
  ["SCST-26", "Prime Minister's Employment Generation Programme", "PMEGP", "Ministry of MSME / KVIC", "SC and ST are special category", "Individuals, SHGs, societies, production cooperatives and trusts", "Credit-linked margin-money subsidy", "Active; live PMEGP portal", "KVIC / KVIB / DIC / banks", "Support new viable micro-enterprises and employment generation in rural and urban areas.", "Project ceiling currently ₹50 lakh manufacturing and ₹20 lakh service/business/trading on live portal; SC/ST special category gets 25% urban and 35% rural margin-money subsidy with 5% own contribution.", "₹50 lakh manufacturing; ₹20 lakh service/business/trading; 25% urban / 35% rural subsidy for special category; 5% own contribution.", "Individual above 18; new project; eligible activity; capital expenditure; Class VIII above threshold; no prior subsidy for same unit.", "Negative list, project type, existing-unit route and current portal rules require verification.", "Aadhaar/KYC; DPR; quotations; bank details; education proof where triggered; caste certificate if claiming special category.", "Apply online on PMEGP portal; bank appraisal and KVIC/KVIB/DIC implementation.", "https://pmegp.msme.gov.in/Home/Index", "https://www.msme.gov.in/sites/default/files/Revisedguidelines07.12.2023.pdf", "Official portal / guideline", "Complementary scheme with SC/ST preferential subsidy; not SC/ST-exclusive.", "High-volume new-enterprise route"],
  ["SCST-27", "Credit Guarantee Scheme for Micro and Small Enterprises", "CGTMSE", "Ministry of MSME + SIDBI", "SC/ST special coverage within MSE scheme", "Eligible MSEs borrowing from member lending institutions", "Credit guarantee", "Active; revised coverage effective 01-Apr-2025", "Member lending institutions; guarantee filed by lender", "Improve collateral-free institutional credit access for MSEs.", "For SC/ST entrepreneurs, official CGTMSE coverage page lists 85% maximum guarantee coverage for credit facilities up to ₹5 lakh; the overall guarantee ceiling was raised to ₹10 crore, subject to scheme terms and lender appraisal.", "SC/ST coverage up to 85% for facilities up to ₹5 lakh; overall cap up to ₹10 crore.", "Eligible MSE, lender membership, Udyam and credit-facility parameters; SC/ST status for special coverage.", "Guarantee is not a loan/subsidy; lender appraisal, Udyam and current fee/coverage table must be checked.", "Udyam; SC/ST certificate; KYC; DPR/business plan; lender application; financials.", "Apply to a member lending institution; lender applies for guarantee.", "https://www.cgtmse.in/Home/VS/3", "https://cgtmse.in/Default/ViewFile/?id=1743176302611_CGTMSE+-+Scheme+Document+CGS+I_updated+as+on+Apr+1+2025.pdf&path=Page", "Official website / scheme document", "Complementary guarantee; never present as direct government cash.", "Collateral-free credit enhancer"],
  ["SCST-28", "Micro and Small Enterprises Cluster Development Programme", "MSE-CDP", "Ministry of MSME", "SC/ST clusters get enhanced grant", "MSE clusters / SPVs / associations", "Cluster grant / common facility", "Active; demand-driven; current dashboard", "MSME / State Govt / SPV", "Improve technology, skills, quality, market access and common infrastructure for MSE clusters.", "For clusters with more than 50% SC/ST units, higher GoI grant rates may apply; current scheme booklet lists up to 80% for eligible CFC project bands, with project and SPV conditions.", "CFC and infrastructure grants are project-cost and geography dependent; enhanced share for qualifying SC/ST-heavy clusters.", "Eligible cluster / SPV; common facility or infrastructure project; state and steering committee approval.", "SC/ST share of cluster, SPV structure, DPR, land/building, state forwarding and project band require verification.", "Cluster membership; SPV documents; DPR; land/building; member list; financial contribution proof.", "Online proposal through State Government / MSME field institutes.", "https://www.msme.gov.in/micro-small-enterprises-cluster-development-mse-cdp", "https://my.msme.gov.in/MyMsmeMob/MsmeScheme/Pages/0_2_3.html", "Official scheme page / official portal", "Indirect cluster benefit; not an individual loan.", "Useful for group / cluster projects"],
  ["SCST-29", "Pradhan Mantri MUDRA Yojana", "PMMY", "Department of Financial Services / MUDRA", "SC/ST not exclusive; inclusive institutional credit", "Micro-enterprises and income-generating activities", "Collateral-free credit", "Active; Tarun Plus added w.e.f. 24-Oct-2024", "Banks, RRBs, SFBs, NBFCs, MFIs", "Provide institutional collateral-free credit for micro enterprises and allied activities.", "Shishu up to ₹50,000; Kishore above ₹50,000–₹5 lakh; Tarun above ₹5–₹10 lakh; Tarun Plus above ₹10–₹20 lakh for borrowers who successfully repaid a prior Tarun loan.", "Loan bands ₹50,000 / ₹5 lakh / ₹10 lakh / ₹20 lakh; collateral not required subject to lender terms.", "Eligible micro-enterprise / income-generating activity; lender appraisal; Tarun Plus prior Tarun repayment.", "Confirm lender policy, credit history, activity and category; scheme match is not loan approval.", "KYC; PAN; business plan; bank statement; quotations where relevant.", "Apply through participating lender; JanSamarth may provide scheme access.", "https://financialservices.gov.in/pradhan-mantri-mudra-yojana-pmmy", "https://www.financialservices.gov.in/jansamarth", "Official DFS page / official portal", "Complementary general scheme; use as fallback when SC/ST-exclusive route is absent.", "Common fallback credit route"],
  ["SCST-30", "PM Formalisation of Micro Food Processing Enterprises", "PMFME", "Ministry of Food Processing Industries", "SC/ST not exclusive; group and micro-food focus", "Individuals, SHGs, FPOs, cooperatives, common infrastructure", "Credit-linked subsidy / grant / formalisation", "Portal active; original five-year window was FY 2020-21 to FY 2024-25; verify current intake", "State nodal agencies / banks / PMFME portal", "Formalise and upgrade micro food-processing units and groups.", "Individual units: credit-linked subsidy 35% of eligible project cost up to ₹10 lakh; minimum 10% beneficiary contribution; ODOP preference; group/common-infrastructure components have separate rules.", "35% subsidy; max ₹10 lakh per individual unit; 10% minimum beneficiary contribution.", "Component-specific: food-processing activity; individual vs group pathway; eligible project and contribution.", "Do not use flat rules: confirm component, new/existing status, ODOP, state implementation, DPR and bank finance.", "Aadhaar/KYC; DPR; bank statement; food registration where applicable; group records.", "Apply through PMFME portal / State Nodal Agency / bank.", "https://pmfme.mofpi.gov.in/", "https://pmfme.mofpi.gov.in/pmfme/assets/PDF/Scheme%20Guidelines/SchemeGuidelines-English.pdf", "Official portal / guideline", "Component-based; current intake must be verified due original scheme period.", "Food-processing specialization"],
  ["SCST-31", "PM Vishwakarma", "PMV", "Ministry of MSME", "SC/ST not exclusive; traditional artisans", "Artisans and craftspeople in notified trades", "Recognition / toolkit / credit / training", "Active; FY 2023-24 to FY 2027-28", "PM Vishwakarma portal / CSC / implementing institutions", "Support traditional artisans through recognition, skill upgradation, toolkit assistance, credit and market linkage.", "Certificate and ID; basic/advanced training; toolkit incentive ₹15,000; collateral-free credit up to ₹3 lakh in two tranches at 5%; digital and marketing incentives.", "₹15,000 toolkit incentive; credit up to ₹3 lakh; 5% interest; 18 trades, with current portal/dashboard trade labels to be verified.", "Age 18+; currently practising notified trade; self-employed/informal; government-employee and family-registration exclusions; component conditions.", "Confirm current notified trade list, family-registration, prior-loan exceptions and portal verification.", "Aadhaar; bank details; artisan/trade evidence; local verification; training/registration documents.", "Register via PM Vishwakarma portal / CSC; loan through participating lenders.", "https://pmvishwakarma.gov.in/", "https://msme.gov.in/sites/default/files/July-SeptemberInsider2023v2.0.pdf", "Official portal / MSME publication", "Complementary artisan scheme; category is not the hard gate.", "Traditional-trade pathway"],
  ["SCST-32", "Scheme of Fund for Regeneration of Traditional Industries", "SFURTI", "Ministry of MSME / KVIC / Coir Board", "SC/ST artisans can benefit within clusters", "Traditional-industry artisans and cluster institutions", "Cluster grant / common facilities", "Active scheme page; cluster-specific", "Implementing agencies / cluster SPVs", "Regenerate traditional industries through clusters, common facilities, skills, design and market support.", "Soft and hard interventions, common facilities, skills, design, market linkage and cluster infrastructure; assistance is project and cluster based.", "Project-specific; no single individual cash ceiling.", "Artisan/worker linked to eligible traditional-industry cluster; implementing agency and project approval.", "Individuals normally access through an approved cluster; confirm local cluster and implementing agency.", "Artisan evidence; cluster membership; KYC; group/agency documents; business plan.", "Through approved implementing agencies / SFURTI portal.", "https://sfurti.msme.gov.in/SFURTI/Home.aspx", "https://msme.gov.in/sites/default/files/SFURTI_GUIDELINES_REVISED.pdf", "Official portal / guideline", "Indirect cluster opportunity; not individual direct finance.", "Traditional-artisan collective route"],
  ["SCST-33", "DAY-NRLM Start-up Village Entrepreneurship Programme", "SVEP", "Ministry of Rural Development / DAY-NRLM", "SC/ST eligible within rural SHG ecosystem", "Rural SHG members / family members / non-farm enterprises", "Rural enterprise development", "Active in approved blocks; coverage varies", "SRLM / Block Project Implementation Unit / CBOs", "Provide finance, mentoring and enterprise-development support for rural non-farm businesses.", "Community-based enterprise support, training, mentoring and finance through SHG institutions in approved SVEP blocks; exact support varies by state/block.", "Block / project specific; no single national individual ceiling.", "Rural location; suitable non-farm activity; SHG/family linkage and approved block conditions.", "Confirm block coverage, SHG/family linkage, community viability and state operating model.", "Aadhaar/KYC; SHG evidence; business plan; bank details; local residence/activity proof.", "Through State Rural Livelihood Mission / approved block institutions.", "https://www.svep.nrlm.gov.in/landing", "https://nrlm.gov.in/", "Official programme portal", "Indirect implementation; not direct SC/ST-only credit.", "Rural micro-enterprise support"],
  ["SCST-34", "DAY-NULM Self Employment Programme", "DAY-NULM-SEP", "Ministry of Housing and Urban Affairs", "SC/ST eligible within urban-poor target group", "Urban poor individuals and groups", "Interest-subsidised enterprise finance", "Active in covered towns; local implementation", "Urban Local Bodies / NULM", "Support self-employment ventures for eligible urban poor individuals and groups.", "Interest-subsidised loans, enterprise-development and group support; project and local ULB conditions apply.", "Individual and group ceilings vary by current DAY-NULM guidelines and ULB implementation.", "Urban poor; covered town/ULB; viable self-employment activity; local beneficiary selection.", "Confirm urban-poor eligibility, ULB coverage, project size and current local intake.", "KYC; urban-poor/residence proof; DPR; bank details; group documents where relevant.", "Through ULB / City Mission Manager / DAY-NULM route.", "https://nulm.gov.in/", "https://nulm.gov.in/", "Official portal", "Indirect/general scheme; use as a location-based complementary match.", "Urban livelihood support"],
  ["SCST-35", "Stand-Up India", "SUPI", "Department of Financial Services", "SC/ST and women", "SC/ST and women entrepreneurs", "Composite bank loan", "Superseded / ended 31-Mar-2025; retained for historical comparison", "Historical Standup Mitra / JanSamarth route", "Historically supported greenfield enterprises through composite loans.", "Historical terms: ₹10 lakh–₹1 crore composite loan, greenfield manufacturing/services/trading/allied agriculture, up to 7-year repayment and minimum 10% own contribution.", "Historical loan ₹10 lakh–₹1 crore; up to 7 years; minimum 10% own contribution.", "Historical: age 18+, greenfield, non-default, SC/ST or woman promoter.", "Official DFS page states scheme was only up to 31-Mar-2025 and a replacement scheme was under preparation; do not recommend as current.", "Historical KYC; category proof; greenfield project report; bank documents.", "No current application recommendation; monitor DFS for successor scheme.", "https://financialservices.gov.in/stand-india-scheme-supi", "https://financialservices.gov.in/stand-india-scheme-supi", "Official DFS status page", "Superseded; included to prevent stale-data errors in project.", "Status-control test case"],
  ["SCST-36", "New first-time entrepreneur scheme announced in Union Budget 2025-26", "FIRST-TIMER-2CR", "Department of Financial Services / Government of India", "SC, ST and women first-time entrepreneurs", "First-time entrepreneurs", "Announced term-loan scheme", "Announced; not operational as of 05-Feb-2026 official status page", "To be notified; successor to Stand-Up India concept", "Proposed successor with online capacity building and term loans for first-time entrepreneurs.", "Budget announcement: term loans up to ₹2 crore for 5 lakh women, SC and ST first-time entrepreneurs over 5 years; official DFS page says EFC note was under preparation.", "Proposed term loan up to ₹2 crore; 5 lakh beneficiaries over 5 years.", "Not yet notified; final eligibility, lender route, subsidy/guarantee and application process unknown.", "Must remain in ‘announced/not operational’ state until official guidelines and portal are published.", "TBD; do not collect as an application checklist yet.", "Monitor Department of Financial Services / Union Budget updates.", "https://financialservices.gov.in/stand-india-scheme-supi", "https://financialservices.gov.in/stand-india-scheme-supi", "Official status page", "Include as a watchlist item only; never present as currently available.", "Future-policy watchlist"],
];

const profileFields = [
  ["is_indian_citizen", "Indian citizenship", "boolean", "true/false", "PMEGP, PMMY, PMV", "Identity/KYC", "Required where the scheme rule states it; confirm source wording."],
  ["age", "Applicant age", "number", "years", "PMEGP, PMV, PM-DAKSH, SUPI", "Age proof", "Use numeric age and comparison operators."],
  ["social_category", "Social category", "enum", "SC | ST | OBC | General | Other", "All SC/ST-targeted and priority schemes", "Caste certificate", "Keep SC and ST separate; do not collapse them into one value in matching logic."],
  ["gender", "Gender", "enum", "Woman | Man | Other / self-described", "NSFDC, NSTFDC AMSY, PMEGP, VCF-SC, PM-AJAY", "Identity / self-declaration", "Use only when a scheme has a gender-specific rule or priority."],
  ["state", "State / UT of residence", "enum", "State / UT", "All state-channelled schemes", "Residence proof", "Needed for notified-tribe and state implementation checks."],
  ["district", "District", "text", "District name", "PMFME, PM-AJAY, ODOP, local implementation", "Residence / local records", "Enables ODOP and district-level programme routing."],
  ["location_type", "Location", "enum", "Rural | Urban", "PMEGP, SVEP, DAY-NULM, PM-AJAY", "Address / local body proof", "Do not infer from state alone."],
  ["business_stage", "Business stage", "enum", "Idea | New | Existing | Expansion | Upgrade", "PMEGP, PMFME, NSSH, SCLCSS, PMMY", "Business proof / self-declaration", "Existing vs new is often a hard gate."],
  ["applicant_type", "Applicant / entity type", "enum", "Individual | Proprietorship | Partnership | Company | SHG | FPO | Cooperative | Society | SPV", "PMFME, MSE-CDP, PMJVM, NSFDC, NSTFDC", "Incorporation / group records", "Route component-based schemes by applicant type first."],
  ["ownership_sc_st_pct", "SC/ST promoter ownership", "percentage", "0–100%", "NSSH, SCLCSS, CEGSSC, VCF-SC/ST, PPP-MSE", "Shareholding / partnership deed", "Store separate SC and ST ownership percentages when possible."],
  ["annual_family_income_inr", "Annual family income", "currency", "₹", "NSFDC, NSTFDC, PM-AJAY, PM-DAKSH", "Income certificate", "Use current scheme-specific ceilings; do not globalise one ceiling."],
  ["project_cost_inr", "Total project cost", "currency", "₹", "PMEGP, NSFDC, NSTFDC, PMFME, NAMASTE", "DPR / quotations", "Use eligible project cost separately where a scheme defines it."],
  ["requested_loan_amount_inr", "Requested loan amount", "currency", "₹", "PMMY, NSFDC, NSTFDC, VCF", "Loan application / DPR", "Needed for loan band and ceiling checks."],
  ["project_sector", "Primary sector", "enum", "Manufacturing | Service | Trading | Food | Agriculture | Transport | Textile | Traditional craft | Sanitation | Other", "PMEGP, SCLCSS, PMFME, PMMY, CGTMSE", "Business plan / NIC", "Prefer structured sector and NIC over free text."],
  ["activity_code_nic", "NIC / activity code", "text", "NIC code", "SCLCSS, PMEGP, CGTMSE, PPP-MSE", "Udyam / business proof", "Useful for activity exclusions and sector eligibility."],
  ["has_capital_expenditure", "Capital expenditure included", "boolean", "true/false", "PMEGP, SCLCSS, PMFME", "DPR / quotations", "Use for hard capital-expenditure gates."],
  ["has_udyam_registration", "Udyam registration", "boolean", "true/false", "NSSH, SCLCSS, CGTMSE, PPP-MSE, SPRS", "Udyam certificate", "Do not apply as universal gate; keep scheme-specific."],
  ["is_artisan_or_craftsperson", "Artisan / craftsperson status", "boolean", "true/false", "PMV, SFURTI, NSSH", "Trade proof / local verification", "Pair with a structured trade field."],
  ["trade", "Notified / traditional trade", "enum", "Scheme-specific trade list", "PMV, SFURTI", "Trade proof", "Store the notified list as a versioned lookup table."],
  ["is_self_employed", "Self-employed status", "boolean", "true/false", "PMV, SVEP, PM-AJAY", "Self-declaration / local proof", "Can be hard, conditional or soft depending on scheme."],
  ["is_government_employee", "Government employment", "boolean", "true/false", "PMV", "Employment record / self-declaration", "PMV exclusion is scheme-specific."],
  ["family_member_already_enrolled_in_pmv", "Family member already enrolled under PMV", "boolean", "true/false", "PMV", "Self-declaration / official verification", "Do not generalise this to all schemes."],
  ["previous_loan_repaid_successfully", "Previous qualifying loan repaid", "boolean", "true/false/unknown", "PMMY Tarun Plus, PMV", "Lender record", "Use conditional rules only where triggered."],
  ["shg_membership", "SHG membership / group status", "boolean", "true/false", "NSTFDC MCS, SVEP, PMJVM, PMFME", "SHG records", "Group schemes require group-level data."],
  ["odop_match", "ODOP alignment", "boolean", "true/false/unknown", "PMFME", "District ODOP list", "Soft/priority factor unless component explicitly requires it."],
  ["sanitation_worker_profiled", "Sanitation worker / waste picker profile", "boolean", "true/false/unknown", "NAMASTE", "ULB / NAMASTE profile", "Needed before showing specialised NAMASTE pathway."],
];

const rules = [
  ["R-001", "SCST-02", "SCLCSS", "HARD", "social_category", "IN", "SC | ST", "SC/ST-owned MSE required", "Hard gate", "SC/ST ownership is a core SCLCSS condition.", "https://sclcss.msme.gov.in/Manual/Guidelines.pdf"],
  ["R-002", "SCST-02", "SCLCSS", "HARD", "ownership_sc_st_pct", ">=", "51% or notified definition", "Ownership/control must meet applicable SC/ST definition", "Hard gate", "Confirm constitution-specific ownership definition.", "https://sclcss.msme.gov.in/Manual/Guidelines.pdf"],
  ["R-003", "SCST-02", "SCLCSS", "HARD", "project_sector", "IN", "Manufacturing | Service", "Eligible sector", "Hard gate", "Trading is excluded in the modelled SCLCSS pathway.", "https://sclcss.msme.gov.in/Manual/Guidelines.pdf"],
  ["R-004", "SCST-02", "SCLCSS", "HARD", "has_capital_expenditure", "=", "TRUE", "New plant, machinery or equipment required", "Hard gate", "Link to eligible institutional term loan.", "https://sclcss.msme.gov.in/Manual/Guidelines.pdf"],
  ["R-005", "SCST-02", "SCLCSS", "VERIFY", "has_udyam_registration", "=", "TRUE", "Udyam and MSE status to verify", "Verification", "Confirm current registration and lender process.", "https://sclcss.msme.gov.in/Manual/Guidelines.pdf"],
  ["R-006", "SCST-02", "SCLCSS", "SOFT", "project_cost_inr", "<=", "100000000", "Eligible finance base up to ₹1 crore; subsidy cap ₹25 lakh", "Ranking / benefit", "25% subsidy is capped at ₹25 lakh.", "https://sclcss.msme.gov.in/Manual/Guidelines.pdf"],
  ["R-007", "SCST-06", "PPP-MSE", "HARD", "ownership_sc_st_pct", ">=", "51%", "SC/ST-owned MSE definition applies", "Hard gate", "Constitution-specific definition must be checked.", "https://my.msme.gov.in/MyMsme/Reg/PPP_Home.aspx"],
  ["R-008", "SCST-06", "PPP-MSE", "VERIFY", "has_udyam_registration", "=", "TRUE", "MSE status and tender registration", "Verification", "Procurement benefits depend on tender and registration rules.", "https://www.msme.gov.in/public-procrument-policy"],
  ["R-009", "SCST-08", "VCF-SC", "HARD", "social_category", "=", "SC", "SC promoter required", "Hard gate", "The fund is targeted to SC entrepreneurs.", "https://www.ifciventure.com/venture-capital-fund-scheduled-castes-vcf-sc-and-venture-capital-fund-backward-classes-vcf-bc.aspx"],
  ["R-010", "SCST-08", "VCF-SC", "CONDITIONAL", "project_cost_inr", "BETWEEN", "1000000 and 150000000", "Ticket-size and fund appraisal fit", "Conditional", "Use current fund guidelines and investment committee appraisal.", "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2209488&lang=1&reg=1"],
  ["R-011", "SCST-09", "ASIIM", "HARD", "social_category", "=", "SC", "SC innovator / youth target group", "Hard gate", "Route through supported incubation ecosystem.", "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2209488&lang=1&reg=1"],
  ["R-012", "SCST-09", "ASIIM", "VERIFY", "applicant_type", "IN", "Individual | Company | Startup", "Incubator and programme route", "Verification", "Confirm current cohort and incubator eligibility.", "https://www.ifciventure.com/venture-capital-fund-scheduled-castes-vcf-sc-and-venture-capital-fund-backward-classes-vcf-bc.aspx"],
  ["R-013", "SCST-10", "CEGSSC", "HARD", "social_category", "=", "SC", "SC entrepreneur required", "Hard gate", "SC-only guarantee scheme.", "https://socialjustice.gov.in/schemes/32"],
  ["R-014", "SCST-10", "CEGSSC", "VERIFY", "ownership_sc_st_pct", ">", "75% historical guideline", "Promoter ownership/control", "Verification", "Historical revised guidelines specify more than 75%; verify current operation.", "https://socialjustice.gov.in/writereaddata/UploadFile/CreditEnhancementGuaranteeSchemeSCs.pdf"],
  ["R-015", "SCST-11", "NSFDC-TL", "HARD", "social_category", "=", "SC", "SC community required", "Hard gate", "NSFDC currently serves SC beneficiaries.", "https://nsfdc.nic.in/faqs"],
  ["R-016", "SCST-11", "NSFDC-TL", "HARD", "annual_family_income_inr", "<=", "500000", "Annual family income ceiling for loans", "Hard gate", "Current NSFDC FAQ effective 07-Jan-2026.", "https://nsfdc.nic.in/faqs"],
  ["R-017", "SCST-11", "NSFDC-TL", "HARD", "project_cost_inr", "BETWEEN", "140001 and 5000000", "Term-loan project band", "Hard gate", "Primary term-loan product described for larger projects.", "https://nsfdc.nic.in/faqs"],
  ["R-018", "SCST-12", "NSFDC-MFS", "HARD", "social_category", "=", "SC", "SC community required", "Hard gate", "NSFDC micro finance product.", "https://nsfdc.nic.in/faqs"],
  ["R-019", "SCST-12", "NSFDC-MFS", "HARD", "project_cost_inr", "<=", "140000", "Micro-finance project ceiling", "Hard gate", "Current FAQ product description.", "https://nsfdc.nic.in/faqs"],
  ["R-020", "SCST-13", "NSFDC-AMY", "HARD", "social_category", "=", "SC", "SC community required", "Hard gate", "Selected NBFC-MFI route.", "https://nsfdc.nic.in/faqs"],
  ["R-021", "SCST-14", "NSFDC-UNY", "HARD", "social_category", "=", "SC", "SC community required", "Hard gate", "Cooperative / SFB route.", "https://nsfdc.nic.in/faqs"],
  ["R-022", "SCST-17", "PM-DAKSH", "HARD", "social_category", "=", "SC", "SC target group", "Hard gate", "Other target groups have separate criteria.", "https://socialjustice.gov.in/schemes/100"],
  ["R-023", "SCST-17", "PM-DAKSH", "HARD", "age", "BETWEEN", "18 and 45", "Age band", "Hard gate", "Current official page states 18–45 years.", "https://socialjustice.gov.in/schemes/100"],
  ["R-024", "SCST-18", "PM-AJAY", "HARD", "social_category", "=", "SC", "SC target population", "Hard gate", "Implementing project and poverty/local selection still apply.", "https://pmajay.dosje.gov.in/content/about-scheme"],
  ["R-025", "SCST-18", "PM-AJAY", "VERIFY", "state", "IS NOT BLANK", "State action plan", "State/district project coverage", "Verification", "Not an ordinary direct national application.", "https://pmajay.dosje.gov.in/content/about-scheme"],
  ["R-026", "SCST-19", "NAMASTE", "HARD", "sanitation_worker_profiled", "=", "TRUE", "Identified/profiled sanitation worker or waste picker", "Hard gate", "Specialised target group.", "https://socialjustice.gov.in/schemes/37/archive"],
  ["R-027", "SCST-20", "NSTFDC-TL", "HARD", "social_category", "=", "ST", "ST community required", "Hard gate", "NSTFDC target group.", "https://nstfdc.tribal.gov.in/"],
  ["R-028", "SCST-20", "NSTFDC-TL", "VERIFY", "state", "IS NOT BLANK", "State/UT notified tribe", "Residence and notified tribe check", "Verification", "Financial assistance only for eligible persons residing where the tribe is notified.", "https://nstfdc.tribal.gov.in/(S(vynolazsyi2usrif0041a1u0))/frm_eligibility.aspx"],
  ["R-029", "SCST-21", "NSTFDC-AMSY", "HARD", "social_category", "=", "ST", "ST community required", "Hard gate", "AMSY is exclusive for ST women.", "https://nstfdc.tribal.gov.in/(S(wdobvikapdpuryzvigs1rpn5))/PublicView_Hindi/frm_amsy.aspx"],
  ["R-030", "SCST-21", "NSTFDC-AMSY", "HARD", "gender", "=", "Woman", "ST woman target group", "Hard gate", "Scheme-specific gender rule.", "https://nstfdc.tribal.gov.in/(S(wdobvikapdpuryzvigs1rpn5))/PublicView_Hindi/frm_amsy.aspx"],
  ["R-031", "SCST-22", "NSTFDC-MCS", "HARD", "social_category", "=", "ST", "ST SHG members", "Hard gate", "Group-level rule; all members need verification.", "https://nstfdc.tribal.gov.in/(S(xdrrv2dggok25j0gjxerotfo))/PublicView_Hindi/frm_mcs.aspx"],
  ["R-032", "SCST-22", "NSTFDC-MCS", "HARD", "shg_membership", "=", "TRUE", "Eligible SHG required", "Hard gate", "Do not model as an individual loan.", "https://nstfdc.tribal.gov.in/(S(xdrrv2dggok25j0gjxerotfo))/PublicView_Hindi/frm_mcs.aspx"],
  ["R-033", "SCST-24", "VCF-ST", "HARD", "social_category", "=", "ST", "ST promoter required", "Hard gate", "ST target group.", "https://www.vcfst.in/"],
  ["R-034", "SCST-25", "PMJVM-VD", "HARD", "social_category", "=", "ST", "Tribal target group", "Hard gate", "Group/value-chain pathway.", "https://tribal.nic.in/Livelihood.aspx"],
  ["R-035", "SCST-25", "PMJVM-VD", "HARD", "shg_membership", "=", "TRUE", "Tribal SHG/producer group route", "Hard gate", "Use group-level component rules.", "https://trifed.tribal.gov.in/index.php/en/pmvdy"],
  ["R-036", "SCST-26", "PMEGP", "HARD", "age", ">=", "18", "Applicant above 18", "Hard gate", "New enterprise pathway.", "https://pmegp.msme.gov.in/Home/Index"],
  ["R-037", "SCST-26", "PMEGP", "HARD", "business_stage", "=", "New", "New project required", "Hard gate", "Existing unit requires separate eligible upgrade pathway where available.", "https://pmegp.msme.gov.in/Home/Index"],
  ["R-038", "SCST-26", "PMEGP", "HARD", "has_capital_expenditure", "=", "TRUE", "Capital expenditure required", "Hard gate", "Projects without capital expenditure are not eligible.", "https://pmegp.msme.gov.in/Home/Index"],
  ["R-039", "SCST-26", "PMEGP", "CONDITIONAL", "education_level", ">=", "8 if manufacturing > ₹10L or service/business > ₹5L", "Class VIII requirement triggered by project threshold", "Conditional", "Apply only when threshold is triggered.", "https://pmegp.msme.gov.in/Home/Index"],
  ["R-040", "SCST-26", "PMEGP", "SOFT", "social_category", "IN", "SC | ST", "Special-category subsidy and contribution", "Benefit / ranking", "SC/ST affects subsidy/contribution, not basic eligibility.", "https://www.msme.gov.in/sites/default/files/Revisedguidelines07.12.2023.pdf"],
  ["R-041", "SCST-27", "CGTMSE", "HARD", "has_udyam_registration", "=", "TRUE", "Udyam / MSE status", "Hard gate", "Current CGTMSE guidance requires eligible MSE status and lender process.", "https://www.cgtmse.in/Home/VS/3"],
  ["R-042", "SCST-27", "CGTMSE", "SOFT", "social_category", "IN", "SC | ST", "Special coverage up to 85% for up to ₹5 lakh facilities", "Benefit / ranking", "Coverage table is scheme/lender dependent.", "https://www.cgtmse.in/Home/VS/3"],
  ["R-043", "SCST-29", "PMMY", "HARD", "requested_loan_amount_inr", "BETWEEN", "0 and 2000000", "PMMY loan band", "Hard gate", "Tarun Plus extends upper band only with prior Tarun repayment.", "https://financialservices.gov.in/pradhan-mantri-mudra-yojana-pmmy"],
  ["R-044", "SCST-29", "PMMY", "CONDITIONAL", "previous_loan_repaid_successfully", "=", "TRUE if loan > ₹10L", "Tarun Plus previous Tarun repayment", "Conditional", "Do not apply to Shishu, Kishore or Tarun.", "https://financialservices.gov.in/pradhan-mantri-mudra-yojana-pmmy"],
  ["R-045", "SCST-30", "PMFME", "HARD", "project_sector", "=", "Food", "Food-processing pathway", "Hard gate", "Route component before applying rules.", "https://pmfme.mofpi.gov.in/pmfme/assets/PDF/Scheme%20Guidelines/SchemeGuidelines-English.pdf"],
  ["R-046", "SCST-30", "PMFME", "HARD", "applicant_type", "=", "Individual for individual-unit path", "Component-specific applicant type", "Hard gate", "Groups need group component rules.", "https://pmfme.mofpi.gov.in/pmfme/assets/PDF/Scheme%20Guidelines/SchemeGuidelines-English.pdf"],
  ["R-047", "SCST-30", "PMFME", "HARD", "beneficiary_contribution_pct", ">=", "10%", "Minimum contribution", "Hard gate", "Use eligible project cost and component rules.", "https://pmfme.mofpi.gov.in/pmfme/assets/PDF/Scheme%20Guidelines/SchemeGuidelines-English.pdf"],
  ["R-048", "SCST-30", "PMFME", "SOFT", "odop_match", "=", "TRUE", "ODOP preference", "Ranking / priority", "Do not reject solely for no ODOP match unless component requires it.", "https://pmfme.mofpi.gov.in/"],
  ["R-049", "SCST-31", "PMV", "HARD", "age", ">=", "18", "Adult applicant", "Hard gate", "PM Vishwakarma age requirement.", "https://msme.gov.in/sites/default/files/July-SeptemberInsider2023v2.0.pdf"],
  ["R-050", "SCST-31", "PMV", "HARD", "is_artisan_or_craftsperson", "=", "TRUE", "Artisan/craftsperson required", "Hard gate", "Pair with structured trade.", "https://msme.gov.in/sites/default/files/July-SeptemberInsider2023v2.0.pdf"],
  ["R-051", "SCST-31", "PMV", "HARD", "family_member_already_enrolled_in_pmv", "=", "FALSE", "Only one family member may register", "Hard gate", "Scheme-specific exclusion; do not globalise.", "https://pmvishwakarma.gov.in/"],
  ["R-052", "SCST-31", "PMV", "HARD", "is_government_employee", "=", "FALSE", "Government employee exclusion", "Hard gate", "Verify current scheme wording and family rules.", "https://pmvishwakarma.gov.in/"],
  ["R-053", "SCST-31", "PMV", "VERIFY", "trade", "IN", "Current notified trade lookup", "18-trade verification", "Verification", "Current dashboard labels should be versioned in lookup data.", "https://dashboard.msme.gov.in/pmv_details.aspx?stid=1"],
  ["R-054", "SCST-32", "SFURTI", "HARD", "is_artisan_or_craftsperson", "=", "TRUE", "Artisan/traditional industry link", "Hard gate", "Individuals access via cluster.", "https://sfurti.msme.gov.in/SFURTI/Home.aspx"],
  ["R-055", "SCST-32", "SFURTI", "VERIFY", "applicant_type", "IN", "SHG | Cluster SPV | Implementing Agency", "Cluster route", "Verification", "Not an ordinary direct loan application.", "https://sfurti.msme.gov.in/SFURTI/Home.aspx"],
  ["R-056", "SCST-33", "SVEP", "HARD", "location_type", "=", "Rural", "Rural programme area", "Hard gate", "Approved block coverage required.", "https://www.svep.nrlm.gov.in/landing"],
  ["R-057", "SCST-33", "SVEP", "HARD", "shg_membership", "=", "TRUE", "SHG/family ecosystem link", "Hard gate", "Confirm state/block implementation.", "https://www.svep.nrlm.gov.in/landing"],
  ["R-058", "SCST-34", "DAY-NULM-SEP", "HARD", "location_type", "=", "Urban", "Urban programme area", "Hard gate", "Covered town/ULB required.", "https://nulm.gov.in/"],
  ["R-059", "SCST-34", "DAY-NULM-SEP", "VERIFY", "annual_family_income_inr", "IS NOT BLANK", "Urban-poor selection proof", "Urban-poor eligibility", "Verification", "Local ULB selection and current rules apply.", "https://nulm.gov.in/"],
  ["R-060", "SCST-35", "SUPI", "STATUS", "status", "=", "SUPERSEDED", "Historical-only status", "Status control", "Official DFS page states scheme was only up to 31-Mar-2025.", "https://financialservices.gov.in/stand-india-scheme-supi"],
  ["R-061", "SCST-36", "FIRST-TIMER-2CR", "STATUS", "status", "=", "ANNOUNCED_NOT_OPERATIONAL", "Watchlist-only status", "Status control", "Do not show as currently apply-able until guidelines and portal are notified.", "https://financialservices.gov.in/stand-india-scheme-supi"],
];

const docs = [
  ["SCST-01", "National SC-ST Hub", "Caste certificate / SC-ST ownership proof", "Conditional", "Verify target group or enterprise ownership.", "SC/ST entrepreneur / MSE", "https://scsthub.in/"],
  ["SCST-02", "SCLCSS", "SC/ST certificate and ownership documents", "Mandatory", "Core eligibility and ownership definition.", "SC/ST-owned MSE", "https://sclcss.msme.gov.in/Manual/Guidelines.pdf"],
  ["SCST-02", "SCLCSS", "Udyam registration", "Mandatory", "MSE status and lender processing.", "MSE", "https://sclcss.msme.gov.in/Manual/Guidelines.pdf"],
  ["SCST-02", "SCLCSS", "DPR and equipment quotations", "Mandatory", "Eligible plant/machinery and project viability.", "MSE", "https://sclcss.msme.gov.in/Manual/Guidelines.pdf"],
  ["SCST-06", "PPP-MSE", "Udyam / MSE proof", "Mandatory", "Procurement policy benefits apply to eligible MSEs.", "MSE", "https://my.msme.gov.in/MyMsme/Reg/PPP_Home.aspx"],
  ["SCST-06", "PPP-MSE", "SC/ST ownership proof", "Mandatory for sub-target", "Claim SC/ST sub-target classification.", "SC/ST-owned MSE", "https://my.msme.gov.in/MyMsme/Reg/PPP_Home.aspx"],
  ["SCST-08", "VCF-SC", "SC certificate", "Mandatory", "SC promoter eligibility.", "SC entrepreneur", "https://www.ifciventure.com/venture-capital-fund-scheduled-castes-vcf-sc-and-venture-capital-fund-backward-classes-vcf-bc.aspx"],
  ["SCST-08", "VCF-SC", "Pitch deck / DPR and financial projections", "Mandatory", "Investment committee due diligence.", "Startup / company", "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2209488&lang=1&reg=1"],
  ["SCST-10", "CEGSSC", "SC ownership and incorporation documents", "Mandatory", "Promoter and entity eligibility.", "SC enterprise", "https://socialjustice.gov.in/schemes/32"],
  ["SCST-10", "CEGSSC", "Lender application / sanction", "Mandatory", "Guarantee is routed through lender/IFCI.", "SC enterprise", "https://www.ifcicegssc.in/"],
  ["SCST-11", "NSFDC Term Loan", "SC caste certificate", "Mandatory", "Core NSFDC category requirement.", "SC individual", "https://nsfdc.nic.in/faqs"],
  ["SCST-11", "NSFDC Term Loan", "Annual family income certificate", "Mandatory", "Current loan income ceiling.", "SC individual", "https://nsfdc.nic.in/faqs"],
  ["SCST-11", "NSFDC Term Loan", "DPR / project report and quotations", "Mandatory", "Viability and project cost.", "SC individual", "https://nsfdc.nic.in/faqs"],
  ["SCST-17", "PM-DAKSH", "SC caste certificate", "Mandatory", "Training target group.", "SC candidate", "https://socialjustice.gov.in/schemes/100"],
  ["SCST-17", "PM-DAKSH", "Age proof and KYC", "Mandatory", "18–45 age band and identity.", "SC candidate", "https://socialjustice.gov.in/schemes/100"],
  ["SCST-18", "PM-AJAY", "Caste / poverty / local selection proof", "Conditional", "State/district project selection.", "SC household", "https://pmajay.dosje.gov.in/content/about-scheme"],
  ["SCST-19", "NAMASTE", "Worker profile / ULB validation", "Mandatory", "Targeted worker pathway.", "Sanitation worker", "https://socialjustice.gov.in/schemes/37/archive"],
  ["SCST-19", "NAMASTE", "Sanitation project DPR and quotations", "Mandatory", "Capital subsidy for project.", "Worker / SHG", "https://bmsnamaste.dosje.gov.in/"],
  ["SCST-20", "NSTFDC Term Loan", "ST certificate and residence proof", "Mandatory", "ST and notified-tribe jurisdiction.", "ST individual", "https://nstfdc.tribal.gov.in/"],
  ["SCST-20", "NSTFDC Term Loan", "Income proof and DPR", "Mandatory", "Income ceiling and viable project.", "ST individual", "https://nstfdc.tribal.gov.in/"],
  ["SCST-21", "NSTFDC AMSY", "ST certificate and gender proof", "Mandatory", "ST woman eligibility.", "ST woman", "https://nstfdc.tribal.gov.in/"],
  ["SCST-22", "NSTFDC MCS", "ST certificates for all SHG members", "Mandatory", "Group eligibility.", "ST SHG", "https://nstfdc.tribal.gov.in/"],
  ["SCST-22", "NSTFDC MCS", "SHG records and bank account", "Mandatory", "Existing SHG and repayment route.", "ST SHG", "https://nstfdc.tribal.gov.in/"],
  ["SCST-24", "VCF-ST", "ST ownership / incorporation proof", "Mandatory", "ST promoter eligibility.", "ST company / startup", "https://www.vcfst.in/"],
  ["SCST-25", "PMJVM / Van Dhan", "SHG / producer enterprise records", "Mandatory", "Group/value-chain route.", "ST group", "https://trifed.tribal.gov.in/index.php/en/pmvdy"],
  ["SCST-26", "PMEGP", "Aadhaar/KYC, DPR and quotations", "Mandatory", "Application and bank appraisal.", "Individual / eligible entity", "https://pmegp.msme.gov.in/Home/Index"],
  ["SCST-26", "PMEGP", "Caste certificate if claiming special category", "Conditional", "SC/ST subsidy and contribution.", "SC/ST applicant", "https://pmegp.msme.gov.in/Home/Index"],
  ["SCST-27", "CGTMSE", "Udyam and lender application", "Mandatory", "Lender-led guarantee process.", "MSE", "https://www.cgtmse.in/Home/VS/3"],
  ["SCST-29", "PMMY", "KYC, business plan and bank statements", "Mandatory", "Lender appraisal.", "Micro-enterprise", "https://financialservices.gov.in/pradhan-mantri-mudra-yojana-pmmy"],
  ["SCST-30", "PMFME", "DPR and 10% contribution evidence", "Mandatory", "Individual-unit component.", "Food-processing unit", "https://pmfme.mofpi.gov.in/pmfme/assets/PDF/Scheme%20Guidelines/SchemeGuidelines-English.pdf"],
  ["SCST-31", "PM Vishwakarma", "Aadhaar and bank details", "Mandatory", "Portal registration and benefit delivery.", "Artisan", "https://pmvishwakarma.gov.in/"],
  ["SCST-31", "PM Vishwakarma", "Trade evidence / local verification", "Mandatory", "Notified trade verification.", "Artisan", "https://pmvishwakarma.gov.in/"],
  ["SCST-32", "SFURTI", "Artisan / cluster membership evidence", "Mandatory", "Cluster route.", "Artisan / group", "https://sfurti.msme.gov.in/SFURTI/Home.aspx"],
  ["SCST-33", "SVEP", "SHG / family linkage and business plan", "Mandatory", "Approved rural block pathway.", "Rural entrepreneur", "https://www.svep.nrlm.gov.in/landing"],
  ["SCST-34", "DAY-NULM-SEP", "Urban-poor / residence proof and DPR", "Mandatory", "ULB selection and loan appraisal.", "Urban individual / group", "https://nulm.gov.in/"],
];

const sources = [
  ["SRC-01", "Ministry of MSME", "National SC-ST Hub Scheme booklet", "https://msme.gov.in/sites/default/files/Scheme-booklet-Eng.pdf", "Guideline / booklet", "NSSH benefits, scope and SC/ST entrepreneur support.", "High", "2026-08-27"],
  ["SRC-02", "SCLCSS portal / Ministry of MSME", "SCLCSS guidelines", "https://sclcss.msme.gov.in/Manual/Guidelines.pdf", "Guideline", "25% subsidy, ₹1 crore finance base, ₹25 lakh cap, ownership and sector.", "High", "2026-08-27"],
  ["SRC-03", "Ministry of MSME", "Public Procurement Policy for MSEs", "https://www.msme.gov.in/public-procrument-policy", "Policy page", "25% MSE target and 4% SC/ST sub-target.", "High", "2026-08-27"],
  ["SRC-04", "NSIC / Ministry of MSME", "Single Point Registration Scheme", "https://my.msme.gov.in/MyMsmeMob/MsmeScheme/Pages/1_2_3.html", "Scheme page", "Tender, EMD and procurement benefits.", "High", "2026-08-27"],
  ["SRC-05", "IFCI Venture / MoSJE", "VCF-SC and VCF-BC fund page", "https://www.ifciventure.com/venture-capital-fund-scheduled-castes-vcf-sc-and-venture-capital-fund-backward-classes-vcf-bc.aspx", "Fund manager page", "VCF-SC purpose, fund manager, online application.", "High", "2026-08-27"],
  ["SRC-06", "PIB / Government of India", "SC entrepreneurship funds update", "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2209488&lang=1&reg=1", "Press release", "VCF-SC ticket/rate summary and ASIIM up to ₹30 lakh.", "High", "2026-08-27"],
  ["SRC-07", "Department of Social Justice and Empowerment", "CEGSSC scheme page", "https://socialjustice.gov.in/schemes/32", "Department page", "CEGSSC objective and official fund manager link.", "High", "2026-08-27"],
  ["SRC-08", "NSFDC", "NSFDC FAQ", "https://nsfdc.nic.in/faqs", "Official FAQ", "2026 income ceiling and MFS/AMY/Term Loan/UNY product summary.", "High", "2026-08-27"],
  ["SRC-09", "Department of Social Justice and Empowerment", "NSFDC scheme page", "https://socialjustice.gov.in/schemes/34", "Department page", "NSFDC purpose and channelising model.", "High", "2026-08-27"],
  ["SRC-10", "Department of Social Justice and Empowerment", "PM-DAKSH scheme page", "https://socialjustice.gov.in/schemes/100", "Department page", "SC training eligibility, age and stipend.", "High", "2026-08-27"],
  ["SRC-11", "PM-AJAY portal", "About scheme / income-generating schemes", "https://pmajay.dosje.gov.in/content/about-scheme", "Official portal", "SC livelihood projects, state implementation and project-level support.", "High", "2026-08-27"],
  ["SRC-12", "Department of Social Justice and Empowerment", "NAMASTE scheme page / FAQ", "https://socialjustice.gov.in/schemes/37/archive", "Official scheme page", "Sanitation worker entrepreneurship and subsidy ranges.", "High", "2026-08-27"],
  ["SRC-13", "NSTFDC", "NSTFDC official portal and scheme pages", "https://nstfdc.tribal.gov.in/", "Official portal", "ST loan products and channelising model.", "High", "2026-08-27"],
  ["SRC-14", "Ministry of Tribal Affairs", "Livelihood division / VCF-ST", "https://tribal.nic.in/Livelihood.aspx", "Ministry page", "PMJVM, VCF-ST and tribal entrepreneurship architecture.", "High", "2026-08-27"],
  ["SRC-15", "VCF-ST / IFCI Venture", "VCF-ST portal", "https://www.vcfst.in/", "Fund manager portal", "VCF-ST purpose, 4% concessional finance and application route.", "High", "2026-08-27"],
  ["SRC-16", "TRIFED", "Van Dhan / PMJVM portal", "https://trifed.tribal.gov.in/index.php/en/pmvdy", "Official portal", "VDVK/VDPE, training, value addition, branding and market linkage.", "High", "2026-08-27"],
  ["SRC-17", "Department of Financial Services", "Stand-Up India status and PMMY", "https://financialservices.gov.in/stand-india-scheme-supi", "Status page", "SUPI ended 31-Mar-2025; successor announced but not operational.", "High", "2026-08-27"],
  ["SRC-18", "Department of Financial Services", "PMMY", "https://financialservices.gov.in/pradhan-mantri-mudra-yojana-pmmy", "Official scheme page", "Loan bands, Tarun Plus, collateral-free credit.", "High", "2026-08-27"],
  ["SRC-19", "CGTMSE", "CGS coverage page and 2025 scheme document", "https://www.cgtmse.in/Home/VS/3", "Official scheme page", "SC/ST enhanced guarantee coverage and ₹10 crore ceiling.", "High", "2026-08-27"],
  ["SRC-20", "KVIC / Ministry of MSME", "PMEGP live portal / revised guidelines", "https://pmegp.msme.gov.in/Home/Index", "Official portal", "Current project caps, subsidy, age and negative-list conditions.", "High", "2026-08-27"],
  ["SRC-21", "MoFPI", "PMFME portal / guidelines", "https://pmfme.mofpi.gov.in/", "Official portal", "35% subsidy, ₹10 lakh ceiling, 10% contribution, components.", "High", "2026-08-27"],
  ["SRC-22", "Ministry of MSME", "PM Vishwakarma / MSME publication", "https://msme.gov.in/sites/default/files/July-SeptemberInsider2023v2.0.pdf", "Official publication", "18 trades, toolkit and credit support; portal is current source of truth.", "Medium", "2026-08-27"],
  ["SRC-23", "Ministry of MSME", "SFURTI / MSE-CDP official pages", "https://sfurti.msme.gov.in/SFURTI/Home.aspx", "Official portal", "Cluster-based support and project-level access.", "High", "2026-08-27"],
  ["SRC-24", "DAY-NRLM", "SVEP landing page", "https://www.svep.nrlm.gov.in/landing", "Official portal", "Rural SHG enterprise support.", "Medium", "2026-08-27"],
  ["SRC-25", "DAY-NULM", "DAY-NULM portal", "https://nulm.gov.in/", "Official portal", "Urban self-employment route.", "Medium", "2026-08-27"],
];

const expansion = [
  ["Andhra Pradesh", "State SC/ST Finance Corporation / Industries portal", "To be researched", "Add state-specific loan/subsidy and implementer data."],
  ["Arunachal Pradesh", "State Tribal / Industries portal", "To be researched", "Add state-specific tribal entrepreneurship schemes."],
  ["Assam", "State SC/ST / Tribal Welfare / Industries portal", "To be researched", "Add state-specific schemes and local channelising agencies."],
  ["Bihar", "State SC/ST Welfare / Industries portal", "To be researched", "Add state-specific schemes and district routes."],
  ["Chhattisgarh", "State Tribal Welfare / Industries portal", "To be researched", "Add tribal livelihood and state finance corporation schemes."],
  ["Delhi", "Delhi SC/ST/OBC/Minority Finance & Development Corporation / Industries", "To be researched", "Add urban and state finance routes."],
  ["Goa", "State Industries / Social Welfare portal", "To be researched", "Add state-specific scheme data."],
  ["Gujarat", "State Social Justice / Industries portal", "To be researched", "Add state-specific SC/ST entrepreneur schemes."],
  ["Haryana", "State SC Finance & Development Corporation / Industries", "To be researched", "Add state-specific schemes."],
  ["Himachal Pradesh", "State SC/ST Development Corporation / Industries", "To be researched", "Add state-specific schemes."],
  ["Jharkhand", "State Tribal Welfare / Industries portal", "To be researched", "Add tribal enterprise and forest-produce schemes."],
  ["Karnataka", "Karnataka Industrial Areas / Social Welfare / ST Corporation", "To be researched", "Add state-specific schemes."],
  ["Kerala", "State SC/ST Development Corporation / Industries", "To be researched", "Add state-specific schemes."],
  ["Madhya Pradesh", "State SC/ST Finance & Development Corporation / Industries", "To be researched", "Add state-specific schemes."],
  ["Maharashtra", "State SC/ST Development Corporation / Industries", "To be researched", "Add state-specific schemes."],
  ["Manipur", "State Tribal Welfare / Industries portal", "To be researched", "Add state-specific schemes."],
  ["Meghalaya", "State Tribal Welfare / Industries portal", "To be researched", "Add state-specific schemes."],
  ["Mizoram", "State Tribal Welfare / Industries portal", "To be researched", "Add state-specific schemes."],
  ["Nagaland", "State Tribal Welfare / Industries portal", "To be researched", "Add state-specific schemes."],
  ["Odisha", "State SC/ST Development / Industries portal", "To be researched", "Add state-specific schemes."],
  ["Punjab", "State SC Corporation / Industries portal", "To be researched", "Add state-specific schemes."],
  ["Rajasthan", "State SC/ST Development / Industries portal", "To be researched", "Add state-specific schemes."],
  ["Sikkim", "State Tribal Welfare / Industries portal", "To be researched", "Add state-specific schemes."],
  ["Tamil Nadu", "State Adi Dravidar / Tribal Welfare / Industries", "To be researched", "Add state-specific schemes."],
  ["Telangana", "State SC/ST Development / Industries portal", "To be researched", "Add state-specific schemes."],
  ["Tripura", "State Tribal Welfare / Industries portal", "To be researched", "Add state-specific schemes."],
  ["Uttar Pradesh", "State SC Finance / Industries portal", "To be researched", "Add state-specific schemes."],
  ["Uttarakhand", "State SC/ST Development / Industries portal", "To be researched", "Add state-specific schemes."],
  ["West Bengal", "State SC/ST Development / Industries portal", "To be researched", "Add state-specific schemes."],
  ["Andaman and Nicobar Islands", "UT Social Welfare / Industries portal", "To be researched", "Add UT-specific schemes."],
  ["Chandigarh", "UT Social Welfare / Industries portal", "To be researched", "Add UT-specific schemes."],
  ["Dadra and Nagar Haveli and Daman and Diu", "UT Tribal / Industries portal", "To be researched", "Add UT-specific schemes."],
  ["Jammu and Kashmir", "UT SC/ST / Industries portal", "To be researched", "Add UT-specific schemes."],
  ["Ladakh", "UT Tribal / Industries portal", "To be researched", "Add UT-specific schemes."],
  ["Lakshadweep", "UT Tribal / Industries portal", "To be researched", "Add UT-specific schemes."],
  ["Puducherry", "UT Adi Dravidar / Industries portal", "To be researched", "Add UT-specific schemes."],
];

const wb = Workbook.create();
const readme = wb.worksheets.add("Read Me");
const dash = wb.worksheets.add("Dashboard");
const catalog = wb.worksheets.add("Scheme Catalog");
const ruleSheet = wb.worksheets.add("Scheme Rules");
const fieldSheet = wb.worksheets.add("Profile Fields");
const docSheet = wb.worksheets.add("Document Checklist");
const sourceSheet = wb.worksheets.add("Source Register");
const stateSheet = wb.worksheets.add("State Expansion");

const navy = "#13315C";
const teal = "#0F766E";
const saffron = "#D97706";
const sky = "#E8F1FB";
const paleTeal = "#E6F4F1";
const paleAmber = "#FEF3C7";
const paleRed = "#FDE8E8";
const gray = "#64748B";
const lightBorder = "#D7DEE8";
const bodyFont = "Aptos";

function setTitle(sheet, title, subtitle, endCol) {
  sheet.showGridLines = false;
  sheet.mergeCells(`A1:${endCol}1`);
  sheet.getRange("A1").values = [[title]];
  sheet.getRange(`A1:${endCol}1`).format = { fill: navy, font: { bold: true, color: "#FFFFFF", size: 18, name: bodyFont }, horizontalAlignment: "left", verticalAlignment: "center" };
  sheet.getRange("A1").format.rowHeight = 34;
  sheet.mergeCells(`A2:${endCol}2`);
  sheet.getRange("A2").values = [[subtitle]];
  sheet.getRange(`A2:${endCol}2`).format = { fill: sky, font: { color: navy, italic: true, size: 10, name: bodyFont }, wrapText: true, verticalAlignment: "center" };
  sheet.getRange("A2").format.rowHeight = 30;
}

function headerStyle(range) {
  range.format = { fill: teal, font: { bold: true, color: "#FFFFFF", name: bodyFont }, wrapText: true, horizontalAlignment: "center", verticalAlignment: "center", borders: { preset: "all", style: "thin", color: lightBorder } };
}

function bodyStyle(range) {
  range.format = { font: { name: bodyFont, size: 10, color: "#1F2937" }, wrapText: true, verticalAlignment: "top", borders: { preset: "inside", style: "thin", color: lightBorder } };
}

function tableStyle(sheet, address, name) {
  const t = sheet.tables.add(address, true, name);
  t.style = "TableStyleMedium2";
  t.showFilterButton = true;
  return t;
}

// Read Me
setTitle(readme, "Yojana Disha | SC/ST entrepreneur scheme library", "Central / national Government of India catalogue prepared for SIH26092. Built for storage now and later integration into the structured matching engine.", "H");
readme.getRange("A4:H4").merge();
readme.getRange("A4").values = [["What is inside"]];
readme.getRange("A4:H4").format = { fill: saffron, font: { bold: true, color: "#FFFFFF", name: bodyFont }, verticalAlignment: "center" };
readme.getRange("A5:B12").values = [
  ["Sheet", "Use"],
  ["Dashboard", "Counts, status, target-group mix and product-entry pathways."],
  ["Scheme Catalog", "36 central/national schemes, sub-components and complementary pathways."],
  ["Scheme Rules", "Rule-engine-ready hard, conditional, soft, verification and status rules."],
  ["Profile Fields", "Canonical user-profile fields to collect for future matching."],
  ["Document Checklist", "Per-scheme document prompts for a guided application journey."],
  ["Source Register", "Official source URLs, verification date and audit notes."],
  ["State Expansion", "Queue for state/UT schemes; state coverage is intentionally not claimed yet."],
];
headerStyle(readme.getRange("A5:B5"));
bodyStyle(readme.getRange("A6:B12"));
readme.getRange("A14:H14").merge();
readme.getRange("A14").values = [["Scope and guardrails"]];
readme.getRange("A14:H14").format = { fill: saffron, font: { bold: true, color: "#FFFFFF", name: bodyFont }, verticalAlignment: "center" };
readme.getRange("A15:H18").merge(true);
readme.getRange("A15:H18").values = [
  ["• Scope: central/national schemes and national implementation routes for SC/ST entrepreneurs, including direct finance, guarantees, procurement, training, cluster and value-chain programmes."],
  ["• Complementary schemes are explicitly labelled; they are not SC/ST-exclusive but can be valuable matches when an SC/ST-targeted route does not fit."],
  ["• Stand-Up India is preserved as SUPERSEDED. The proposed ₹2 crore first-time entrepreneur programme is preserved as ANNOUNCED_NOT_OPERATIONAL so stale data is not accidentally recommended."],
  ["• Final eligibility, sanction, subsidy release and local availability are determined by the official implementing authority. Refresh URLs and source dates before production use."],
];
bodyStyle(readme.getRange("A15:H18"));
readme.getRange("A20:H20").merge();
readme.getRange("A20").values = [["Legend"]];
readme.getRange("A20:H20").format = { fill: saffron, font: { bold: true, color: "#FFFFFF", name: bodyFont } };
readme.getRange("A21:B24").values = [["Status / type", "Meaning"], ["Active", "Currently listed or operating; still verify intake and local conditions."], ["Active component", "Part of an umbrella scheme; route through the correct component."], ["Superseded / Announced", "Not a current recommendation; retained for status control and future monitoring."]];
headerStyle(readme.getRange("A21:B21"));
bodyStyle(readme.getRange("A22:B24"));
readme.getRange("A26:H26").merge();
readme.getRange("A26").values = [["Last researched: 27-Aug-2026 | Project: SIH26092 — AI-Driven Scheme Matching for Marginalized Entrepreneurs"]];
readme.getRange("A26:H26").format = { fill: paleTeal, font: { bold: true, color: navy, name: bodyFont }, verticalAlignment: "center" };
readme.getRange("A:A").format.columnWidth = 28;
readme.getRange("B:B").format.columnWidth = 74;
readme.getRange("C:H").format.columnWidth = 14;
readme.freezePanes.freezeRows(5);

// Catalog
setTitle(catalog, "Scheme Catalog", "Filter by SC/ST focus, scheme type, lifecycle status, pathway or business need. URLs are stored as plain text for later ingestion.", "V");
const catalogHeaders = ["Scheme ID", "Scheme / Component", "Short Name", "Nodal Ministry / Implementer", "Target Group", "Audience / Entity", "Scheme Type", "Lifecycle Status", "Application Signal", "Purpose / Use Case", "Benefit Summary", "Quantitative Cap / Rate", "Key Hard Signals", "Conditional / Verification Signals", "Typical Documents", "How to Apply / Route", "Official Portal URL", "Guidance / Evidence URL", "Source Class", "Engine Classification", "Project Relevance", "Last Verified"];
catalog.getRange("A5:V5").values = [catalogHeaders];
headerStyle(catalog.getRange("A5:V5"));
function normalizeStatus(status) {
  const text = String(status || "").toLowerCase();
  if (text.includes("superseded")) return "SUPERSEDED";
  if (text.includes("announced")) return "ANNOUNCED_NOT_OPERATIONAL";
  if (text.includes("component")) return "ACTIVE_COMPONENT";
  if (text.includes("verify")) return "ACTIVE_VERIFY";
  return "ACTIVE";
}
catalog.getRange("A6:V41").values = schemes.map(r => {
  const row = [...r];
  row[7] = normalizeStatus(row[7]);
  return [...row, verified];
});
bodyStyle(catalog.getRange("A6:V41"));
catalog.getRange("V6:V41").format.numberFormat = "yyyy-mm-dd";
catalog.getRange("H6:H41").dataValidation = { rule: { type: "list", values: ["ACTIVE", "ACTIVE_COMPONENT", "ACTIVE_VERIFY", "SUPERSEDED", "ANNOUNCED_NOT_OPERATIONAL"] } };
catalog.getRange("A6:A41").format = { font: { bold: true, color: navy, name: bodyFont }, verticalAlignment: "top" };
catalog.getRange("H6:H41").conditionalFormats.add("containsText", { text: "SUPERSEDED", format: { fill: paleRed, font: { bold: true, color: "#991B1B" } } });
catalog.getRange("H6:H41").conditionalFormats.add("containsText", { text: "ANNOUNCED", format: { fill: paleAmber, font: { bold: true, color: "#92400E" } } });
catalog.getRange("H6:H41").conditionalFormats.add("containsText", { text: "ACTIVE", format: { fill: paleTeal, font: { color: "#065F46" } } });
tableStyle(catalog, "A5:V41", "SchemeCatalogTable");
bodyStyle(catalog.getRange("A6:V41"));
catalog.freezePanes.freezeRows(5);
catalog.freezePanes.freezeColumns(2);
const catWidths = [12, 30, 18, 24, 22, 30, 24, 28, 24, 48, 58, 34, 48, 52, 38, 38, 40, 44, 20, 32, 34, 14];
catWidths.forEach((w, i) => catalog.getRangeByIndexes(0, i, 1, 1).format.columnWidth = w);
catalog.getRange("A6:V41").format.rowHeight = 78;
catalog.getRange("A6:V41").format.font = { name: bodyFont, size: 9, color: "#1F2937" };
catalog.getRange("A6:V41").format.borders = { insideHorizontal: { style: "thin", color: lightBorder }, insideVertical: { style: "thin", color: lightBorder } };

// Rules
setTitle(ruleSheet, "Scheme Rules", "Rule-engine-ready data. HARD rules can block eligibility; CONDITIONAL rules trigger only when their condition is met; SOFT rules affect ranking; VERIFY and STATUS prevent overclaiming.", "K");
const ruleHeaders = ["Rule ID", "Scheme ID", "Component", "Rule Class", "Profile Field", "Operator", "Value / Logic", "Plain-English Requirement", "Engine Effect", "Implementation Note", "Source URL"];
ruleSheet.getRange("A5:K5").values = [ruleHeaders];
headerStyle(ruleSheet.getRange("A5:K5"));
ruleSheet.getRange(`A6:K${5+rules.length}`).values = rules.map(row => row.map((value, index) => index === 5 && value === "=" ? "'=" : value));
bodyStyle(ruleSheet.getRange(`A6:K${5+rules.length}`));
ruleSheet.getRange("D6:D66").dataValidation = { rule: { type: "list", values: ["HARD", "CONDITIONAL", "SOFT", "VERIFY", "STATUS"] } };
ruleSheet.getRange("D6:D66").conditionalFormats.add("containsText", { text: "HARD", format: { fill: paleRed, font: { bold: true, color: "#991B1B" } } });
ruleSheet.getRange("D6:D66").conditionalFormats.add("containsText", { text: "CONDITIONAL", format: { fill: paleAmber, font: { bold: true, color: "#92400E" } } });
ruleSheet.getRange("D6:D66").conditionalFormats.add("containsText", { text: "SOFT", format: { fill: paleTeal, font: { color: "#065F46" } } });
tableStyle(ruleSheet, `A5:K${5+rules.length}`, "SchemeRulesTable");
bodyStyle(ruleSheet.getRange(`A6:K${5+rules.length}`));
ruleSheet.freezePanes.freezeRows(5);
ruleSheet.freezePanes.freezeColumns(2);
[12, 12, 20, 16, 28, 16, 34, 42, 20, 46, 44].forEach((w, i) => ruleSheet.getRangeByIndexes(0, i, 1, 1).format.columnWidth = w);
ruleSheet.getRange(`A6:K${5+rules.length}`).format.rowHeight = 52;
ruleSheet.getRange(`A6:K${5+rules.length}`).format.font = { name: bodyFont, size: 9, color: "#1F2937" };

// Profile Fields
setTitle(fieldSheet, "Profile Fields", "Canonical fields for the future eligibility intake and matching engine. Keep unknown values explicit; do not silently treat missing evidence as satisfied.", "G");
fieldSheet.getRange("A5:G5").values = [["Field Key", "Label", "Data Type", "Allowed / Format", "Used By", "Evidence / Document", "Engine Note"]];
headerStyle(fieldSheet.getRange("A5:G5"));
fieldSheet.getRange(`A6:G${5+profileFields.length}`).values = profileFields;
bodyStyle(fieldSheet.getRange(`A6:G${5+profileFields.length}`));
tableStyle(fieldSheet, `A5:G${5+profileFields.length}`, "ProfileFieldsTable");
bodyStyle(fieldSheet.getRange(`A6:G${5+profileFields.length}`));
fieldSheet.freezePanes.freezeRows(5);
fieldSheet.freezePanes.freezeColumns(1);
[30, 26, 16, 38, 42, 34, 64].forEach((w, i) => fieldSheet.getRangeByIndexes(0, i, 1, 1).format.columnWidth = w);
fieldSheet.getRange(`A6:G${5+profileFields.length}`).format.rowHeight = 44;

// Documents
setTitle(docSheet, "Document Checklist", "Starter checklist for guided applications. Treat ‘Mandatory’ as a prompt, not a legal conclusion; final requirements come from the implementing authority and lender.", "G");
docSheet.getRange("A5:G5").values = [["Scheme ID", "Scheme", "Document / Proof", "Requirement", "Why It Matters", "Applicant / Entity", "Source URL"]];
headerStyle(docSheet.getRange("A5:G5"));
docSheet.getRange(`A6:G${5+docs.length}`).values = docs;
bodyStyle(docSheet.getRange(`A6:G${5+docs.length}`));
docSheet.getRange("D6:D60").dataValidation = { rule: { type: "list", values: ["Mandatory", "Conditional", "Recommended", "To be confirmed"] } };
docSheet.getRange("D6:D60").conditionalFormats.add("containsText", { text: "Mandatory", format: { fill: paleRed, font: { bold: true, color: "#991B1B" } } });
docSheet.getRange("D6:D60").conditionalFormats.add("containsText", { text: "Conditional", format: { fill: paleAmber, font: { color: "#92400E" } } });
tableStyle(docSheet, `A5:G${5+docs.length}`, "DocumentChecklistTable");
bodyStyle(docSheet.getRange(`A6:G${5+docs.length}`));
docSheet.freezePanes.freezeRows(5);
[12, 24, 38, 18, 44, 28, 46].forEach((w, i) => docSheet.getRangeByIndexes(0, i, 1, 1).format.columnWidth = w);
docSheet.getRange(`A6:G${5+docs.length}`).format.rowHeight = 44;

// Sources
setTitle(sourceSheet, "Source Register", "Official source URLs used to populate the catalogue. Refresh the verification date before production deployment or hackathon demo claims.", "H");
sourceSheet.getRange("A5:H5").values = [["Source ID", "Organisation", "Source Title", "Official URL", "Source Type", "Key Fact Used", "Confidence", "Verified On"]];
headerStyle(sourceSheet.getRange("A5:H5"));
sourceSheet.getRange(`A6:H${5+sources.length}`).values = sources.map(r => [...r.slice(0,7), new Date(2026,7,27)]);
bodyStyle(sourceSheet.getRange(`A6:H${5+sources.length}`));
sourceSheet.getRange(`H6:H${5+sources.length}`).format.numberFormat = "yyyy-mm-dd";
sourceSheet.getRange(`G6:G${5+sources.length}`).dataValidation = { rule: { type: "list", values: ["High", "Medium", "Low"] } };
tableStyle(sourceSheet, `A5:H${5+sources.length}`, "SourceRegisterTable");
bodyStyle(sourceSheet.getRange(`A6:H${5+sources.length}`));
sourceSheet.freezePanes.freezeRows(5);
[12, 30, 34, 54, 20, 60, 14, 14].forEach((w, i) => sourceSheet.getRangeByIndexes(0, i, 1, 1).format.columnWidth = w);
sourceSheet.getRange(`A6:H${5+sources.length}`).format.rowHeight = 50;

// State expansion
setTitle(stateSheet, "State / UT Expansion Queue", "State and UT schemes are deliberately left for a later, location-aware research pass. This avoids claiming a single national list where rules are state-specific.", "D");
stateSheet.getRange("A5:D5").values = [["State / UT", "Likely Official Entry Point", "Research Status", "Next Action"]];
headerStyle(stateSheet.getRange("A5:D5"));
stateSheet.getRange(`A6:D${5+expansion.length}`).values = expansion;
bodyStyle(stateSheet.getRange(`A6:D${5+expansion.length}`));
stateSheet.getRange(`C6:C${5+expansion.length}`).dataValidation = { rule: { type: "list", values: ["To be researched", "In progress", "Verified", "Not applicable"] } };
stateSheet.getRange(`C6:C${5+expansion.length}`).conditionalFormats.add("containsText", { text: "To be researched", format: { fill: paleAmber, font: { color: "#92400E" } } });
tableStyle(stateSheet, `A5:D${5+expansion.length}`, "StateExpansionTable");
bodyStyle(stateSheet.getRange(`A6:D${5+expansion.length}`));
stateSheet.freezePanes.freezeRows(5);
[28, 46, 22, 70].forEach((w, i) => stateSheet.getRangeByIndexes(0, i, 1, 1).format.columnWidth = w);
stateSheet.getRange(`A6:D${5+expansion.length}`).format.rowHeight = 36;

// Dashboard
setTitle(dash, "Dashboard | SC/ST entrepreneur scheme library", "A compact overview for the team: what is current, what is targeted, and where the matching engine should send a user next.", "N");
dash.getRange("A4:N4").merge();
dash.getRange("A4").values = [["Central / national coverage snapshot"]];
dash.getRange("A4:N4").format = { fill: saffron, font: { bold: true, color: "#FFFFFF", name: bodyFont }, verticalAlignment: "center" };
const cards = [
  ["Catalogued schemes", "=COUNTA('Scheme Catalog'!$A$6:$A$41)", "All rows in the central/national catalogue"],
  ["Active / verify", "=COUNTIF('Scheme Catalog'!$H$6:$H$41,\"ACTIVE\")+COUNTIF('Scheme Catalog'!$H$6:$H$41,\"ACTIVE_COMPONENT\")+COUNTIF('Scheme Catalog'!$H$6:$H$41,\"ACTIVE_VERIFY\")", "Current or current-looking rows"],
  ["SC/ST-targeted", "=COUNTIF('Scheme Catalog'!$E$6:$E$41,\"SC and ST\")+COUNTIF('Scheme Catalog'!$E$6:$E$41,\"SC\")+COUNTIF('Scheme Catalog'!$E$6:$E$41,\"ST\")", "Direct SC/ST focus"],
  ["Rule rows", "=COUNTA('Scheme Rules'!$A$6:$A$66)", "Structured rules and status controls"],
  ["Official sources", "=COUNTA('Source Register'!$A$6:$A$30)", "Source register rows"],
  ["State/UT queue", "=COUNTA('State Expansion'!$A$6:$A$41)", "Locations waiting for next pass"],
];
const cardCols = [["A", "C"], ["D", "F"], ["G", "I"], ["J", "K"], ["L", "M"], ["N", "N"]];
for (let i = 0; i < cards.length; i++) {
  const [s,e] = cardCols[i];
  dash.mergeCells(`${s}5:${e}5`);
  dash.mergeCells(`${s}6:${e}6`);
  dash.mergeCells(`${s}7:${e}7`);
  dash.getRange(`${s}5`).values = [[cards[i][0]]];
  dash.getRange(`${s}6`).formulas = [[cards[i][1]]];
  dash.getRange(`${s}7`).values = [[cards[i][2]]];
  dash.getRange(`${s}5:${e}5`).format = { fill: sky, font: { bold: true, color: navy, size: 10, name: bodyFont }, horizontalAlignment: "center", verticalAlignment: "center" };
  dash.getRange(`${s}6:${e}6`).format = { fill: paleTeal, font: { bold: true, color: teal, size: 20, name: bodyFont }, horizontalAlignment: "center", verticalAlignment: "center" };
  dash.getRange(`${s}7:${e}7`).format = { fill: "#F8FAFC", font: { color: gray, size: 9, name: bodyFont }, wrapText: true, horizontalAlignment: "center", verticalAlignment: "center" };
}
dash.getRange("A5:N7").format.borders = { preset: "outside", style: "thin", color: lightBorder };
dash.getRange("A5:N7").format.rowHeight = 24;
dash.getRange("A8:N8").format.rowHeight = 8;

dash.getRange("A10:F10").merge();
dash.getRange("A10").values = [["Best entry points by entrepreneur need"]];
dash.getRange("A10:F10").format = { fill: saffron, font: { bold: true, color: "#FFFFFF", name: bodyFont } };
dash.getRange("A11:F16").values = [
  ["Need", "Start with", "Why it matters", "Direct / indirect", "Engine note", "Status caution"],
  ["New micro-enterprise", "PMEGP", "High subsidy for SC/ST special category plus bank credit.", "Direct", "Use age, new-stage, capex and threshold rules.", "Negative list and bank appraisal apply."],
  ["Equipment / technology", "SCLCSS", "25% subsidy on new plant/machinery through institutional credit.", "Direct", "Use SC/ST ownership, sector and capex rules.", "Current intake / PLI verification."],
  ["Small SC business loan", "NSFDC MFS / UNY", "SC-exclusive concessional products by project size.", "Direct", "Use income and project-cost bands.", "SCA/lender terms vary."],
  ["Tribal enterprise", "NSTFDC Term Loan / VCF-ST", "ST-specific debt or startup/venture route.", "Direct", "Use ST, state/tribe and entity checks.", "Notified-tribe and channelising rules."],
  ["Government market access", "PPP-MSE + SPRS + NSSH", "SC/ST sub-target and procurement onboarding.", "Indirect / market", "Use MSE, ownership and tender checks.", "Not a cash grant."],
];
headerStyle(dash.getRange("A11:F11"));
bodyStyle(dash.getRange("A12:F16"));
dash.getRange("A12:F16").format.rowHeight = 54;

dash.getRange("H10:N10").merge();
dash.getRange("H10").values = [["Status controls that protect the demo"]];
dash.getRange("H10:N10").format = { fill: saffron, font: { bold: true, color: "#FFFFFF", name: bodyFont } };
dash.getRange("H11:N15").values = [
  ["Control", "Why it matters", "Current treatment", "Do not do", "Next action", "Owner", "Priority"],
  ["SUPI", "Historical scheme can appear in stale datasets.", "SUPERSEDED", "Do not recommend as apply-now.", "Monitor successor notification.", "Product", "P0"],
  ["First-timer ₹2cr", "Budget announcement may be mistaken for a live product.", "ANNOUNCED_NOT_OPERATIONAL", "Do not collect a false checklist.", "Refresh DFS status.", "Research", "P0"],
  ["PMFME", "Original five-year window has ended, portal remains live.", "ACTIVE_PORTAL_VERIFY", "Do not assume universal availability.", "Verify current intake/state.", "Research", "P1"],
  ["Component schemes", "Different applicants follow different rule sets.", "Route by component first", "Do not use flat eligibility.", "Add component_id to matcher.", "Engineering", "P0"],
];
headerStyle(dash.getRange("H11:N11"));
bodyStyle(dash.getRange("H12:N15"));
dash.getRange("H12:N15").format.rowHeight = 58;
dash.getRange("H12:N15").conditionalFormats.add("containsText", { text: "P0", format: { fill: paleRed, font: { bold: true, color: "#991B1B" } } });

dash.getRange("A19:D19").values = [["Target Group", "Count", "Targeted / priority?", "Formula driver"]];
headerStyle(dash.getRange("A19:D19"));
dash.getRange("A20:D24").values = [
  ["SC", null, "Yes", "Rows with Target Group = SC"],
  ["ST", null, "Yes", "Rows with Target Group = ST"],
  ["SC and ST", null, "Yes", "Rows with Target Group = SC and ST"],
  ["SC/ST priority within general scheme", null, "Priority", "Rows with target text containing SC/ST"],
  ["Complementary / general", null, "No", "General schemes with SC/ST relevance"],
];
dash.getRange("B20").formulas = [["=COUNTIF('Scheme Catalog'!$E$6:$E$41,\"SC\")"]];
dash.getRange("B21").formulas = [["=COUNTIF('Scheme Catalog'!$E$6:$E$41,\"ST\")"]];
dash.getRange("B22").formulas = [["=COUNTIF('Scheme Catalog'!$E$6:$E$41,\"SC and ST\")"]];
dash.getRange("B23").formulas = [["=COUNTIF('Scheme Catalog'!$E$6:$E$41,\"SC/ST special coverage within MSE scheme\")+COUNTIF('Scheme Catalog'!$E$6:$E$41,\"SC/ST not exclusive; inclusive institutional credit\")+COUNTIF('Scheme Catalog'!$E$6:$E$41,\"SC/ST not exclusive; group and micro-food focus\")+COUNTIF('Scheme Catalog'!$E$6:$E$41,\"SC/ST not exclusive; traditional artisans\")+COUNTIF('Scheme Catalog'!$E$6:$E$41,\"SC/ST artisans can benefit within clusters\")+COUNTIF('Scheme Catalog'!$E$6:$E$41,\"SC/ST eligible within rural SHG ecosystem\")+COUNTIF('Scheme Catalog'!$E$6:$E$41,\"SC/ST eligible within urban-poor target group\")"]];
dash.getRange("B24").formulas = [["=COUNTIF('Scheme Catalog'!$A$6:$A$41,\"SCST-26\")+COUNTIF('Scheme Catalog'!$A$6:$A$41,\"SCST-27\")+COUNTIF('Scheme Catalog'!$A$6:$A$41,\"SCST-28\")+COUNTIF('Scheme Catalog'!$A$6:$A$41,\"SCST-29\")+COUNTIF('Scheme Catalog'!$A$6:$A$41,\"SCST-30\")+COUNTIF('Scheme Catalog'!$A$6:$A$41,\"SCST-31\")+COUNTIF('Scheme Catalog'!$A$6:$A$41,\"SCST-32\")+COUNTIF('Scheme Catalog'!$A$6:$A$41,\"SCST-33\")+COUNTIF('Scheme Catalog'!$A$6:$A$41,\"SCST-34\")"]];
bodyStyle(dash.getRange("A20:D24"));
dash.getRange("B20:B24").format = { fill: paleTeal, font: { bold: true, color: teal, size: 14, name: bodyFont }, horizontalAlignment: "center" };
tableStyle(dash, "A19:D24", "DashboardTargetMixTable");
bodyStyle(dash.getRange("A20:D24"));

dash.getRange("F19:G19").values = [["Lifecycle Status", "Count"]];
headerStyle(dash.getRange("F19:G19"));
dash.getRange("F20:G23").values = [["Active / verify", null], ["Active component", null], ["Superseded", null], ["Announced / not operational", null]];
dash.getRange("G20").formulas = [["=COUNTIF('Scheme Catalog'!$H$6:$H$41,\"ACTIVE\")+COUNTIF('Scheme Catalog'!$H$6:$H$41,\"ACTIVE_COMPONENT\")+COUNTIF('Scheme Catalog'!$H$6:$H$41,\"ACTIVE_VERIFY\")"]];
dash.getRange("G21").formulas = [["=COUNTIF('Scheme Catalog'!$H$6:$H$41,\"ACTIVE_COMPONENT\")"]];
dash.getRange("G22").formulas = [["=COUNTIF('Scheme Catalog'!$H$6:$H$41,\"SUPERSEDED\")"]];
dash.getRange("G23").formulas = [["=COUNTIF('Scheme Catalog'!$H$6:$H$41,\"ANNOUNCED_NOT_OPERATIONAL\")"]];
bodyStyle(dash.getRange("F20:G23"));
dash.getRange("G20:G23").format = { fill: paleTeal, font: { bold: true, color: teal, size: 14, name: bodyFont }, horizontalAlignment: "center" };
tableStyle(dash, "F19:G23", "DashboardStatusTable");
bodyStyle(dash.getRange("F20:G23"));

dash.getRange("I19:J19").values = [["Scheme Type", "Count"]];
headerStyle(dash.getRange("I19:J19"));
dash.getRange("I20:J25").values = [["Direct individual", null], ["Credit-linked / guarantee", null], ["Training / handholding", null], ["Market / procurement", null], ["Cluster / value-chain", null], ["Venture / incubation", null]];
dash.getRange("J20").formulas = [["=COUNTIF('Scheme Catalog'!$G$6:$G$41,\"Credit-linked capital subsidy\")+COUNTIF('Scheme Catalog'!$G$6:$G$41,\"Credit-linked margin-money subsidy\")+COUNTIF('Scheme Catalog'!$G$6:$G$41,\"Concessional term loan\")+COUNTIF('Scheme Catalog'!$G$6:$G$41,\"Micro-credit\")+COUNTIF('Scheme Catalog'!$G$6:$G$41,\"Micro-finance\")+COUNTIF('Scheme Catalog'!$G$6:$G$41,\"Concessional loan\")+COUNTIF('Scheme Catalog'!$G$6:$G$41,\"Short-term bridge loan\")+COUNTIF('Scheme Catalog'!$G$6:$G$41,\"Collateral-free credit\")+COUNTIF('Scheme Catalog'!$G$6:$G$41,\"Credit-linked subsidy / grant / formalisation\")+COUNTIF('Scheme Catalog'!$G$6:$G$41,\"Composite bank loan\")+COUNTIF('Scheme Catalog'!$G$6:$G$41,\"Announced term-loan scheme\")"]];
dash.getRange("J21").formulas = [["=COUNTIF('Scheme Catalog'!$G$6:$G$41,\"Credit guarantee\")"]];
dash.getRange("J22").formulas = [["=COUNTIF('Scheme Catalog'!$G$6:$G$41,\"Umbrella / handholding\")+COUNTIF('Scheme Catalog'!$G$6:$G$41,\"Training / handholding\")+COUNTIF('Scheme Catalog'!$G$6:$G$41,\"Training / entrepreneurship development\")"]];
dash.getRange("J23").formulas = [["=COUNTIF('Scheme Catalog'!$G$6:$G$41,\"Market access / reimbursement\")+COUNTIF('Scheme Catalog'!$G$6:$G$41,\"Reimbursement / competitiveness support\")+COUNTIF('Scheme Catalog'!$G$6:$G$41,\"Market access / policy\")+COUNTIF('Scheme Catalog'!$G$6:$G$41,\"Registration / procurement access\")"]];
dash.getRange("J24").formulas = [["=COUNTIF('Scheme Catalog'!$G$6:$G$41,\"Cluster / handholding / value-chain\")+COUNTIF('Scheme Catalog'!$G$6:$G$41,\"Cluster / value-chain / market support\")+COUNTIF('Scheme Catalog'!$G$6:$G$41,\"Cluster grant / common facility\")+COUNTIF('Scheme Catalog'!$G$6:$G$41,\"Cluster grant / common facilities\")"]];
dash.getRange("J25").formulas = [["=COUNTIF('Scheme Catalog'!$G$6:$G$41,\"Venture capital / concessional finance\")+COUNTIF('Scheme Catalog'!$G$6:$G$41,\"Incubation / concessional finance\")"]];
bodyStyle(dash.getRange("I20:J25"));
dash.getRange("J20:J25").format = { fill: paleTeal, font: { bold: true, color: teal, size: 14, name: bodyFont }, horizontalAlignment: "center" };
tableStyle(dash, "I19:J25", "DashboardTypeTable");
bodyStyle(dash.getRange("I20:J25"));

dash.getRange("A28:N28").merge();
dash.getRange("A28").values = [["Important: matching signal ≠ approval. Use this library to shortlist, explain and route; always verify the official portal, lender, state agency or implementing authority before displaying a final recommendation."]];
dash.getRange("A28:N28").format = { fill: paleAmber, font: { bold: true, color: "#92400E", name: bodyFont }, wrapText: true, verticalAlignment: "center" };
dash.getRange("A28:N28").format.rowHeight = 36;
dash.getRange("A29:N29").merge();
dash.getRange("A29").values = [["Sources and last-verified dates are on the Source Register sheet. Use the Scheme Rules and Profile Fields sheets as the input contract for later matcher integration."]];
dash.getRange("A29:N29").format = { fill: sky, font: { color: navy, name: bodyFont }, wrapText: true, verticalAlignment: "center" };
dash.getRange("A29:N29").format.rowHeight = 30;

// Dashboard helper range for charts; kept visible but subtle.
dash.getRange("L19:N23").values = [["Status", "Count", "Notes"], ["Active / verify", null, "Current or verify"], ["Active component", null, "Umbrella component"], ["Superseded", null, "Historical only"], ["Announced", null, "Watchlist only"]];
headerStyle(dash.getRange("L19:N19"));
dash.getRange("M20").formulas = [["=G20"]];
dash.getRange("M21").formulas = [["=G21"]];
dash.getRange("M22").formulas = [["=G22"]];
dash.getRange("M23").formulas = [["=G23"]];
bodyStyle(dash.getRange("L20:N23"));
dash.getRange("L20:N23").format.font = { name: bodyFont, size: 9, color: "#475569" };
const statusChart = dash.charts.add("doughnut", dash.getRange("L19:M23"));
statusChart.title = "Catalogue status mix";
statusChart.hasLegend = true;
statusChart.setPosition("A32", "F47");
const typeChart = dash.charts.add("bar", dash.getRange("I19:J25"));
typeChart.title = "Pathway coverage by scheme type";
typeChart.hasLegend = false;
typeChart.setPosition("H32", "N47");

dash.freezePanes.freezeRows(4);
[28, 28, 28, 24, 24, 28, 18, 28, 26, 16, 16, 18, 18, 18].forEach((w,i)=>dash.getRangeByIndexes(0,i,1,1).format.columnWidth = w);
dash.getRange("A12:F16").format.font = { name: bodyFont, size: 9, color: "#1F2937" };
dash.getRange("H12:N15").format.font = { name: bodyFont, size: 9, color: "#1F2937" };
dash.getRange("A20:D24").format.font = { name: bodyFont, size: 9, color: "#1F2937" };
dash.getRange("F20:G23").format.font = { name: bodyFont, size: 9, color: "#1F2937" };
dash.getRange("I20:J25").format.font = { name: bodyFont, size: 9, color: "#1F2937" };
dash.getRange("L20:N23").format.font = { name: bodyFont, size: 9, color: "#475569" };

// Ensure key title/header styles survive the table and body formatting passes.
readme.getRange("A1:H1").format = { fill: navy, font: { bold: true, color: "#FFFFFF", size: 18, name: bodyFont }, horizontalAlignment: "left", verticalAlignment: "center" };
dash.getRange("A1:N1").format = { fill: navy, font: { bold: true, color: "#FFFFFF", size: 18, name: bodyFont }, horizontalAlignment: "left", verticalAlignment: "center" };
catalog.getRange("A1:V1").format = { fill: navy, font: { bold: true, color: "#FFFFFF", size: 18, name: bodyFont }, horizontalAlignment: "left", verticalAlignment: "center" };
ruleSheet.getRange("A1:K1").format = { fill: navy, font: { bold: true, color: "#FFFFFF", size: 18, name: bodyFont }, horizontalAlignment: "left", verticalAlignment: "center" };
fieldSheet.getRange("A1:G1").format = { fill: navy, font: { bold: true, color: "#FFFFFF", size: 18, name: bodyFont }, horizontalAlignment: "left", verticalAlignment: "center" };
docSheet.getRange("A1:G1").format = { fill: navy, font: { bold: true, color: "#FFFFFF", size: 18, name: bodyFont }, horizontalAlignment: "left", verticalAlignment: "center" };
sourceSheet.getRange("A1:H1").format = { fill: navy, font: { bold: true, color: "#FFFFFF", size: 18, name: bodyFont }, horizontalAlignment: "left", verticalAlignment: "center" };
stateSheet.getRange("A1:D1").format = { fill: navy, font: { bold: true, color: "#FFFFFF", size: 18, name: bodyFont }, horizontalAlignment: "left", verticalAlignment: "center" };

const previewNames = ["Read Me", "Dashboard", "Scheme Catalog", "Scheme Rules", "Profile Fields", "Document Checklist", "Source Register", "State Expansion"];
for (const name of previewNames) {
  const preview = await wb.render({ sheetName: name, autoCrop: "all", scale: 1, format: "png" });
  await fs.writeFile(`${outputDir}/${name.replaceAll(" ", "_").toLowerCase()}.png`, new Uint8Array(await preview.arrayBuffer()));
}

const xlsx = await SpreadsheetFile.exportXlsx(wb);
await xlsx.save(`${outputDir}/SC-ST_Entrepreneur_Schemes_Yojana_Disha.xlsx`);

console.log(JSON.stringify({ output: `${outputDir}/SC-ST_Entrepreneur_Schemes_Yojana_Disha.xlsx`, sheets: previewNames, schemeRows: schemes.length, ruleRows: rules.length, sourceRows: sources.length, stateRows: expansion.length }));
