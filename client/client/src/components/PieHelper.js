import React, { useState } from "react";
import { PieChart, Pie, Legend, Sector, Cell, ResponsiveContainer } from 'recharts';
import {useLocation} from 'react-router-dom';
 
function PieChartComponent () {

    const location = useLocation();

    const data = location.state.data
    
 
    const dummyData = 
    [
      {
          "name": "positive",
          "value": 1
      },
      {
          "name": "neutral",
          "value": 1
      },
      {
          "name": "negative",
          "value": 1
      }
  ];
 
    const COLORS = ['#238823', '#ffbf00', '#d2222d'];
    let cleanData = []
    if(data){
      data.forEach(element => {
        if(element.value){
          cleanData.push(element)
        }
      });
    }else{cleanData = dummyData}
 
    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
 
        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };
 
    return (
        <>
            <div>
                <div className="row d-flex justify-content-center text-center">
                    <h1>Amazon review - sentiment</h1>
                    <hr />
                    <div className="col-md-8">
                        <ResponsiveContainer width={400} height={400} className="text-center">
                            <PieChart width={400} height={400}>
                                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                                <Pie
                                    data={cleanData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={renderCustomizedLabel}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >

                                    {cleanData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </>
    )
}
export default PieChartComponent;