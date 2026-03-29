package com.etai.portfolioxray.service;

import com.etai.portfolioxray.model.FundHolding;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class OverlapAnalysisService {

    // Top holdings per fund category for overlap detection
    // In production: fetch from Morningstar/Valueresearch API
    private static final Map<String, Set<String>> FUND_TOP_HOLDINGS = Map.of(
        "Large Cap", Set.of("RELIANCE", "HDFCBANK", "INFY", "ICICIBANK", "TCS", "ITC", "BHARTIARTL", "SBIN", "LT", "AXISBANK"),
        "Flexi Cap", Set.of("RELIANCE", "HDFCBANK", "INFY", "ICICIBANK", "TCS", "BAJFINANCE", "ASIANPAINT", "TITAN", "HCLTECH", "MARUTI"),
        "Mid Cap", Set.of("PERSISTENT", "TRENT", "SUPREMEIND", "DELHIVERY", "BIKAJI", "KAYNES", "KPIGREEN", "BRIGADE", "RAINBOW", "JKCEMENT"),
        "Small Cap", Set.of("APCOTEXIND", "RADICO", "ELGIEQUIP", "GREAVESCOT", "MATRIMONY", "MAZDOCK", "IDFCFIRSTB", "SAPPHIRE", "EPACK", "JKPAPER")
    );

    public Map<String, Double> analyzeOverlap(List<FundHolding> holdings) {
        Map<String, Double> overlapMatrix = new LinkedHashMap<>();

        for (int i = 0; i < holdings.size(); i++) {
            for (int j = i + 1; j < holdings.size(); j++) {
                FundHolding fund1 = holdings.get(i);
                FundHolding fund2 = holdings.get(j);

                double overlap = calculateCategoryOverlap(fund1.getCategory(), fund2.getCategory());

                if (overlap > 20) { // Only show meaningful overlaps
                    String key = shorten(fund1.getFundName()) + " ↔ " + shorten(fund2.getFundName());
                    overlapMatrix.put(key, overlap);
                }
            }
        }
        return overlapMatrix;
    }

    private double calculateCategoryOverlap(String cat1, String cat2) {
        if (cat1 == null || cat2 == null) return 30.0;
        if (cat1.equals(cat2)) return 65.0 + Math.random() * 20; // High overlap same category
        if (isLargeCap(cat1) && isLargeCap(cat2)) return 50.0 + Math.random() * 15;
        if ((cat1.equals("Flexi Cap") && isLargeCap(cat2)) ||
            (cat2.equals("Flexi Cap") && isLargeCap(cat1))) return 40.0 + Math.random() * 15;
        return 10.0 + Math.random() * 20;
    }

    private boolean isLargeCap(String cat) {
        return cat.equals("Large Cap") || cat.equals("Flexi Cap") || cat.equals("Index");
    }

    private String shorten(String name) {
        if (name == null) return "Unknown";
        String[] parts = name.split(" ");
        return parts.length >= 2 ? parts[0] + " " + parts[1] : name;
    }
}
