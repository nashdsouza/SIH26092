import json
from copy import deepcopy
from itertools import combinations
from pathlib import Path


SCHEMES_PATH = Path(__file__).with_name("schemes.json")
STATUS_RANK = {"NOT ELIGIBLE": 0, "NEAR MATCH": 1, "ELIGIBLE": 2}
BLOCKING_TARGET_FIELDS = {
    "social_category",
    "gender",
    "shg_membership",
    "sanitation_worker_profiled",
}
NUMERIC_PROFILE_FIELDS = (
    "age",
    "annual_family_income_inr",
    "project_cost_inr",
    "requested_loan_amount_inr",
    "education_level",
    "ownership_sc_st_pct",
)


def load_schemes():
    """Load the scheme catalogue from schemes.json."""
    with open(SCHEMES_PATH, "r", encoding="utf-8") as file:
        return json.load(file)


def validate_profile(profile):
    """Reject malformed numeric input before rule evaluation can fail noisily."""
    if not isinstance(profile, dict):
        raise TypeError("Profile must be a JSON object.")

    for field in NUMERIC_PROFILE_FIELDS:
        if field not in profile or profile[field] is None:
            continue
        value = profile[field]
        if isinstance(value, bool) or not isinstance(value, (int, float)):
            raise ValueError(f"{field} must be numeric.")
        if value < 0:
            raise ValueError(f"{field} cannot be negative.")


def evaluate_rule(profile, rule):
    """Check whether one rule passes for a user profile."""
    actual = profile.get(rule["field"])
    expected = rule["value"]
    operator = rule["op"]

    if actual is None:
        return False

    if operator == "eq":
        return actual == expected
    if operator == "in":
        return actual in expected
    if operator == "gt":
        return actual > expected
    if operator == "gte":
        return actual >= expected
    if operator == "lte":
        return actual <= expected

    raise ValueError(f"Unsupported operator: {operator}")


def evaluate_condition(profile, condition):
    """Evaluate an all/any group used by a conditional rule."""
    if "all" in condition:
        return all(evaluate_rule(profile, rule) for rule in condition["all"])

    if "any" in condition:
        return any(evaluate_rule(profile, rule) for rule in condition["any"])

    raise ValueError("Condition must contain 'all' or 'any'.")


def evaluate_scheme(profile, scheme):
    """Return one scheme's status and human-readable explanation."""
    hard_failures = []
    hard_failure_fields = []

    for rule in scheme.get("hard_rules", []):
        if not evaluate_rule(profile, rule):
            hard_failures.append(rule["message"])
            hard_failure_fields.append(rule["field"])

    conditional_failures = []

    for conditional_rule in scheme.get("conditional_rules", []):
        if evaluate_condition(profile, conditional_rule["when"]):
            for requirement in conditional_rule["requirements"]:
                if not evaluate_rule(profile, requirement):
                    conditional_failures.append(requirement["message"])

    soft_matches = []

    for rule in scheme.get("soft_rules", []):
        if evaluate_rule(profile, rule):
            soft_matches.append(rule)

    soft_score = sum(rule.get("weight", 1) for rule in soft_matches)
    failures = hard_failures + conditional_failures

    has_blocking_target_failure = any(
        field in BLOCKING_TARGET_FIELDS for field in hard_failure_fields
    )

    if has_blocking_target_failure:
        status = "NOT ELIGIBLE"
        summary = "The profile does not meet the scheme's target-group gate."
    elif not failures and scheme.get("requires_manual_verification", False):
        status = "NEAR MATCH"
        summary = scheme["manual_verification_message"]
    elif not failures:
        status = "ELIGIBLE"
        summary = "All modelled hard and conditional checks passed."
    elif len(failures) == 1 and soft_score >= 2:
        status = "NEAR MATCH"
        summary = "Potential fit, but the listed item needs confirmation before applying."
    else:
        status = "NOT ELIGIBLE"
        summary = "One or more mandatory checks did not pass."
    return {
        "id": scheme["id"],
        "name": scheme["name"],
        "short_name": scheme.get("short_name", scheme["name"]),
        "purpose": scheme.get("purpose", ""),
        "status": status,
        "summary": summary,
        "failures": failures,
        "soft_matches": [rule["message"] for rule in soft_matches],
        "official_url": scheme["official_url"],
        "required_documents": scheme.get("required_documents", [])
    }


def match_profile(profile):
    """Match one entrepreneur profile against every scheme."""
    validate_profile(profile)
    catalogue = load_schemes()
    results = []

    for scheme in catalogue["schemes"]:
        if scheme.get("catalogue_status", "ACTIVE") != "ACTIVE":
            continue
        results.append(evaluate_scheme(profile, scheme))

    # Keep ordering predictable and easy to explain: status first, then the
    # number of helpful signals, then the fewest outstanding checks.
    results.sort(key=lambda result: (
        -STATUS_RANK[result["status"]],
        -len(result["soft_matches"]),
        len(result["failures"]),
        result["name"].casefold()
    ))
    for rank, result in enumerate(
        (item for item in results if item["status"] != "NOT ELIGIBLE"),
        start=1
    ):
        result["rank"] = rank

    return results


def _actionable_changes(profile):
    """Return honest, user-actionable changes that are safe to simulate."""
    changes = []

    if not profile.get("has_capital_expenditure", False):
        changes.append({
            "id": "capital_expenditure",
            "title": "Add an equipment or asset component",
            "description": "Explore whether the project genuinely needs tools, machinery, or another productive asset.",
            "effort": "Project decision",
            "field": "has_capital_expenditure",
            "value": True,
            "value_label": "Includes equipment or assets"
        })

    if not profile.get("has_business_plan", False):
        changes.append({
            "id": "business_plan",
            "title": "Prepare a simple business plan",
            "description": "Add a basic plan covering customers, costs, revenue, and how the loan will be used.",
            "effort": "Quick win",
            "field": "has_business_plan",
            "value": True,
            "value_label": "Business plan prepared"
        })

    if profile.get("requested_loan_amount_inr", 0) > 2000000:
        changes.append({
            "id": "loan_limit",
            "title": "Explore a loan request of ₹20 lakh",
            "description": "Test whether a smaller first-phase request fits the current modelled MUDRA Tarun Plus ceiling.",
            "effort": "Finance decision",
            "field": "requested_loan_amount_inr",
            "value": 2000000,
            "value_label": "₹20,00,000 loan request"
        })

    if profile.get("education_level", 0) < 8:
        changes.append({
            "id": "education_class_8",
            "title": "Plan for the Class 8 requirement",
            "description": "Some larger projects in the model require at least Class 8 education.",
            "effort": "Longer-term",
            "field": "education_level",
            "value": 8,
            "value_label": "Class 8 completed"
        })

    return changes


def build_yojana_gps(profile):
    """Find the shortest honest routes that improve the modelled scheme results."""
    baseline = match_profile(profile)
    baseline_by_name = {item["name"]: item for item in baseline}
    candidates = _actionable_changes(profile)
    routes = []

    for size in (1, 2):
        for selected in combinations(candidates, size):
            scenario = deepcopy(profile)
            for change in selected:
                scenario[change["field"]] = change["value"]

            simulated = match_profile(scenario)
            improvements = []
            regressions = []

            for result in simulated:
                before = baseline_by_name[result["name"]]
                rank_change = STATUS_RANK[result["status"]] - STATUS_RANK[before["status"]]
                gained_signals = [
                    signal for signal in result["soft_matches"]
                    if signal not in before["soft_matches"]
                ]

                if rank_change < 0:
                    regressions.append(result["name"])
                elif rank_change > 0 or gained_signals:
                    improvements.append({
                        "scheme": result["name"],
                        "from_status": before["status"],
                        "to_status": result["status"],
                        "unlocked": result["status"] == "ELIGIBLE" and before["status"] != "ELIGIBLE",
                        "removed_checks": [
                            failure for failure in before["failures"]
                            if failure not in result["failures"]
                        ],
                        "gained_signals": gained_signals
                    })

            if not improvements or regressions:
                continue

            unlocked_count = sum(item["unlocked"] for item in improvements)
            status_steps = sum(
                STATUS_RANK[item["to_status"]] - STATUS_RANK[item["from_status"]]
                for item in improvements
            )
            routes.append({
                "id": "+".join(change["id"] for change in selected),
                "title": selected[0]["title"] if size == 1 else "Combine two practical steps",
                "description": " ".join(change["description"] for change in selected),
                "effort": selected[0]["effort"] if size == 1 else "Combined route",
                "changes": [{
                    "id": change["id"],
                    "field": change["field"],
                    "value": change["value"],
                    "label": change["value_label"]
                } for change in selected],
                "improvements": improvements,
                "unlocked_count": unlocked_count,
                "score": unlocked_count * 100 + status_steps * 20 + len(improvements) * 5 - size
            })

    routes.sort(key=lambda route: route["score"], reverse=True)

    counts = {
        "eligible": sum(result["status"] == "ELIGIBLE" for result in baseline),
        "near_match": sum(result["status"] == "NEAR MATCH" for result in baseline),
        "not_eligible": sum(result["status"] == "NOT ELIGIBLE" for result in baseline)
    }
    actionable = [result for result in baseline if result["status"] != "NOT ELIGIBLE"]
    readiness_score = round(sum(
        {"ELIGIBLE": 100, "NEAR MATCH": 65, "NOT ELIGIBLE": 20}[result["status"]]
        for result in actionable
    ) / max(len(actionable), 1))

    return {
        "readiness_score": readiness_score,
        "counts": counts,
        "routes": routes[:3],
        "disclaimer": "Simulations are guidance, not approval. Only use changes that truthfully describe the project."
    }


def print_results(results):
    """Print a simple terminal report."""
    for result in results:
        print(f"\n[{result['status']}] {result['name']}")
        print(f"  {result['summary']}")

        for failure in result["failures"]:
            print(f"  - Check: {failure}")

        for signal in result["soft_matches"]:
            print(f"  - Signal: {signal}")

        print(f"  Verify: {result['official_url']}")


SAMPLE_ENTREPRENEUR_PROFILE = {
    "is_indian_citizen": True,
    "age": 26,
    "social_category": "SC",
    "annual_family_income_inr": 450000,
    "state": "Maharashtra",
    "location_type": "urban",
    "education_level": 10,
    "business_stage": "new",
    "project_sector": "service",
    "business_sector": "service",
    "project_cost_inr": 600000,
    "requested_loan_amount_inr": 500000,
    "gender": "Other",
    "ownership_sc_st_pct": 100,
    "has_capital_expenditure": True,
    "has_availed_government_subsidy_for_this_unit": False,
    "is_bank_defaulter": False,
    "has_business_plan": True,
    "is_artisan_or_craftsperson": True,
    "trade": "embroidery",
    "work_type": "traditional_craft",
    "is_self_employed": True,
    "family_member_already_enrolled_in_pmv": False,
    "is_government_employee_or_family_member": False,
    "has_udyam_registration": True,
    "previous_loan_repaid_successfully": False,
    "shg_membership": False,
    "sanitation_worker_profiled": False,
    "vehicle_use": "commercial"
}


if __name__ == "__main__":
    print("Yojana Disha — isolated matcher demo")
    results = match_profile(SAMPLE_ENTREPRENEUR_PROFILE)
    print_results(results)
