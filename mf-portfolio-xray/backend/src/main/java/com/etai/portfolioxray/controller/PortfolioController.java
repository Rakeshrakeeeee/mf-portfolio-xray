package com.etai.portfolioxray.controller;

import com.etai.portfolioxray.model.PortfolioAnalysis;
import com.etai.portfolioxray.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/portfolio")
@CrossOrigin(origins = "*")
public class PortfolioController {

    @Autowired private PdfParserService pdfParserService;
    @Autowired private XirrCalculatorService xirrCalculatorService;
    @Autowired private OverlapAnalysisService overlapAnalysisService;
    @Autowired private AmfiApiService amfiApiService;
    @Autowired private ClaudeAiService claudeAiService;

    /**
     * Main endpoint: Upload CAMS/KFintech PDF → Full analysis in one call
     */
    @PostMapping("/upload")
    public ResponseEntity<PortfolioAnalysis> uploadAndAnalyze(
            @RequestParam("file") MultipartFile file) {
        try {
            // Step 1: Parse PDF → Extract fund holdings
            var holdings = pdfParserService.extractHoldings(file);

            // Step 2: Enrich with live AMFI data (NAV, expense ratios, benchmark)
            var enrichedHoldings = amfiApiService.enrichWithLiveData(holdings);

            // Step 3: Calculate XIRR
            double xirr = xirrCalculatorService.calculateXirr(enrichedHoldings);

            // Step 4: Detect fund overlap
            var overlapMatrix = overlapAnalysisService.analyzeOverlap(enrichedHoldings);

            // Step 5: Generate AI rebalancing plan via Claude
            String aiPlan = claudeAiService.generateRebalancingPlan(enrichedHoldings, xirr, overlapMatrix);

            // Step 6: Build final analysis response
            PortfolioAnalysis analysis = PortfolioAnalysis.builder()
                    .holdings(enrichedHoldings)
                    .xirr(xirr)
                    .benchmarkXirr(12.1) // Nifty 50 5Y avg
                    .overlapMatrix(overlapMatrix)
                    .aiRecommendation(aiPlan)
                    .portfolioScore(calculateScore(xirr, overlapMatrix, enrichedHoldings))
                    .build();

            return ResponseEntity.ok(analysis);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    private int calculateScore(double xirr, Map<String, Double> overlap, java.util.List<?> holdings) {
        int score = 50;
        if (xirr > 12) score += 15;
        if (xirr > 15) score += 10;
        double avgOverlap = overlap.values().stream().mapToDouble(d -> d).average().orElse(0);
        if (avgOverlap < 30) score += 15;
        if (holdings.size() <= 5) score += 10;
        return Math.min(score, 100);
    }
}
