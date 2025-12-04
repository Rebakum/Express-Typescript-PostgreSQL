import dotenv from "dotenv";
import express, { Request, Response } from "express";
import path from "path";
import { Pool } from "pg";
dotenv.config({ path: path.join(process.cwd(), ".env") });

const app = express();
const port = 5000;
// parser
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

//DB
const pool = new Pool({
  connectionString: `${process.env.CONNECTION_STR}`,
});
const initDB = async () => {
  await pool.query(`
        
        CREATE TABLE  IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        age INT,
        phone VARCHAR(15),
        address TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        )
        
        `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS todos(
            id SERIAL PRIMARY KEY,
            user_id INT REFERENCES users(id) ON DELETE CASCADE,
            title VARCHAR(200) NOT NULL,
            description TEXT,
            completed BOOLEAN DEFAULT false,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
  )
            `);
};
initDB();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello Next level developer!");
});

// api/v1/users CURD
app.post("/api/v1/users", async (req: Request, res: Response) => {
  const { name, email } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO USERS(name, email) VALUES($1, $2) RETURNING *`,
      [name, email]
    );
    // console.log(result.rows[0]);
    // res.send({ message: "data inserted" });
    res.status(201).json({
      success: true,
      message: "Data Inserted successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// GET ALL USERS
app.get("/api/v1/users", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM users`);
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      details: err,
    });
  }
});
// GET SINGLE USER
app.get("/api/v1/users/:id", async (req: Request, res: Response) => {
  //   console.log(req.params.id);
  //   res.send({ message: "API is cool .." });
  try {
    const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [
      req.params.id,
    ]);
    // console.log(result.rows);
    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: " User Not Found!!",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Users fetched successfully",
        data: result.rows[0],
      });
    }
  } catch (err: any) {
    res.status(200).json({
      success: false,
      message: err.message,
    });
  }
});
// PUT USER
app.put("/api/v1/users/:id", async (req: Request, res: Response) => {
  //   console.log(req.params.id);
  const { name, email } = req.body;
  try {
    const result = await pool.query(
      `UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING * `,
      [name, email, req.params.id]
    );
    // console.log(result.rows);
    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: " User Not Found!!",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Users Updated successfully",
        data: result.rows[0],
      });
    }
  } catch (err: any) {
    res.status(200).json({
      success: false,
      message: err.message,
    });
  }
});
// DELETE USER
app.delete("/api/v1/users/:id", async (req: Request, res: Response) => {
  //   console.log(req.params.id);

  try {
    const result = await pool.query(`DELETE FROM users WHERE id = $1`, [
      req.params.id,
    ]);

    if (result.rowCount === 0) {
      console.log(result.rowCount);

      res.status(404).json({
        success: false,
        message: " User Not Found!!",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Users Deleted successfully",
        data: result.rows,
      });
    }
  } catch (err: any) {
    res.status(200).json({
      success: false,
      message: err.message,
    });
  }
});

// todos create

app.post("/api/v1/todos", async (req: Request, res: Response) => {
  const { user_id, title } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO TODOS(user_id, title) VALUES($1, $2) RETURNING *`,
      [user_id, title]
    );
    res.status(201).json({
      success: true,
      message: " Todo Created Successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});
// GET ALL TODOS
app.get("/api/v1/todos", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM todos`);
    res.status(200).json({
      success: true,
      message: "Todos retrieved successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      details: err,
    });
  }
});
// GET SINGLE TODOS
app.get("/api/v1/todos/:id", async (req: Request, res: Response) => {
  //   console.log(req.params.id);
  //   res.send({ message: "API is cool .." });
  try {
    const result = await pool.query(`SELECT * FROM todos WHERE id = $1`, [
      req.params.id,
    ]);
    // console.log(result.rows);
    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: " Todos Not Found!!",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Todos fetched successfully",
        data: result.rows[0],
      });
    }
  } catch (err: any) {
    res.status(200).json({
      success: false,
      message: err.message,
    });
  }
});
// PUT TODOS
app.put("/api/v1/todos/:id", async (req: Request, res: Response) => {
  //   console.log(req.params.id);
  const { user_id, title } = req.body;
  try {
    const result = await pool.query(
      `UPDATE todos SET user_id=$1, title=$2 WHERE id=$3 RETURNING * `,
      [user_id, title, req.params.id]
    );
    console.log(result.rows);
    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: " Todos Not Found!!",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Todos Updated successfully",
        data: result.rows[0],
      });
    }
  } catch (err: any) {
    res.status(200).json({
      success: false,
      message: err.message,
    });
  }
});
// DELETE TODOS
app.delete("/api/v1/todos/:id", async (req: Request, res: Response) => {
  //   console.log(req.params.id);

  try {
    const result = await pool.query(`DELETE FROM todos WHERE id = $1`, [
      req.params.id,
    ]);

    if (result.rowCount === 0) {
      console.log(result.rowCount);

      res.status(404).json({
        success: false,
        message: " Todos Not Found!!",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Todoss Deleted successfully",
        data: result.rows,
      });
    }
  } catch (err: any) {
    res.status(200).json({
      success: false,
      message: err.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
