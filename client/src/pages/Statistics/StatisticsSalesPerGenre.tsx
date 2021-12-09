import { Chart as ChartJS, RadialLinearScale, ArcElement, Tooltip, Legend, } from 'chart.js';
import { useEffect, useState } from 'react';
import { PolarArea } from 'react-chartjs-2';
import _ from "lodash";
import Typography from '@mui/material/Typography';

// delegate chart.js plugins to the react-chartjs-2 wrapper
ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);
  

// The interface that chart.js accepts as data for the chart
interface ChartData {
    labels: string[],
    datasets: DataSet[]
}

interface DataSet {
    label: string,
    data: number[],
    backgroundColor: string[],
    broderWidth: number
}

export const StatisticsSalersPerGenre = () => {

    const [chartData, setChartData] = useState<ChartData | undefined>(undefined);

    const getData = async () => {
        const response = await fetch("http://localhost:5000/getBookSalesPerGenre");
        const jsonData = await response.json();

        
        let newDataSet:DataSet = {
            label: 'Sales',
            data: [],
            backgroundColor: [],
            broderWidth: 1,
        }

        // We need to change the label and here while changing the dataset at the same time
        // one label corresponds to one dataset [i] = [i], 
        let newChartData:ChartData = {
            labels: [],
            datasets: [newDataSet],
        }

        // make label the genre, and push the data to the dataset
        for (let genreSales of jsonData.rows) {
            newChartData.labels.push(genreSales.genre + ` (${parseInt(genreSales.sales)})`);
            newDataSet.data.push(genreSales.sales);
            newDataSet.backgroundColor.push(`rgba(${_.random(255, true)}, ${_.random(255, true)}, ${_.random(255, true)}, 0.5)`);
        }

        // change the start and begin the chart
        setChartData(newChartData);
    };

    useEffect(() => {
        getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            {chartData && <div className="chart-container mx-auto" style={{position: 'relative', height:'70vh', width:'80vw'}}>
                    <Typography variant="h5" align="center" style={{textDecorationLine: 'underline'}}> Sales Per Genre </Typography>
                    <PolarArea options={{maintainAspectRatio: false}} data={chartData}></PolarArea>
                </div>}  
        </>
    )
}

/**
 <div class="chart-container" style="position: relative; height:40vh; width:80vw">
    <canvas id="chart"></canvas>
</div>

 */