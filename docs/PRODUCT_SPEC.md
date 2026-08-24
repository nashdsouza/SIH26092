# Yojana Disha — Product Specification

## SIH26092 — AI-Driven Scheme Matching for Marginalized Entrepreneurs

> This document is the single source of truth for the product design and implementation.

## Status

Product planning phase.

## Problem

Marginalized entrepreneurs often struggle to identify government schemes that match their personal, business, and financial circumstances because scheme information is fragmented and eligibility requirements can be difficult to interpret.

## Solution

Yojana Disha is an AI-assisted platform that helps marginalized entrepreneurs discover government schemes that match their personal, business, and financial circumstances.

The platform evaluates an entrepreneur's profile against structured government-scheme eligibility rules, ranks relevant schemes, and clearly explains why each scheme is a match, near-match, or not currently applicable.

## Core Principle

Eligibility decisions are made by a structured rule-based matching engine.

AI is used to enhance the experience through explanation and assistance, not to independently determine eligibility.

## User Profile

The platform collects information required to evaluate the entrepreneur against scheme eligibility criteria.

### Personal Information

- Age
- State
- District
- Social Category
- Gender
- Disability Status

### Business Information

- Business Stage
- Business Sector
- Business Activity
- Existing Business Status
- Business Ownership Percentage

### Financial Information

- Annual Family Income
- Expected Project / Investment Amount
- Required Loan Amount

### Additional Eligibility Information

- Previous Government / Business Loan
- Previous Loan Repaid Successfully
- Udyam Registration Status
- Government Employment Status
- Traditional Artisan / Recognized Trade Status
- Rural / Urban Location

## Scheme Classification

Not every government programme can be evaluated in exactly the same way. Yojana Disha classifies schemes into three categories.

### 1. Direct Individual Schemes

The entrepreneur can be evaluated directly against structured eligibility criteria.

Examples:
- PMEGP
- PMMY
- PM Vishwakarma
- NBCFDC General Loan

These are the primary schemes used by the matching engine.

### 2. Component-Based Schemes

The parent programme contains multiple components with different eligibility criteria.

Examples:
- PMFME
- NSSH / SCLCSS
- NSFDC

The matching engine evaluates the relevant component rather than treating the entire programme as one flat rule.

### 3. Indirect / Programme-Level Schemes

Some programmes benefit entrepreneurs through clusters, institutions, local implementing agencies, or other intermediaries rather than providing a direct individual application.

Examples:
- SFURTI
- DAY-NRLM / SVEP in certain contexts

These should not be presented as guaranteed individual eligibility. Instead, the platform may show them as potential opportunities with an appropriate verification note.

## Matching Outcome Types

The platform uses three primary result categories:

### 🟢 Eligible

All known mandatory eligibility conditions are satisfied based on the information provided.

This does not constitute official government approval or guarantee of eligibility.

### 🟡 Near Match

The user's profile strongly aligns with a scheme, but one or more conditions are currently unmet, conditional, or require verification.

The platform should clearly explain what is preventing a stronger match and, where possible, what the user can do next.

### 🔴 Not Eligible

At least one known hard eligibility condition is not satisfied.

The platform should identify the specific condition that caused the result rather than simply displaying "Not Eligible."

## Important Limitation

Yojana Disha does not claim to replace official government eligibility verification.

Where eligibility depends on information that the platform cannot independently verify — such as local programme coverage, documentation, government databases, lender assessment, or scheme-specific implementation conditions — the result must clearly indicate that verification with the relevant authority is required.

## Matching Engine

The matching engine evaluates a user's structured profile against the eligibility rules of each supported scheme.

The engine operates in two stages:

### Stage 1 — Hard Eligibility Evaluation

Hard rules determine whether a scheme fundamentally applies to the user's profile.

A hard rule may include:
- Minimum or maximum age
- Required social category
- Required business stage
- Required sector or activity
- Income ceiling
- Location requirement
- Required artisan/trade status
- Required previous-loan condition
- Disqualifying conditions
- Scheme-specific exclusions

Rules may use:
- AND conditions
- OR conditions
- NOT conditions
- Comparisons such as >=, <=, > and <
- Membership conditions such as IN
- Nested conditions where one requirement only applies when another condition is met

Example:

    age >= 18
    AND business_stage = "new"
    AND eligible_activity = true

Conditional example:

    age >= 18
    AND (
        project_amount <= threshold
        OR education_level >= required_level
    )

A scheme should not be marked Eligible when a known mandatory hard condition fails.

### Stage 2 — Match Strength

After the hard eligibility evaluation, the system calculates a match strength for schemes that are applicable or potentially applicable.

Match strength is separate from legal eligibility.

The system must never present a percentage as a percentage of legal eligibility.

For example:

    🟢 Eligible
    92% Match

means that the user's profile strongly matches the scheme based on the factors available to Yojana Disha. It does not mean that the government has determined the user to be 92% eligible.

Soft factors may include:
- Alignment between business activity and scheme focus
- Alignment with preferred sectors or target groups
- Project/loan amount fit
- ODOP or similar priority alignment
- Other non-disqualifying scheme preferences

### Hard vs Conditional vs Soft Rules

Each scheme rule should be classified as one of:

**HARD**
A failed condition can make the user Not Eligible.

**CONDITIONAL**
A condition becomes mandatory only when another condition is triggered.

**SOFT**
A condition affects match strength or ranking but does not independently make the user Not Eligible.

### Near Match Logic

A Near Match is used when:
- The user's profile strongly aligns with the scheme;
- One or more conditions are currently unmet, conditional, or require verification; and
- The issue is potentially addressable or cannot be conclusively verified by the platform.

Examples include:
- Required documentation not yet confirmed
- A conditional requirement not currently satisfied
- Project amount outside a preferred range
- Local programme coverage requiring verification
- A missing requirement that the entrepreneur may be able to satisfy

The system should explain the specific reason for the Near Match.

### Not Eligible Logic

A scheme is Not Eligible when a known hard requirement fails.

Examples:

    age < minimum_age
    required_category = SC
    user_category = OBC

or:

    required_sector = food_processing
    user_sector = software

The result should identify the failed requirement.

### Unverifiable Conditions

Some eligibility conditions cannot be reliably verified using the information available to Yojana Disha.

Examples:
- Local implementing-agency coverage
- Government database records
- Official document verification
- Lender approval
- Certain scheme-specific implementation conditions

These conditions must not be silently treated as satisfied.

The system should instead flag the result as requiring verification.

### Scheme Rule Structure

Each supported scheme will contain structured eligibility rules rather than a single eligibility flag.

Conceptually:

    Scheme
      ├── Status
      ├── Scheme Type
      ├── Components
      ├── Hard Rules
      ├── Conditional Rules
      ├── Soft Factors
      ├── Exclusions
      ├── Benefits
      ├── Required Documents
      ├── Official Source
      └── Last Verified Date

Component-based schemes may contain separate rule sets for different components.

For example:

    PMFME
      ├── Individual Unit
      ├── SHG
      ├── FPO
      └── Cooperative

The engine should evaluate the relevant component rather than applying unrelated component rules to every user.

### Ranking

After evaluating applicable schemes, results are ranked using match strength and relevance.

The ranking must not override hard eligibility.

A scheme that fails a mandatory requirement cannot become Eligible simply because its soft-match score is high.

The results should prioritize:
1. Eligible schemes
2. Strong Near Matches
3. Other potentially relevant schemes requiring verification

### Explainability

Every result should retain the individual rule evaluations used to produce it.

For example:

    PMEGP
    Status: Eligible

    ✓ Age requirement satisfied
    ✓ New enterprise requirement satisfied
    ✓ Eligible activity
    ✓ Project amount within applicable limit
    ✓ Education requirement satisfied

This allows the platform to explain the result without relying on the AI model to reconstruct the decision.

AI may subsequently convert these structured results into simpler natural-language explanations.
## Scheme Rule Specification

### PMEGP — Prime Minister's Employment Generation Programme

#### Scheme Type

Direct Individual Scheme

#### Status

Active

#### Primary Purpose

Credit-linked subsidy support for eligible entrepreneurs establishing new micro-enterprises, with a separate upgradation pathway for certain existing PMEGP/MUDRA units.

#### Hard Eligibility Rules

##### New Enterprise Path

    applicant_type = "individual"
    AND age >= 18
    AND business_stage = "new"
    AND activity_is_eligible = true
    AND activity_is_not_in_negative_list = true

##### Upgradation Path

    business_stage = "existing"
    AND existing_unit_is_eligible_for_upgradation = true
    AND previous_assistance_requirements_satisfied = true
    AND previous_loan_repaid_on_time = true

The engine must evaluate the appropriate path based on the user's business stage.

#### Conditional Education Rule

For the new-enterprise pathway:

    IF sector = "manufacturing"
    AND project_amount > ₹10 lakh
    THEN education_level >= "VIII standard"

    IF sector = "service"
    AND project_amount > ₹5 lakh
    THEN education_level >= "VIII standard"

The education requirement must not be applied to projects below these thresholds.

#### Income

No general income ceiling is used for PMEGP eligibility.

#### Social Category

SC/ST/OBC/women/minority and other special-category status does not determine basic eligibility.

Special-category status may affect subsidy/contribution treatment and therefore can influence the scheme's match information.

#### Business Stage

Two supported pathways:

- New enterprise
- Eligible existing unit upgradation

#### Sector

Eligible manufacturing and service/business activities are supported subject to the scheme's negative list.

The negative list must be represented explicitly in the scheme data rather than as a vague text condition.

#### Udyam Registration

Udyam registration should NOT be treated as an initial hard eligibility gate.

It is relevant during the downstream implementation/verification process.

The UI may display:

    "Udyam Registration may be required during later stages."

#### Hard Exclusions

Examples of conditions that can disqualify the applicant include:

- Existing unit that does not satisfy the applicable upgradation pathway
- Activity appearing on the scheme's negative list
- Failure to satisfy applicable education requirement when the project threshold triggers it
- Failure to satisfy applicable project/financial conditions

#### Soft / Priority Factors

Potential factors for match-strength calculation:

- Special-category status
- Project amount fit
- Alignment between business activity and supported sectors

Soft factors must never override a failed hard eligibility condition.

#### Near Match Conditions

Potential Near Match cases include:

- Applicant otherwise qualifies but a required document/registration has not yet been confirmed
- Applicant is pursuing an existing-business pathway but required upgradation conditions are not yet verified
- A conditional education requirement is triggered but education information is missing
- Project/activity information requires verification

#### Example Rule Structure

Conceptually:

    PMEGP
      ├── New Enterprise
      │     ├── age >= 18
      │     ├── individual
      │     ├── new business
      │     ├── eligible activity
      │     ├── not negative-list activity
      │     └── conditional education rule
      │
      └── Existing Unit Upgradation
            ├── eligible existing unit
            ├── previous assistance conditions
            └── repayment conditions

#### Explanation Template

Eligible:

    "You appear to meet the known PMEGP eligibility requirements for a
    new enterprise. You meet the age, business-stage and activity
    requirements. Your project amount also does not trigger an
    additional education requirement."

Near Match:

    "Your profile appears relevant to PMEGP, but we could not confirm
    [specific requirement]. Please verify this requirement before
    applying."

Not Eligible:

    "You currently do not meet PMEGP's known requirements because
    [specific hard condition] is not satisfied."

#### Verification

The result should include:

- Official scheme name
- Scheme status
- Official source
- Last verified date
- Disclaimer that final eligibility is determined by the implementing authority

### PMMY — Pradhan Mantri MUDRA Yojana

#### Scheme Type

Direct Individual Scheme

#### Status

Active

#### Primary Purpose

Collateral-free institutional credit for eligible micro-enterprises and income-generating activities.

#### Hard Eligibility Rules

    eligible_micro_enterprise = true
    AND eligible_income_generating_activity = true
    AND activity_is_eligible = true

The applicant may be starting a new business or operating an existing micro-enterprise, subject to lender assessment and applicable scheme conditions.

#### Loan Categories

PMMY provides different loan categories:

- Shishu — up to ₹50,000
- Kishore — above ₹50,000 and up to ₹5 lakh
- Tarun — above ₹5 lakh and up to ₹10 lakh
- Tarun Plus — above ₹10 lakh and up to ₹20 lakh

#### Conditional Tarun Plus Rule

Tarun Plus has an additional requirement:

    IF loan_amount > ₹10 lakh
    AND loan_amount <= ₹20 lakh
    THEN previous_tarun_loan_repaid_successfully = true

The previous-loan requirement applies to Tarun Plus and must not be applied to Shishu, Kishore or Tarun.

#### Eligible Activities

The scheme can support eligible income-generating activities including:

- Manufacturing
- Trading
- Services
- Agriculture-allied activities such as poultry, dairy and beekeeping

The activity must fall within the applicable PMMY lending framework.

#### Social Category

No general SC/ST/OBC/women requirement is used as a hard eligibility gate for PMMY.

Social category may still be useful for ranking or displaying other applicable schemes.

#### Income

No general beneficiary income ceiling is used in the central PMMY eligibility information.

#### Business Stage

Both new and existing micro-enterprises may be considered, subject to lender assessment and applicable scheme conditions.

#### State

PMMY is a national scheme.

No state-residence restriction is applied by the central scheme.

#### Loan Amount

    Shishu: <= ₹50,000
    Kishore: > ₹50,000 AND <= ₹5 lakh
    Tarun: > ₹5 lakh AND <= ₹10 lakh
    Tarun Plus: > ₹10 lakh AND <= ₹20 lakh

The requested loan amount determines the applicable category.

#### Previous Loan

Previous Tarun-loan repayment is a hard condition only for Tarun Plus.

    loan_amount <= ₹10 lakh
    → previous Tarun repayment not required

    loan_amount > ₹10 lakh AND <= ₹20 lakh
    → previous Tarun loan successfully repaid required

#### Lender Assessment

PMMY eligibility does not guarantee loan approval.

The lending institution may conduct its own assessment before approving credit.

Therefore:

    scheme_match != loan_approval

#### Hard Exclusions

Potential hard failures include:

- Activity not eligible under the PMMY framework
- Requested amount outside the applicable PMMY limits
- Failure to satisfy Tarun Plus previous-loan condition
- Failure to satisfy applicable lender/institutional requirements

#### Soft / Priority Factors

Potential match-strength factors:

- Requested loan amount closely fits an applicable PMMY category
- Business activity aligns strongly with supported micro-enterprise activities
- Business stage aligns with the intended use of the loan

Soft factors must never override a hard failure.

#### Near Match Conditions

Potential Near Match cases include:

- Applicant appears suitable but lender eligibility cannot be verified by Yojana Disha
- Applicant requests more than ₹10 lakh but has not confirmed successful repayment of a previous Tarun loan
- Activity requires lender-level verification
- Required documentation has not been confirmed

#### Example Rule Structure

Conceptually:

    PMMY
      ├── Shishu
      │     └── loan_amount <= ₹50,000
      │
      ├── Kishore
      │     ├── loan_amount > ₹50,000
      │     └── loan_amount <= ₹5 lakh
      │
      ├── Tarun
      │     ├── loan_amount > ₹5 lakh
      │     └── loan_amount <= ₹10 lakh
      │
      └── Tarun Plus
            ├── loan_amount > ₹10 lakh
            ├── loan_amount <= ₹20 lakh
            └── previous Tarun loan successfully repaid

#### Explanation Template

Eligible:

    "Your profile matches the known PMMY requirements and your
    requested loan amount falls within the [category] range."

Near Match:

    "PMMY may be relevant to you, but [specific requirement] needs
    to be confirmed before proceeding."

Not Eligible:

    "Your current profile does not match PMMY because
    [specific hard condition] is not satisfied."

#### Verification

The result should include:

- Official scheme name
- Applicable loan category
- Scheme status
- Official source
- Last verified date
- Lender-assessment disclaimer
- Official application/details link

### PMMY — Pradhan Mantri MUDRA Yojana

#### Scheme Type

Direct Individual Scheme

#### Status

Active

#### Primary Purpose

Collateral-free institutional credit for eligible micro-enterprises and income-generating activities.

#### Hard Eligibility Rules

    eligible_micro_enterprise = true
    AND eligible_income_generating_activity = true
    AND activity_is_eligible = true

The applicant may be starting a new business or operating an existing micro-enterprise, subject to lender assessment and applicable scheme conditions.

#### Loan Categories

PMMY provides different loan categories:

- Shishu — up to ₹50,000
- Kishore — above ₹50,000 and up to ₹5 lakh
- Tarun — above ₹5 lakh and up to ₹10 lakh
- Tarun Plus — above ₹10 lakh and up to ₹20 lakh

#### Conditional Tarun Plus Rule

Tarun Plus has an additional requirement:

    IF loan_amount > ₹10 lakh
    AND loan_amount <= ₹20 lakh
    THEN previous_tarun_loan_repaid_successfully = true

The previous-loan requirement applies to Tarun Plus and must not be applied to Shishu, Kishore or Tarun.

#### Eligible Activities

The scheme can support eligible income-generating activities including:

- Manufacturing
- Trading
- Services
- Agriculture-allied activities such as poultry, dairy and beekeeping

The activity must fall within the applicable PMMY lending framework.

#### Social Category

No general SC/ST/OBC/women requirement is used as a hard eligibility gate for PMMY.

Social category may still be useful for ranking or displaying other applicable schemes.

#### Income

No general beneficiary income ceiling is used in the central PMMY eligibility information.

#### Business Stage

Both new and existing micro-enterprises may be considered, subject to lender assessment and applicable scheme conditions.

#### State

PMMY is a national scheme.

No state-residence restriction is applied by the central scheme.

#### Loan Amount

    Shishu: <= ₹50,000
    Kishore: > ₹50,000 AND <= ₹5 lakh
    Tarun: > ₹5 lakh AND <= ₹10 lakh
    Tarun Plus: > ₹10 lakh AND <= ₹20 lakh

The requested loan amount determines the applicable category.

#### Previous Loan

Previous Tarun-loan repayment is a hard condition only for Tarun Plus.

    loan_amount <= ₹10 lakh
    → previous Tarun repayment not required

    loan_amount > ₹10 lakh AND <= ₹20 lakh
    → previous Tarun loan successfully repaid required

#### Lender Assessment

PMMY eligibility does not guarantee loan approval.

The lending institution may conduct its own assessment before approving credit.

Therefore:

    scheme_match != loan_approval

#### Hard Exclusions

Potential hard failures include:

- Activity not eligible under the PMMY framework
- Requested amount outside the applicable PMMY limits
- Failure to satisfy Tarun Plus previous-loan condition
- Failure to satisfy applicable lender/institutional requirements

#### Soft / Priority Factors

Potential match-strength factors:

- Requested loan amount closely fits an applicable PMMY category
- Business activity aligns strongly with supported micro-enterprise activities
- Business stage aligns with the intended use of the loan

Soft factors must never override a hard failure.

#### Near Match Conditions

Potential Near Match cases include:

- Applicant appears suitable but lender eligibility cannot be verified by Yojana Disha
- Applicant requests more than ₹10 lakh but has not confirmed successful repayment of a previous Tarun loan
- Activity requires lender-level verification
- Required documentation has not been confirmed

#### Example Rule Structure

Conceptually:

    PMMY
      ├── Shishu
      │     └── loan_amount <= ₹50,000
      │
      ├── Kishore
      │     ├── loan_amount > ₹50,000
      │     └── loan_amount <= ₹5 lakh
      │
      ├── Tarun
      │     ├── loan_amount > ₹5 lakh
      │     └── loan_amount <= ₹10 lakh
      │
      └── Tarun Plus
            ├── loan_amount > ₹10 lakh
            ├── loan_amount <= ₹20 lakh
            └── previous Tarun loan successfully repaid

#### Explanation Template

Eligible:

    "Your profile matches the known PMMY requirements and your
    requested loan amount falls within the [category] range."

Near Match:

    "PMMY may be relevant to you, but [specific requirement] needs
    to be confirmed before proceeding."

Not Eligible:

    "Your current profile does not match PMMY because
    [specific hard condition] is not satisfied."

#### Verification

The result should include:

- Official scheme name
- Applicable loan category
- Scheme status
- Official source
- Last verified date
- Lender-assessment disclaimer
- Official application/details link

### PM Vishwakarma

#### Scheme Type

Direct Individual Scheme

#### Status

Active

#### Primary Purpose

Support artisans and craftspeople working with their hands and traditional tools through recognition, skill development, toolkit support, credit assistance, digital incentives and marketing support.

#### Hard Eligibility Rules

    age >= 18
    AND trade IN approved_18_trades
    AND currently_practising_trade = true
    AND self_employed = true
    AND informal_sector = true
    AND government_employee = false
    AND family_member_registered = false

The applicant must be engaged in one of the 18 trades covered by the scheme.

#### Recognized Trades

The scheme covers 18 traditional trades, including:

- Carpenter
- Boat Maker
- Armourer
- Blacksmith
- Hammer and Tool Kit Maker
- Locksmith
- Goldsmith
- Potter
- Sculptor / Stone Carver
- Cobbler / Shoesmith / Footwear Artisan
- Mason
- Basket / Mat / Broom Maker / Coir Weaver
- Doll and Toy Maker
- Barber
- Garland Maker
- Washerman
- Tailor
- Fishing Net Maker

The exact trade list should be stored as structured values in the scheme database.

#### Age

    age >= 18

There is no maximum age requirement identified for the scheme.

#### Business Stage

The applicant must currently be practising the relevant traditional trade.

This is therefore different from schemes such as PMEGP where a completely new enterprise can qualify.

#### Sector / Activity

The applicant's activity must correspond to one of the 18 recognized trades.

Free-text business descriptions must not be used as the primary eligibility check.

The profile should instead contain a structured artisan/trade selection.

#### Government Employment Exclusion

    government_employee = false

An applicant who is a government employee is excluded under the scheme's eligibility conditions.

#### Family Registration Rule

Only one member of a family can register under PM Vishwakarma.

Therefore:

    family_member_registered_under_pm_vishwakarma = false

This is a PM Vishwakarma-specific condition.

It must NOT be treated as a global rule such as:

    family_member_registered_under_any_government_scheme = false

The platform should treat this information as self-declared unless it has access to an official verification system.

#### Previous Government Credit Rule

Applicants who have received certain similar government-backed self-employment/business-development loans within the previous five years may be excluded if the relevant loan has not been fully repaid.

Conceptually:

    (
        recent_disqualifying_government_credit = false
    )
    OR
    (
        previous_loan_type IN ["MUDRA", "SVANidhi"]
        AND previous_loan_repaid_successfully = true
    )

The exception must be evaluated explicitly.

A previously repaid MUDRA or SVANidhi loan must not automatically cause rejection.

#### Income

No general income ceiling is used as a primary eligibility gate for PM Vishwakarma.

#### Social Category

SC/ST/OBC/women/disability status is not required as a universal hard eligibility condition.

These attributes may still be useful when ranking the entrepreneur against other schemes.

#### Location

PM Vishwakarma is a national scheme.

No specific state-residence restriction is applied by the central eligibility rule.

#### Financial Assistance

The scheme provides credit support in stages:

- First loan tranche — up to ₹1 lakh
- Second loan tranche — up to ₹2 lakh
- Total credit support — up to ₹3 lakh

The second tranche is subject to the applicable scheme conditions.

#### Hard Exclusions

Potential hard failures include:

- Applicant is under 18
- Trade is not one of the recognized 18 trades
- Applicant is not currently practising the trade
- Applicant is not operating as a self-employed/informal artisan
- Applicant is a government employee
- Another family member has already registered under PM Vishwakarma
- Applicant has a disqualifying recent government-backed credit facility that has not been repaid, subject to applicable exceptions

#### Soft / Priority Factors

Potential match-strength factors:

- Applicant's activity strongly corresponds to a recognized trade
- Applicant's requested credit amount aligns with the applicable tranche
- Applicant belongs to a target group that may have relevance across other government schemes

These factors must not override hard exclusions.

#### Near Match Conditions

Potential Near Match cases include:

- Trade information is incomplete or requires verification
- Current practice of the trade has not been confirmed
- Family registration is self-declared and requires verification
- Previous-loan information is incomplete
- Applicant appears eligible but documentation/registration requirements remain unverified

#### Example Rule Structure

Conceptually:

    PM Vishwakarma
      ├── age >= 18
      ├── trade IN approved_18_trades
      ├── currently practising trade
      ├── self-employed / informal sector
      ├── not a government employee
      ├── no existing PM Vishwakarma family registration
      └── previous-credit rule
            ├── no disqualifying recent credit
            OR
            └── qualifying MUDRA/SVANidhi loan fully repaid

#### Explanation Template

Eligible:

    "Your profile matches the known PM Vishwakarma requirements.
    You are above the minimum age, your trade is covered by the
    scheme, and you have indicated that you currently practise
    the trade."

Near Match:

    "PM Vishwakarma appears relevant to your profile, but
    [specific condition] still needs to be confirmed."

Not Eligible:

    "You currently do not meet the known PM Vishwakarma
    requirements because [specific hard condition] is not satisfied."

#### Verification

The result should include:

- Official scheme name
- Recognized trade
- Scheme status
- Official source
- Last verified date
- Self-declaration/verification notes where applicable
- Official application/details link
- Disclaimer that final eligibility is determined by the implementing authority

### PMFME — Pradhan Mantri Formalisation of Micro Food Processing Enterprises

#### Scheme Type

Component-Based Scheme

#### Status

Active

#### Primary Purpose

Support the formalisation and upgradation of micro food-processing enterprises and provide support to eligible individuals, SHGs, FPOs, cooperatives and other eligible entities through different scheme components.

#### Important Architecture Rule

PMFME must NOT be represented as one flat eligibility rule.

The engine should first identify the relevant applicant/component pathway and then evaluate that component's rules.

Conceptually:

    PMFME
      ├── Individual Unit
      ├── SHG
      ├── FPO
      ├── Cooperative
      └── Common Infrastructure / Other Components

For the MVP, Yojana Disha will implement the **Individual Unit** pathway first.

Other components may be displayed as future/limited support where their rules are not fully implemented.

---

#### Individual Unit — Hard Eligibility Rules

    applicant_type = "individual"
    AND sector = "food_processing"
    AND business_stage IN ["new", "existing_upgrade"]
    AND activity_is_eligible = true
    AND project_is_eligible = true
    AND beneficiary_contribution >= 10%

The applicant must be involved in an eligible micro food-processing activity.

#### Sector Restriction

PMFME Individual Unit support is specifically focused on food-processing activities.

Therefore:

    sector != "food_processing"
    → NOT ELIGIBLE

A general manufacturing, trading or service business should not receive a PMFME Individual Unit match simply because it is a micro-enterprise.

#### Business Stage

Both of the following may be relevant:

- New eligible food-processing enterprise
- Existing micro food-processing enterprise seeking upgradation/formalisation

Therefore:

    business_stage IN ["new", "existing_upgrade"]

The engine must not apply a universal "new enterprise only" condition to PMFME.

#### Beneficiary Contribution

For the Individual Unit pathway:

    beneficiary_contribution >= 10%

The remaining eligible project financing may be supported through the applicable institutional credit structure.

Failure to satisfy the contribution requirement may result in a Near Match or Not Eligible outcome depending on whether the information represents a confirmed hard failure or an unverified financial condition.

#### Financial Assistance

For eligible individual units, the scheme provides credit-linked capital subsidy support:

    subsidy = 35% of eligible project cost

with:

    subsidy <= ₹10 lakh

The subsidy amount must be calculated from the eligible project cost rather than treating ₹10 lakh as a guaranteed benefit.

#### ODOP

One District One Product (ODOP) alignment may provide a preference/priority signal where applicable.

Therefore:

    ODOP_match = true

should be represented as a soft/priority factor rather than automatically treated as a universal hard eligibility requirement.

The engine must not reject an applicant solely because their activity does not match the district's ODOP unless the specific component rule being evaluated explicitly requires such alignment.

#### Income

No universal beneficiary income ceiling should be applied to the Individual Unit pathway based solely on the current scheme rule set.

#### Social Category

SC/ST/OBC/women/disability status is not a universal hard eligibility requirement for the Individual Unit pathway.

These attributes may still influence the user's matches with other schemes.

#### State / Location

PMFME is implemented nationally, subject to the applicable programme and state-level implementation arrangements.

The engine should not assume that simply selecting a state guarantees availability of every PMFME component.

Where implementation details require local/state verification, the result should display a verification note.

#### Applicant Type

The Individual Unit pathway requires:

    applicant_type = "individual"

Other entity types must be routed to their respective component rules when those rules are implemented.

The profile therefore needs a structured applicant/entity type rather than relying on a generic "Other" value.

Recommended values:

    Individual
    SHG
    FPO
    Cooperative
    Other

---

#### Hard Exclusions

Potential hard failures for the Individual Unit pathway include:

- Applicant is not an individual
- Business is not involved in eligible food processing
- Activity is excluded from the applicable scheme component
- Project does not satisfy applicable financial/project conditions
- Beneficiary contribution requirement is not satisfied

#### Soft / Priority Factors

Potential match-strength factors:

- ODOP alignment
- Strong alignment between business activity and supported food-processing categories
- Project amount alignment
- Existing business seeking formalisation/upgradation

Soft factors must never override hard eligibility failures.

#### Near Match Conditions

Potential Near Match cases include:

- Food-processing activity appears relevant but requires verification
- Project information is incomplete
- Beneficiary contribution has not been confirmed
- ODOP alignment exists but other project information requires verification
- State-level implementation details require confirmation
- Applicant appears suitable but the correct PMFME component has not yet been established

#### Example Rule Structure

Conceptually:

    PMFME
      │
      ├── Individual Unit
      │     ├── applicant = individual
      │     ├── food-processing activity
      │     ├── eligible activity
      │     ├── new OR existing-upgrade
      │     ├── beneficiary contribution >= 10%
      │     └── ODOP alignment → soft factor
      │
      ├── SHG
      │     └── component-specific rules
      │
      ├── FPO
      │     └── component-specific rules
      │
      └── Cooperative
            └── component-specific rules

Only the Individual Unit rule set is evaluated as a fully implemented MVP path.

#### Explanation Template

Eligible:

    "Your profile matches the Individual Unit component of PMFME.
    Your business operates in food processing and your project
    information satisfies the known requirements."

Near Match:

    "PMFME appears relevant to your business, but [specific
    requirement] needs to be confirmed before you can determine
    the appropriate support pathway."

Not Eligible:

    "The PMFME Individual Unit component does not currently match
    your profile because [specific hard condition] is not satisfied."

Component Notice:

    "PMFME contains multiple support components. Yojana Disha
    currently evaluates the Individual Unit pathway. Other
    components may have separate eligibility requirements."

#### Verification

The result should include:

- Official programme name
- Matched component
- Scheme status
- Official source
- Last verified date
- Applicable subsidy information
- Component limitations
- Official application/details link
- Disclaimer that final eligibility is determined by the implementing authority