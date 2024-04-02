import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { findNotes, getAllNotes, newNote, removeAllNotes, removeNote } from "./notes.js";
import { start } from "./server.js";

//util function
const listNotes = notes => {
    notes.forEach(({id, content, tags}) => {
        console.log('id : ', id)
        console.log('tags : ', tags)
        console.log('content : ', content)
        console.log('\n')
    })
}

yargs(hideBin(process.argv))
    // FIRST COMMAND FOR CREATING NOTE
    .command('new <note>', 'create a new note', (yargs) => {
        return yargs.positional('note', { //checking the type of note is String?
            type : 'string',
            describe : 'The content of the note you want to create'
        })
    },
    async (argv) => {
        const tags = argv.tags ? argv.tags.split(",") : []
        const note = await newNote(argv.note, tags);
        console.log("Note Added! : ", note);
    })
    .option('tags', {
        type : 'string',
        alias : "t",
        description : "tags to add to the note"
    })

    //SECOND COMMAND FOR SHOWING ALL THE NOTES
    .command('all', 'get all the notes', () => {}, async (argv) => {
        const notes = await getAllNotes();
        if(notes.length > 0) {
          listNotes(notes);
        }
        else console.log("No notes found, please add notes");
    })

    //THIRD COMMAND FOR FINDING A NOTE
    .command('find <filter>', 'get matching notes', (yargs) => {
        return yargs.positional('filter', {
            describe : "The search term to filter notes by, will be applied to note.content",
            type : 'string'
        })
    },
    async (argv) => {
        const matches = await findNotes(argv.filter);
        listNotes(matches);
    })

    //FOURTH COMMAND FOR DELETING NOTE
    .command('remove <id>', 'remove a note by id', yargs => {
        return yargs.positional('id', {
          type: 'number',
          description: 'The id of the note you want to remove'
        })
      }, async (argv) => {
        const id = await removeNote(argv.id);
        console.log("Note Removed : ", id);
      })

      //FIFTH COMMAND FOR SHOWING NOTES ON WEB
      .command('web [port]', 'launch website to see notes', yargs => {
        return yargs
          .positional('port', {
            describe: 'port to bind on',
            default: 5000,
            type: 'number'
          })
      }, async (argv) => {
        const notes = await getAllNotes();
        start(notes, argv.port);
      })

      //SIXTH COMMAND FOR DELETING EVERY SINGLE NOTE
      .command('clean', 'remove all notes', () => {}, async (argv) => {
        await removeAllNotes()
        console.log("Database Reseted");
      })
    .demandCommand(1)
    .parse()