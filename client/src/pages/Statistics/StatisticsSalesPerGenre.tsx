
import {
    Chart as ChartJS,
    RadialLinearScale,
    ArcElement,
    Tooltip,
    Legend,
  } from 'chart.js';
import { useEffect, useState } from 'react';
import { PolarArea } from 'react-chartjs-2';
import _ from "lodash";

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);
  

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

        let newChartData:ChartData = {
            labels: [],
            datasets: [newDataSet],
        }

        for (let genreSales of jsonData.rows) {
            newChartData.labels.push(genreSales.genre);
            newDataSet.data.push(genreSales.sales);
            newDataSet.backgroundColor.push(`rgba(${_.random(255, true)}, ${_.random(255, true)}, ${_.random(255, true)}, 0.5)`);
        }
        console.log(newChartData);
        setChartData(newChartData);
    };

    useEffect(() => {
        getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            {chartData && <PolarArea data={chartData}></PolarArea>}  
        </>
    )
}