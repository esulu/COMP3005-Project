import { Box, Stack } from "@mui/material"
import { StatisticsSalersPerGenre } from './StatisticsSalesPerGenre';
import { StatisticsScatterChart, DataSet, ScatterProps } from './StatisticsScatterChart';
import _ from "lodash";

// Props to enter for creating a sales vs expenditure scatter plot
// contains both properties of the table and how to decompose the endpoint given
const salesVsExpenditure : ScatterProps = {
    endpoint: "getSalesExpenditure",
    decomposeEndpoint: function(data) : DataSet {
        // data is the object recieved from the endpoint, we retrived a dataset of said endpoint as follows
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

// same but for author vs sales
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


const boxStyle = {
    mb:10
}

export const Statistics = () => {
    return (
        <Stack spacing={2}>
            <Box sx={boxStyle}>
                <StatisticsSalersPerGenre />
            </Box>
            <Box sx={boxStyle}>
                <StatisticsScatterChart props={salesVsExpenditure}/>
            </Box>
            {/* These two do not obey any style i can put on, boostrap, mui, their own styling api, nothing works */}
            <span style={{margin:10}}></span> 
            <span style={{margin:10}}></span>
            <Box sx={boxStyle}>
                <StatisticsScatterChart props={salesVsAuthor}/>
            </Box>
        </Stack>
        
    );
  }
