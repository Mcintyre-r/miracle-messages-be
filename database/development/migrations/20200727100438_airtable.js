exports.up = function (knex) {
  return knex.schema.createTable("airtable", (tbl) => {
    tbl.increments();
    tbl.string("title", 128).notNullable();
    tbl.string("origin", 128).notNullable();
    tbl.double("originLongitude").notNullable();
    tbl.double("originLatitude").notNullable();
    tbl.string("destination", 128).notNullable();
    tbl.double("destLongitude").notNullable();
    tbl.double("destLatitude").notNullable();
    tbl.text("story").notNullable();
    tbl.string("link_to_media");
    tbl
      .string("photo")
      .defaultTo(
        "https://images.squarespace-cdn.com/content/5e98c388f5b32f0d7b5e23f3/1587070068447-WK2DOCU06NE70HIVU6F2/MM_Logo_Website_Large.png?content-type=image%2Fpng"
      );
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("airtable");
};
