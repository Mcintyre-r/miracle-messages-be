module.exports = function randomGeo(center, radius) {
  var y0 = parseFloat(center.destlatitude);
  var x0 = parseFloat(center.destlongitude);
  var rd = radius / 111300;

  var u = Math.random();
  var v = Math.random();

  var w = rd * Math.sqrt(u);
  var t = 2 * Math.PI * v;
  var x = w * Math.cos(t);
  var y = w * Math.sin(t);

  return (center = { ...center, destlatitude: y + y0, destlongitude: x + x0 });
};
