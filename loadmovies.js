const fs = require('fs');
const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
    "bolt+s://db-397fea78.bravo.databases.cognodb.com",
    neo4j.auth.basic("cognodb", "e485ea3ccf976340b5082f4a27ce1e7c")
);

async function loadMovies() {
    const session = driver.session();
    const data = fs.readFileSync("src/movies.csv", "utf8").split("\n").slice(1);

    // prepare rows
    const rows = [];
    for (const line of data.slice(0, 500)) { // limit for testing
        if (!line.trim()) continue;
        const [movieId, title, genres] = line.split(",");
        rows.push({ movieId, title, genres });
    }

    await session.run(
        "UNWIND $rows AS row CREATE (m:Movie {movieId: row.movieId, title: row.title, genres: row.genres})",
        { rows }
    );

    console.log("Movies loaded in batch!");
    await session.close();
    await driver.close();
}

loadMovies();
