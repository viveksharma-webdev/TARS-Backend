const express = require('express');
const router = express.Router();
const upload = require('../config/multerConfig.js');
const sharp = require('sharp');
const noteModel = require('../models/noteModel.js');
const userModel = require('../models/userModel.js');


router.get('/notes', async (req, res) => {
    try {
        const notes = await noteModel.find({ user: req.user.id }).sort({ createdAt: 1 }); 

        res.status(200).json(notes);
    } catch (error) {
        console.error("ERROR in Fetching Notes:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

router.get('/notes/:id', async (req, res) => {
    try{
        const note = await noteModel.findById(req.params.id);

        if(!note){
            return res.status(404).json({ message: "Note not found" });
        }

        res.status(200).send(note);
    }catch(error){
       console.log("error in getting note based on id");
    }
});

router.post('/create/notes', upload.single('image'), async (req, res) => {
    try { 
        const { title, content} = req.body; 
        const user = req.user.id;
        let image = null;
        let isFavorite = false;

        if (req.file) {
            image = req.file.buffer;
            if (req.file.size > 2 * 1024 * 1024) {
                image = await sharp(req.file.buffer).resize({ width: 1920 }).toBuffer();
            }
        }

       
        const note = await noteModel.create({ title, content, isFavorite, image, user });
         
        await userModel.findByIdAndUpdate(user, {
            $push: { notes: note._id }
        });

        console.log(note);
        res.send(note);

    } catch (error) {
        console.log("ERROR in Creating a note", error.message);
        res.status(500).send({ error: "Internal Server Error" });
    }
});


router.put('/notes/:id', upload.single('image'), async (req, res) => {
    try {
        const { title, content, isFavorite } = req.body;
        let image = null;

        if (req.file) {
            if (req.file.size > 2 * 1024 * 1024) { // Resize if >2MB
                image = await sharp(req.file.buffer).resize({ width: 1920 }).toBuffer();
            } else {
                image = req.file.buffer;
            }
        }

        const updatedNote = await noteModel.findByIdAndUpdate(
            req.params.id,
            { title, content, isFavorite, ...(image && { image })},
            { new: true, runValidators: true }
        );

        if (!updatedNote) {
            return res.status(404).json({ message: "Note not found" });
        }

        res.status(200).json(updatedNote);
    } catch (error) {
        console.error("ERROR in Updating a note:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});


router.delete('/notes/:id', async (req, res) => {
    try {
     
        const deletedNote = await noteModel.findByIdAndDelete(req.params.id);

        if (!deletedNote) {
            return res.status(404).json({ message: "Note not found" });
        }
        const user = await userModel.findByIdAndUpdate( req.user.id,{
            $pull: { notes: deletedNote._id }
        });


        res.status(200).json({ message: "Note deleted successfully", deletedNote });
    } catch (error) {
        console.error("ERROR in Deleting a note:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

router.get('/notes/fav', async (req, res) => {
    try {
        const note = await noteModel.find({isFavorite: true});
        if (!note) { 
            return res.status(400).json({message: "Empty"})
         }

         res.status(200).json(note);

    } catch (error) {
        
    }
})

module.exports = router;