// const { LexModelBuildingService } = require('aws-sdk');
const spicedPg = require('spiced-pg');
const db = spicedPg(process.env.DATABASE_URL || 'postgres:postgres:postgres@localhost:5432/imageboard');


module.exports.getImgages = () => {
    return db.query(
        "SELECT * FROM images ORDER BY id DESC LIMIT 5"
    );
};

module.exports.uploadImage = (url, username, title, description) => {
    return db
        .query(
            `
            INSERT INTO images (url, username, title, description)
            VALUES ($1, $2, $3, $4)
            RETURNING id, url, username, title, description`,
            [url , username , title , description]
        );
};

module.exports.getSingleImage = (id)=> {
    return db
        .query(
            `
            SELECT * FROM images WHERE id = $1
            `,
            [id]
        );
};

module.exports.getMoreImages = (lastId) => {
        return db
        .query(
            `
            SELECT *, (
                SELECT id FROM images
                ORDER BY id
                LIMIT 1) AS last_id
            FROM images
            WHERE id < $1
            ORDER BY id DESC
            LIMIT 5`,
            [lastId]
        )

}
