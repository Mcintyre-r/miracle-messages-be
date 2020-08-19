module.exports = function randomGeo(center, radius) {
  var y0 = parseFloat(center.destLatitude);
  var x0 = parseFloat(center.destLongitude);
  var rd = radius / 111300;

  var u = Math.random();
  var v = Math.random();

  var w = rd * Math.sqrt(u);
  var t = 2 * Math.PI * v;
  var x = w * Math.cos(t);
  var y = w * Math.sin(t);

  return (center = { ...center, destLatitude: y + y0, destLongitude: x + x0 });
};
