exports.up = function (knex) {
  return knex.schema.createTable("airtable", (tbl) => {
    tbl.increments();
    tbl.string("title", 128).notNullable();
    tbl.string("origin", 128).notNullable();
    tbl.string("date", 128).notNullable();
    tbl.double("originLongitude").notNullable();
    tbl.double("originLatitude").notNullable();
    tbl.string("destination", 128).notNullable();
    tbl.double("destLongitude").notNullable();
    tbl.double("destLatitude").notNullable();
    tbl.text("story");
    tbl.string("link_to_media");
    tbl
      .string("photo")
      .defaultTo(
        "https://static1.squarespace.com/static/5e98c388f5b32f0d7b5e23f3/t/5ea0cdecb7903837378e7892/1587596784243/juanita.jpg?format=1500w"
      );
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("airtable");
};
