'use strict'

const analytics = {

  calculateBMI(user) {
    return (user.weight / (user.height * user.height)).toFixed(2);
  },

  determineBMICategory(bmiValue) {
    let BMI;

    if (bmiValue < 15) {
      BMI = 'VERY SEVERELY UNDERWEIGHT';
    } else if ((bmiValue >= 15) && (bmiValue < 16)) {
      BMI = 'SEVERELY UNDERWEIGHT';
    } else if ((bmiValue >= 16) && (bmiValue < 18.5)) {
      BMI = 'UNDERWEIGHT';
    } else if ((bmiValue >= 18.5) && (bmiValue < 25)) {
      BMI = 'NORMAL';
    } else if ((bmiValue >= 25) && (bmiValue < 30)) {
      BMI = 'OVERWEIGHT';
    } else if ((bmiValue >= 30) && (bmiValue < 35)) {
      BMI = 'MODERATELY OBESE';
    } else if ((bmiValue >= 35) && (bmiValue < 40)) {
      BMI = 'SEVERELY OBESE';
    } else if (bmiValue >= 40) {
      BMI = 'VERY SEVERELY OBESE';
    }

    return BMI;
  },

  isIdealBodyWeight(user) {
    let idealBodyWeight;
    let heightInches = this.convertHeightMetresToInches(user.height);

    if (heightInches <= 60) {
      if (user.gender === 'Male') {
        idealBodyWeight = 50;
      } else {
        idealBodyWeight = 45.5;
      }
    }

    if (heightInches > 60) {
      if (user.gender === 'Male') {
        idealBodyWeight = 50 + (2.3 * (heightInches - 60));
      } else {
        idealBodyWeight = 45.5 + (2.3 * (heightInches - 60));
      }
    }

    if ((user.weight >= (idealBodyWeight - 2)) && (user.weight <= (idealBodyWeight + 2))) {
      return 'green';
    } else {
      return 'red';
    }
  },

  convertHeightMetresToInches(height) {
    return (height * 39.37).toFixed(2);
  },

  convertWeightKgToPounds(weight) {
    return (weight * 2.20).toFixed(2);
  },
};

module.exports = analytics;
