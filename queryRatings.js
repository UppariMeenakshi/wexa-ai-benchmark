const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
    "bolt+s://db-397fea78.bravo.databases.cognodb.com",
    neo4j.auth.basic("cognodb", "e485ea3ccf976340b5082f4a27ce1e7c")
);

async function queryRatings() {
    const session = driver.session();
    const result = await session.run(
        "MATCH (u:User)-[r:RATED]->(m:Movie) RETURN u.userId, m.title, r.rating LIMIT 5"
    );
    result.records.forEach(record =>
        console.log(`${record.get("u.userId")} rated ${record.get("m.title")} ${record.get("r.rating")}`)
    );
    await session.close();
    await driver.close();
}

queryRatings();
