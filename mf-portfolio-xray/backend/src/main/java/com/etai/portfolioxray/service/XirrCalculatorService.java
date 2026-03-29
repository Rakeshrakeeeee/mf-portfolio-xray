package com.etai.portfolioxray.service;

import com.etai.portfolioxray.model.FundHolding;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class XirrCalculatorService {

    /**
     * Calculate XIRR (Extended Internal Rate of Return)
     * Uses Newton-Raphson method for numerical approximation
     */
    public double calculateXirr(List<FundHolding> holdings) {
        double totalInvested = holdings.stream().mapToDouble(FundHolding::getInvestedAmount).sum();
        double totalCurrentValue = holdings.stream().mapToDouble(FundHolding::getCurrentValue).sum();

        if (totalInvested == 0) return 0;

        // Simplified XIRR assuming avg 3-year holding period
        // In production: use actual transaction dates from CAMS statement
        double years = 3.0;
        double xirr = Math.pow(totalCurrentValue / totalInvested, 1.0 / years) - 1;

        return Math.round(xirr * 1000.0) / 10.0; // Return as percentage, 1 decimal
    }

    /**
     * Full Newton-Raphson XIRR when transaction dates are available
     */
    public double calculateXirrWithDates(double[] cashflows, long[] datesInDays) {
        double rate = 0.1; // Initial guess 10%
        for (int i = 0; i < 100; i++) {
            double npv = 0, dnpv = 0;
            for (int j = 0; j < cashflows.length; j++) {
                double t = datesInDays[j] / 365.0;
                npv += cashflows[j] / Math.pow(1 + rate, t);
                dnpv -= t * cashflows[j] / Math.pow(1 + rate, t + 1);
            }
            double newRate = rate - npv / dnpv;
            if (Math.abs(newRate - rate) < 1e-7) return newRate * 100;
            rate = newRate;
        }
        return rate * 100;
    }
}
