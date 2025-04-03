// Test kod för att servern inte ska krascha.
// // Ska kopplas till models-filerna
module.exports = {
  get: (req, res) => {
    res.send("Användare: Bertil Bertilsson");
  },
};
