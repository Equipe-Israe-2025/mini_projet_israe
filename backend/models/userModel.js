const pool= require('../config/db');

exports.createUser= async(username,passwordHash)=>{
    const{rows} =await pool.query(
        'Insert into users (username,password_hash) VALUES ($1,$2) RETURNING *',
        [username, passwordHash]
        );
            return rows[0];
};
exports.findUserByUsername = async(username)=>{
    const {rows}=await pool.query(
        'SELECT * FROM users WHERE username=$1',[username]
    );
    return rows[0];
};