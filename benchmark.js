const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
    "bolt+s://db-397fea78.bravo.databases.cognodb.com",
    neo4j.auth.basic("cognodb", "e485ea3ccf976340b5082f4a27ce1e7c")
);

async function runBenchmark(query, label) {
    const session = driver.session();
    const start = Date.now();
    const result = await session.run(query);
    const end = Date.now();
    console.log(`${label} → ${end - start} ms, rows: ${result.records.length}`);
    await session.close();
}

async function main() {
    // Lookup query
    await runBenchmark("MATCH (m:Movie {title:'Toy Story (1995)'}) RETURN m", "Lookup Toy Story");

    // Traversal query
    await runBenchmark("MATCH (u:User {userId:'1'})-[:RATED]->(m:Movie) RETURN m.title, m.movieId", "User 1 rated movies");

    // Aggregation query
    await runBenchmark("MATCH (m:Movie)<-[r:RATED]-() RETURN m.title, avg(r.rating) AS avgRating ORDER BY avgRating DESC LIMIT 5", "Top 5 movies by avg rating");

    await driver.close();
}

main();
