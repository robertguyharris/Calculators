var monthlyValues = Array(60).fill(null);
var monthlyDeposits = Array(60).fill(null);

var ctx = document.getElementById('savingsChart').getContext('2d');
var chart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: Array(monthlyValues.length).fill().map((_, i) => i + 1),
    datasets: [{
      label: 'Savings Value',
      data: monthlyValues,
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  },
  options: {
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    },
    plugins: {
      title: {
        display: true,
        text: 'Value of Savings Over Time',
        color: 'white',
        font: {
          size: 24
        }
      },
      zoom: {
        pan: {
          enabled: true,
          mode: 'x'
        },
        zoom: {
          drag: {
            enabled: true
          },
          wheel: {
            enabled: true
          },
          mode: 'x'
        }
      },
      tooltip: {
        displayColors: false,
        callbacks: {
          title: function (tooltipItem) {
            return 'Month: ' + tooltipItem[0].label;
          },
          label: function (context) {
            var value = context.parsed.y;
            if (value !== null) {
              return 'Savings Value: ' + value.toFixed(2);
            } else {
              return '';
            }
          },
          afterLabel: function(tooltipItem, data) {
            var month = tooltipItem.label;
            var monthlyInvestment = monthlyDeposits[month];
            return 'Monthly Investment: ' + monthlyInvestment.toFixed(2);
          }
        }
      },
      legend: {
        display: false,
        position: 'bottom',
        labels: {
          usePointStyle: true
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Month',
          color: 'white',
          font: {
            size: 14
          }
        },
        ticks: {
          color: 'gray'
        }
      },
      y: {
        ticks: {
          color: 'gray'
        }
      }
    },
    elements: {
      point: {
        radius: 3
      }
    }
  }
});

document.getElementById('calculateButton').addEventListener('click', function (event) {
  event.preventDefault();

  var initialAmount = document.getElementById('initialAmount').value;
  initialAmount = initialAmount === '' ? 0 : parseFloat(initialAmount);
  var monthlyDeposit = document.getElementById('monthlyDeposit').value;
  monthlyDeposit = monthlyDeposit === '' ? 0 : parseFloat(monthlyDeposit);
  var escalationRate = document.getElementById('escalationRate').value;
  escalationRate = (escalationRate === '' ? 0 : parseFloat(escalationRate.replace('%', ''))) / 100;
  var interestRate = document.getElementById('interestRate').value;
  interestRate = (interestRate === '' ? 0 : parseFloat(interestRate.replace('%', ''))) / 100;
  var years = document.getElementById('years').value;
  years = years === '' ? 0 : parseFloat(years);

  var totalAmount = initialAmount;
  monthlyValues = [totalAmount];
  monthlyDeposits = [monthlyDeposit];

  for (var i = 0; i < years * 12; i++) {
    if (i > 0 && i % 12 === 0) {
      monthlyDeposit *= (1 + escalationRate);
    }
    monthlyDeposits.push(monthlyDeposit);
    totalAmount += monthlyDeposit;
    totalAmount = totalAmount * (1 + interestRate) ** (1 / 12);
    monthlyValues.push(totalAmount);
  }

  chart.data.labels = Array.from({ length: years * 12 + 1 }, (_, i) => i);
  chart.data.datasets[0].data = monthlyValues;
  chart.update();

});

document.getElementById('interestRate').addEventListener('input', function () {
  var interestValue = this.value.replace('%', '');
  var interestCursorPosition;
  if (interestValue !== '' && !isNaN(interestValue)) {
    this.value = interestValue + '%';
    interestCursorPosition = this.value.indexOf('%');
    this.setSelectionRange(interestCursorPosition, interestCursorPosition);
  }
});

document.getElementById('escalationRate').addEventListener('input', function () {
  var escalationValue = this.value.replace('%', '');
  var escalationCursorPosition;
  if (escalationValue !== '' && !isNaN(escalationValue)) {
    this.value = escalationValue + '%';
    escalationCursorPosition = this.value.indexOf('%');
    this.setSelectionRange(escalationCursorPosition, escalationCursorPosition);
  }
});

document.getElementById('resetZoom').addEventListener('click', function () {
  chart.resetZoom();
});
