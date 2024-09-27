"use strict";
function calculateAge(dob) {
    const [day, month, year] = dob.split('-').map(Number);
    const dobDate = new Date(year, month - 1, day);
    const currentDate = new Date();
    let age = currentDate.getFullYear() - dobDate.getFullYear();
    const monthDifference = currentDate.getMonth() - dobDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && currentDate.getDate() < dobDate.getDate())) {
        age--;
    }
    return age;
}
module.exports = { calculateAge };
