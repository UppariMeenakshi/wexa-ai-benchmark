const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
    "bolt+s://db-397fea78.bravo.databases.cognodb.com",
    neo4j.auth.basic("cognodb", "e485ea3ccf976340b5082f4a27ce1e7c")
);

async function test() {
    const session = driver.session();
    const result = await session.run("RETURN 1");
    console.log(result.records);
    await session.close();
    await driver.close();
}

test();
