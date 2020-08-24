const Airtable = require("airtable");
const airDB = require("../models/airtable-model");
const axios = require("axios");
const randomGeo = require("../utils/randomGeo");

const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

function Records() {
  var base = new Airtable({ apiKey: process.env.AIRTABLE_API }).base(
    "app31LZ0C4agHIxXz"
  );
  base("All Reunions (CSC and FT)")
    .select({
      // maxRecords: 100,
      fields: [
        "CASE RECORD",
        "Reunion Story",
        "Loved One Last Known Location",
        "Link to the MM (YouTube)",
        "Attachments/Client Photo",
        "SUBMISSION INFO: CITY",
      ],
      filterByFormula:
        "AND(NOT({Client Current City}=''), NOT({Loved One Last Known Location}=''))",
      view: "Reunion view",
    })
    .eachPage(
      function page(records, fetchNextPage) {
        asyncForEach(records, async (record) => {
          newReunion = {};
          newReunion.title = record.fields["CASE RECORD"];
          newReunion.origin = record.fields["SUBMISSION INFO: CITY"][0];
          newReunion.destination =
            record.fields["Loved One Last Known Location"];
          newReunion.destination = newReunion.destination.replace(
            /[^\w\s]/gi,
            " "
          );
          fixes = [
            "UNKNOWN",
            "NOT GIVEN",
            "NOT SURE",
            "FIND THEM",
            "ON THE WEBAPP",
          ];
          fixes.forEach((word) => {
            if (newReunion.destination.includes(word)) {
              newReunion.destination = newReunion.origin;
            }
          });
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
          if (record.fields["Reunion Story"]) {
            newReunion.story = record.fields["Reunion Story"];
          }
          if (record.fields["Attachments/Client Photo"]) {
            const photo = record.fields["Attachments/Client Photo"][0]["url"];
            const check = photo.split("/");
            if (check[check.length - 1] != "GalleryPlaceholder.jpg") {
              newReunion.photo = photo;
            }
          }
          // console.log(newReunion);
          await airDB.update(newReunion);
        }).then((e) => fetchNextPage());
        // fetchNextPage();
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
