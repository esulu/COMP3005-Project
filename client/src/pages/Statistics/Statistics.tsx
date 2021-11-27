

import React from 'react';
import { Paper, Stack } from "@mui/material"
import { StatisticsSalersPerGenre } from './StatisticsSalesPerGenre';
import { StatisticsScatterChart, DataSet, ScatterProps } from './StatisticsScatterChart';
import _ from "lodash";

const salesVsExpenditure : ScatterProps = {
    endpoint: "getSalesExpenditure",
    decomposeEndpoint: function(data) : DataSet {
        return {
            label: data.title,
            data: [{ x: data.expenditure, y: data.sales }],
            backgroundColor: `rgba(${_.random(255, true)}, ${_.random(255, true)}, ${_.random(255, true)}, 0.5)` // random color
        }
    },
    title: "Sales vs Expenditure",
    xAxisTitle: "Expenditure",
    yAxisTitle: "Sales",
}

const salesVsAuthor: ScatterProps = {
    endpoint: "getSalesPerAuthor",
    decomposeEndpoint: function(data) : DataSet {
        return {
            label: data.author_name,
            data: [{x:data.quantity, y:data.sales}],
            backgroundColor: `rgba(${_.random(255, true)}, ${_.random(255, true)}, ${_.random(255, true)}, 0.5)` // random color
        }
    },
    title: "Sales vs Quantity (Per an author)",
    xAxisTitle: "Quantity",
    yAxisTitle: "Sales",
}

export const Statistics = () => {
    return (
        <>
            {<Stack padding={1}>
                <h3>Statistics</h3>
                <Paper elevation={6}>
                    <StatisticsSalersPerGenre />
                </Paper>
                <Paper elevation={6}>
                    <StatisticsScatterChart props={salesVsExpenditure}/>
                </Paper>
                <Paper elevation={6}>
                    <StatisticsScatterChart props={salesVsAuthor}/>
                </Paper>
            </Stack> }
        </>
        
    );
  }