import {Chart as ChartJS, LinearScale, PointElement, LineElement, Tooltip, Legend, } from 'chart.js';
import { useEffect, useState } from 'react';
import { Chart } from 'react-chartjs-2';
import Typography from '@mui/material/Typography';

// delegate chart.js plugins to the react-chartjs-2 wrapper
ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend); 

export interface Point {
    x: number,
    y: number
}

export interface DataSet {
    label: string,
    data: Point[],
    backgroundColor: string,
}

// The interface that chart.js accepts as data for the chart
interface ScatterData {
    datasets: DataSet[],
}

/**
 * Props used for a scatter chart
 * endpoint: the server endpoint to retrieve date
 * decomposeEndpoint: function that takes an object (of a row) and returns a dataset of said object
 */
export interface ScatterProps {
    endpoint: string,
    decomposeEndpoint: (obj:any) => DataSet,
    title:string,
    xAxisTitle: string,
    yAxisTitle: string,
}

export const StatisticsScatterChart = ({props} : {props: ScatterProps}) => {

    const [scatterData, setScatterData] = useState<ScatterData | undefined>(undefined);

    // Options for ChartJS
    const options = {
        plugins: {
            tooltip: {
                enabled:true,
                callbacks: {
                    label: function(context:any) {
                        // put the title of the book when on a tooltip
                        const label = (context.dataset.label || '') + ` (${context.parsed.x.toFixed(2)}, ${context.parsed.y.toFixed(2)})`; 
                        return label;
                    }
                }
            },
            legend: {
                display: false
            },
            
        },
        scales: {
            y: {title: {display:true,text: props.yAxisTitle},}, 
            x: {title:{display:true, text: props.xAxisTitle}}
        },
        maintainAspectRatio: false
    };

    const getData = async () => {
        
        const response = await fetch(`http://localhost:5000/${props.endpoint}`);
        const jsonData = await response.json();

        let dataSets: DataSet[] = [];

        // Get the data and put it into the scatter data format for chartjs
        // chartjs uses this data to then make the chart respectively
        for (let data of jsonData.rows) {
            dataSets.push(props.decomposeEndpoint(data));
            dataSets.push()
        }

        // set the scatterchart data (and update the state)
        setScatterData({ datasets: dataSets });
    }

    useEffect(() => {
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <>
            {scatterData && <div className="chart-container mx-auto" style={{position: 'relative', height:'70vh', width:'80vw'}}>
                <Typography variant="h5" align="center" style={{textDecorationLine: 'underline'}}> {props.title} </Typography> {/* The title option in chart does not work at all! */}
                <Chart options={options} type='scatter' data={scatterData} />
                </div>
            }
        </>
    )
}