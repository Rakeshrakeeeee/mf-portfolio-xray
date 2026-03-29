package com.etai.portfolioxray.service;

import com.etai.portfolioxray.model.FundHolding;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class AmfiApiService {

    private static final String AMFI_NAV_URL = "https://www.amfiindia.com/spages/NAVAll.txt";

    // Known expense ratios for major funds (Direct plans) - in production fetch from fund houses
    private static final Map<String, Double> EXPENSE_RATIOS = Map.of(
        "HDFC Flexi Cap", 0.75,
        "Mirae Asset Large Cap", 0.55,
        "HDFC Top 100", 0.95,
        "Parag Parikh Flexi Cap", 0.63,
        "Axis Small Cap", 0.52,
        "SBI Blue Chip", 0.89,
        "Nippon India Small Cap", 0.67
    );

    private static final Map<String, String> FUND_CATEGORIES = Map.of(
        "Flexi Cap", "Flexi Cap",
        "Large Cap", "Large Cap",
        "Small Cap", "Small Cap",
        "Mid Cap", "Mid Cap",
        "ELSS", "Tax Saving",
        "Index", "Passive"
    );

    public List<FundHolding> enrichWithLiveData(List<FundHolding> holdings) {
        for (FundHolding holding : holdings) {
            // Assign expense ratio
            double expenseRatio = EXPENSE_RATIOS.entrySet().stream()
                .filter(e -> holding.getFundName().contains(e.getKey()))
                .mapToDouble(Map.Entry::getValue)
                .findFirst().orElse(1.0);
            holding.setExpenseRatio(expenseRatio);

            // Assign category
            String category = FUND_CATEGORIES.entrySet().stream()
                .filter(e -> holding.getFundName().contains(e.getKey()))
                .map(Map.Entry::getValue)
                .findFirst().orElse("Diversified");
            holding.setCategory(category);

            // Calculate expense drag (annual cost in ₹)
            holding.setAnnualExpenseDrag(holding.getCurrentValue() * expenseRatio / 100);
        }
        return holdings;
    }
}
