// Test kod för att servern inte ska krascha.
// // Ska kopplas till models-filen
module.exports = {
  get: (req, res) => {
    res.send("Här är din order.");
  },
};
