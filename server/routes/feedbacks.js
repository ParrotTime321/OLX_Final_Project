const express = require('express')
const router = express.Router()
const feedbackController = require('../controllers/feedbackController')

router.route('/')
    .get(feedbackController.getAllFeedbacks)
    .post(feedbackController.createFeedback)
    .put(feedbackController.updateFeedback);
    
    router.route('/:id')
    .get(feedbackController.getFeedbackById)
    .delete(feedbackController.deleteFeedback);

module.exports = router;