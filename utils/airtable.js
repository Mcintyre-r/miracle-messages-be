const Airtable = require("airtable");
const airDB = require("../models/airtable-model");
const axios = require("axios");
const randomGeo = require("../utils/randomGeo");
const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};
// process.env.AIRTABLE_API
function Records() {
  var base = new Airtable({ apiKey: "keyiokpwA8U49eeG1" }).base(
    "app31LZ0C4agHIxXz"
  );
  base("Miracle Messages Cases")
    .select({
      // maxRecords: 3,
      fields: [
        "CASE RECORD",
        "OUTCOME: REUNION STORY",
        "Loved One Last Known Location",
        "Client Current City",
        "Link to the MM (YouTube)",
        "Attachments/Client Photo",
        "SUBMISSION INFO: CITY",
      ],
      filterByFormula:
        "AND(NOT({OUTCOME: REUNION STORY}=''), NOT({Client Current City}=''), NOT({Loved One Last Known Location}=''))",
      // view: "Grid view",
    })
    .eachPage(
      function page(records, fetchNextPage) {
        // newReunion = {};
        asyncForEach(records, async (record) => {
          // console.log(record.fields["SUBMISSION INFO: CITY"][0]);
          newReunion = {};
          newReunion.title = record.fields["CASE RECORD"];
          newReunion.story = record.fields["OUTCOME: REUNION STORY"];
          newReunion.origin = record.fields["SUBMISSION INFO: CITY"][0];
          newReunion.destination = record.fields[
            "Loved One Last Known Location"
          ].replace("?", " ");
          newReunion.destination = newReunion.destination.replace(";", " ");
          newReunion.destination = newReunion.destination.replace("#", " ");
          newReunion.destination = newReunion.destination.replace(".", " ");
          newReunion.destination = newReunion.destination.replace(/\//g, " ");
          if (newReunion.destination.includes("Schererville")) {
            newReunion.destination = "Schererville,IN";
          }
          if (newReunion.destination.includes("Littleton")) {
            newReunion.destination = "Littleton,CO";
          }
          if (newReunion.destination.includes("Birmingham")) {
            newReunion.destination = "Birmingham, AL";
          }
          const originCord = await axios
            .get(
              `https://api.mapbox.com/geocoding/v5/mapbox.places/${newReunion.origin}.json?access_token=${process.env.MAPBOX_API}`
            )
            .then((res) => {
              if (res.data.features) {
                return res.data.features[0].geometry.coordinates;
              }
            })
            .catch((err) => {
              console.log("could not get lat & lng from mapbox", err);
            });
          const destCord = await axios
            .get(
              `https://api.mapbox.com/geocoding/v5/mapbox.places/${newReunion.destination}.json?access_token=${process.env.MAPBOX_API}`
            )
            .then((res) => {
              if (res.data.features) {
                return res.data.features[0].geometry.coordinates;
              }
            })
            .catch((err) => {
              console.log("could not get lat & lng from mapbox", err);
            });
          if (originCord.length > 0) {
            newReunion.originLatitude = originCord[1];
            newReunion.originLongitude = originCord[0];
          }
          if (destCord.length > 0) {
            newReunion.destLatitude = destCord[1];
            newReunion.destLongitude = destCord[0];
            newReunion = randomGeo(newReunion, 2000);
          }
          if (record.fields["Link to the MM (YouTube)"]) {
            newReunion.link_to_media =
              record.fields["Link to the MM (YouTube)"];
          }
          if (record.fields["Attachments/Client Photo"]) {
            newReunion.photo =
              record.fields["Attachments/Client Photo"][0]["url"];
          }
          console.log(newReunion);
          // await airDB.update(newReunion);1
        });
        fetchNextPage();
      },
      function done(err) {
        if (err) {
          console.error(err);
          return;
        }
      }
    );
}

module.exports = Records;
