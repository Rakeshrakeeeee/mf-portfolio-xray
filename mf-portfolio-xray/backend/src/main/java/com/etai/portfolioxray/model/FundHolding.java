package com.etai.portfolioxray.model;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FundHolding {
    private String fundName;
    private String folioNumber;
    private double units;
    private double currentNav;
    private double investedAmount;
    private double currentValue;
    private double expenseRatio;
    private double annualExpenseDrag;
    private String category;
    private String amfiCode;
}
