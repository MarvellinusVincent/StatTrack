import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Chart as ChartJS } from 'chart.js/auto';
import { Theme } from '../styles';

const { colors } = Theme;

const AudioFeaturesChart = ({ audioFeatures, track }) => {
  useEffect(() => {
    let chartInstance = null;
    const normalizedLoudness = (audioFeatures.loudness + 60) / 60;
    const normalizedTempo = (audioFeatures.tempo - 60) / (180 - 60);

    if (audioFeatures) {
      const chartData = {
        labels: ['Tempo', 'Loudness', 'Acousticness', 'Danceability', 'Energy', 'Liveness', 'Speechiness', 'Instrumentalness', 'Valence'],
        datasets: [{
          backgroundColor: '#101010', 
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          hoverBackgroundColor: colors.green, 
          data: [
            normalizedTempo,
            normalizedLoudness,
            audioFeatures.acousticness,
            audioFeatures.danceability,
            audioFeatures.energy,
            audioFeatures.liveness,
            audioFeatures.speechiness,
            audioFeatures.instrumentalness,
            audioFeatures.valence
          ]
        }]
      };

      const ctx = document.getElementById('audioFeaturesChart');
      if (chartInstance) {
        chartInstance.destroy();
      }
      chartInstance = new ChartJS(ctx, {
        type: 'bar',
        data: chartData,
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          },
          plugins: {
            legend: {
              display: false
            }
          },
          hover: {
            mode: 'nearest',
            intersect: true
          },
          tooltips: {
            mode: 'index',
            intersect: false
          }
        }
      });
    }

    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [audioFeatures, track]);

  return (
    <canvas id="audioFeaturesChart" width="400" height="300"></canvas>
  );
};

AudioFeaturesChart.propTypes = {
  audioFeatures: PropTypes.object,
  track: PropTypes.object
};

export default AudioFeaturesChart;

