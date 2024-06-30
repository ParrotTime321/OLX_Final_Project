const admin = require('../database');
const db = admin.firestore();


const getAllSubcategories = async(req, res, next)=>{
    try{
        const snapshot = await db.collection('subcategories').get();
        const result = [];
        snapshot.forEach((doc)=>{
            result.push({id:doc.id, ...doc.data()});
        });
        res.status(200).json(result);
    }
    catch(error){
        next(error);
    }
};

const createSubCategories = async(req, res,next)=>{
    try{
        const newSubcategory = {
            name: req.body.name,
            picture: req.body.picture,
            categoryId: req.body.categoryId
        };
        const docRef = await db.collection("subcategories").add(newSubcategory);
        console.log("Document written with ID: ", docRef.id);
        res.status(201).json(newSubcategory);
    }
    catch(error){
        next(error);
    }
};

const updateSubCategory = async(req, res,next)=>{
    try{
        let {id, name, picture, categoryId} = req.body;
        const subcategoriesRef = db.collection('subcategories').doc(id);
        let doc = await subcategoriesRef.get();

        if (!id) {
            return res.status(400).json({ error: 'Subcategory ID is required' });
        }
        if(!doc.exists){
            res.status(404).json({error: 'Subcategory not found'});
            return;
        }
        await subcategoriesRef.update({name, picture, categoryId});
        const updateDoc = await subcategoriesRef.get();
        res.status(200).json(updateDoc.data());
    }
    catch(error){
        next(error);
    }
};


const deleteSubCategory = async (req, res,next) => {
    try {
        const subCategoryId = req.params.id;

        if (!subCategoryId) {
            return res.status(400).json({ error: 'Subcategory ID is required' });
        }

        const subCategoryRef = db.collection('subcategories').doc(subCategoryId);
        const doc = await subCategoryRef.get();

        if (!doc.data()) {
            return res.status(400).json({ error: `No subcategory with id ${subCategoryId}` });
        }
        await subCategoryRef.delete();

        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};
const getSubCategoryById= async(req, res,next)=>{
    try {

        const subCategoryId = req.params.id;

        if (!subCategoryId) {
            return res.status(400).json({ error: 'Subcategory ID is required' });
        }
        
        const subcategoriesRef = db.collection('subcategories').doc(req.params.id);
        const doc = await subcategoriesRef.get();
        if (!doc.exists) {
            return res.status(404).json({ error: `No subcategory with id ${req.params.id}` });
        }
        res.status(200).json({ id: doc.id, ...doc.data() });
    } catch (error) {
        next(error);
    }
}


module.exports = {
    getAllSubcategories,
    createSubCategories,
    updateSubCategory,
    deleteSubCategory,
    getSubCategoryById
}
