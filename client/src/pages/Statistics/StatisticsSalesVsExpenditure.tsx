

import {
    Chart as ChartJS,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { useEffect, useState } from 'react';
import { Chart } from 'react-chartjs-2';
import _ from "lodash";
import Typography from '@mui/material/Typography';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

// Options for ChartJS
const options = {
    plugins: {
        tooltip: {
            enabled:true,
            callbacks: {
                label: function(context:any) {
                    const label = context.dataset.label || ''; // put the title of the book when on a tooltip
                    return label;
                }
            }
        },
        legend: {
            display: false
        },
        
    },
    scales: {
        y: {title: {display:true,text: 'Sum of Sales'},}, 
        x: {title:{display:true, text:'Expenditure'}}
    },
};


interface Point {
    x: number,
    y: number
}

interface DataSet {
    label: string,
    data: Point[],
    backgroundColor: string,
}

interface ScatterData {
    datasets: DataSet[],
}

export const StatisticsSalesVsExpenditure = () => {

    const [scatterData, setScatterData] = useState<ScatterData | undefined>(undefined);

    const getData = async () => {
        
        const response = await fetch("http://localhost:5000/getSalesExpenditure");
        const jsonData = await response.json();

        let dataSets: DataSet[] = [];

        // Get the data and put it into the scatter data format for chartjs
        // chartjs uses this data to then make the chart respectively
        for (let genreSales of jsonData.rows) {
            dataSets.push({
                label: genreSales.title,
                data: [{ x: genreSales.expenditure, y: genreSales.sales }],
                backgroundColor: `rgba(${_.random(255, true)}, ${_.random(255, true)}, ${_.random(255, true)}, 0.5)` // random color
            })
        }

        setScatterData({ datasets: dataSets });
    }

    useEffect(() => {
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <>
            {scatterData && <>
                <Typography variant="h5" align="center"> Sales vs Expenditure </Typography> {/* The title option in chart does not work at all! */}
                <Chart options={options} type='scatter' data={scatterData} />
                </>
            }
        </>
    )
}