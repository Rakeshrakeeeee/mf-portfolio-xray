package com.etai.portfolioxray.service;

import com.etai.portfolioxray.model.FundHolding;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.*;
import java.util.*;

@Service
public class ClaudeAiService {

    @Value("${claude.api.key}")
    private String apiKey;

    private final ObjectMapper mapper = new ObjectMapper();

    public String generateRebalancingPlan(List<FundHolding> holdings, double xirr, Map<String, Double> overlap) throws Exception {
        String portfolioSummary = buildPortfolioSummary(holdings, xirr, overlap);

        String prompt = """
            You are an expert mutual fund advisor for Indian investors.
            
            Analyze this portfolio and give specific, actionable rebalancing advice:
            
            %s
            
            Provide:
            1. Top 3 issues with this portfolio (be specific with fund names)
            2. Exact rebalancing moves (which fund to reduce, which to add, how much ₹)
            3. Expected improvement in returns after rebalancing
            4. One-line verdict on portfolio health
            
            Be direct, specific, and use Indian financial context. Max 200 words.
            """.formatted(portfolioSummary);

        Map<String, Object> requestBody = Map.of(
            "model", "claude-sonnet-4-20250514",
            "max_tokens", 1000,
            "messages", List.of(Map.of("role", "user", "content", prompt))
        );

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create("https://api.anthropic.com/v1/messages"))
            .header("Content-Type", "application/json")
            .header("x-api-key", apiKey)
            .header("anthropic-version", "2023-06-01")
            .POST(HttpRequest.BodyPublishers.ofString(mapper.writeValueAsString(requestBody)))
            .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        Map<?, ?> responseMap = mapper.readValue(response.body(), Map.class);
        List<?> content = (List<?>) responseMap.get("content");
        Map<?, ?> firstBlock = (Map<?, ?>) content.get(0);
        return (String) firstBlock.get("text");
    }

    private String buildPortfolioSummary(List<FundHolding> holdings, double xirr, Map<String, Double> overlap) {
        StringBuilder sb = new StringBuilder();
        sb.append("Portfolio XIRR: ").append(xirr).append("% (Nifty 50 benchmark: 12.1%)\n");
        sb.append("Number of funds: ").append(holdings.size()).append("\n\n");
        sb.append("Holdings:\n");
        for (FundHolding h : holdings) {
            sb.append("- ").append(h.getFundName())
              .append(" | Category: ").append(h.getCategory())
              .append(" | Invested: ₹").append(h.getInvestedAmount())
              .append(" | Current: ₹").append(h.getCurrentValue())
              .append(" | Expense Ratio: ").append(h.getExpenseRatio()).append("%\n");
        }
        sb.append("\nOverlap Analysis:\n");
        overlap.forEach((pair, pct) ->
            sb.append("- ").append(pair).append(": ").append(pct).append("% overlap\n"));
        return sb.toString();
    }
}
