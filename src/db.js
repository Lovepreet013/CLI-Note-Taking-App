import fs from 'node:fs/promises'
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Convert import.meta.url to a file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Resolve the path to db.json from the directory of the current module
const DB_PATH = resolve(__dirname, '..', 'db.json');
console.log(DB_PATH);

export const getDB = async () => { //converting the file to JS Object
  const db = await fs.readFile(DB_PATH, 'utf-8')
  return JSON.parse(db)
}

export const saveDB = async (db) => {
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2)) //Saving the JS Object in JSON format
  return db
}

export const insert = async (data) => { //Inserting into JS Object
  const db = await getDB()
  db.notes.push(data)
  await saveDB(db)
  return data
}