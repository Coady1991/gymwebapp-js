'use strict'

const analytics = {

  calculateBMI(weight, height) {
    return (weight / (height * height)).toFixed(2);
  },

  determineBMICategory(calculateBMI) {
    let BMI;

    if (calculateBMI < 15) {
      BMI = 'VERY SEVERELY UNDERWEIGHT';
    } else if ((calculateBMI >= 15) && (calculateBMI < 16)) {
      BMI = 'SEVERELY UNDERWEIGHT';
    } else if ((calculateBMI >= 16) && (calculateBMI < 18.5)) {
      BMI = 'UNDERWEIGHT';
    } else if ((calculateBMI >= 18.5) && (calculateBMI < 25)) {
      BMI = 'NORMAL';
    } else if ((calculateBMI >= 25) && (calculateBMI < 30)) {
      BMI = 'OVERWEIGHT';
    } else if ((calculateBMI >= 30) && (calculateBMI < 35)) {
      BMI = 'MODERATELY OBESE';
    } else if ((calculateBMI >= 35) && (calculateBMI < 40)) {
      BMI = 'SEVERELY OBESE';
    } else if (calculateBMI >= 40) {
      BMI = 'VERY SEVERELY OBESE';
    }

    return BMI;
  },

  isIdealBodyWeight(user, height) {
    let idealBodyWeight;
    let heightInches = this.convertHeightMetresToInches(height);

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
