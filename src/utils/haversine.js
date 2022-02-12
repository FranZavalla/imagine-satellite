const haversine = (lat1, lat2, lon1, lon2) => {
  lon1 = (lon1 * Math.PI) / 180;
  lon2 = (lon2 * Math.PI) / 180;
  lat1 = (lat1 * Math.PI) / 180;
  lat2 = (lat2 * Math.PI) / 180;

  let dlon = lon2 - lon1;
  let dlat = lat2 - lat1;

  let h =
    Math.pow(Math.sin(dlat / 2), 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2), 2);

  // Earth radius in km
  let R = 6378;

  let d = 2 * R * Math.asin(Math.sqrt(h));

  return d;
};

module.exports = haversine;
