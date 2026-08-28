const fs = require('fs');
const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
    "bolt+s://db-397fea78.bravo.databases.cognodb.com",
    neo4j.auth.basic("cognodb", "e485ea3ccf976340b5082f4a27ce1e7c")
);

async function loadRatings() {
    const session = driver.session();
    const data = fs.readFileSync(__dirname + '/ratings.csv', 'utf8').split('\n').slice(1);

    const rows = [];
    for (const line of data.slice(0, 500)) { // limit for testing
        if (!line.trim()) continue;
        const [userId, movieId, rating] = line.split(",");
        rows.push({ userId, movieId, rating: parseFloat(rating) });
    }

    await session.run(
        `UNWIND $rows AS row
     MERGE (u:User {userId: row.userId})
     MERGE (m:Movie {movieId: row.movieId})
     CREATE (u)-[:RATED {rating: row.rating}]->(m)`,
        { rows }
    );

    console.log("Ratings loaded in batch!");
    await session.close();
    await driver.close();
}

loadRatings();
