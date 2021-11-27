

import React from 'react';
import { Paper, Stack } from "@mui/material"
import { StatisticsSalersPerGenre } from './StatisticsSalesPerGenre';

export const Statistics = () => {

    
    return (
        <>
            <Stack>
                <h3>Statistics</h3>
                <Paper elevation={6}>
                    <StatisticsSalersPerGenre />
                </Paper>
                <Paper elevation={6}>
                    
                </Paper>
            </Stack>
        </>
        
    );
  }