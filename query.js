const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
    "bolt+s://db-397fea78.bravo.databases.cognodb.com\n",
    neo4j.auth.basic("cognodb", "e485ea3ccf976340b5082f4a27ce1e7c")
);

async function queryMovies() {
    const session = driver.session();
    const result = await session.run("MATCH (m:Movie) RETURN m.title LIMIT 5");
    result.records.forEach(record => console.log(record.get("m.title")));
    await session.close();
    await driver.close();
}

queryMovies();
