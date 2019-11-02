const express = require('express');
const router = express.Router();
const tradingEquipmentController = require('../controllers/trading-equipments')
const {modelBinder, multipleModelBinder} = require('../controllers/db')
const {isAuthenticated} = require('../controllers/auth')
const { TradingEquipmentFollow } = require('../models/trading-eq-follow')
const { TradingEquipmentPrediction } = require('../models/trading-eq-prediction')
const { TradingEquipment } = require('../models/trading-eq')
const { CurrentTradingEquipment } = require('../models/current-trading-eq')
const { Comment } = require('../models/comment')

/*
  Get endpoint for information of specific trading equipment.
  Check controller function for more detail
*/
router.get('/:code', multipleModelBinder([
  [TradingEquipment, 'TradingEquipment'],
  [TradingEquipmentFollow, 'TradingEquipmentFollow'],
  [CurrentTradingEquipment, 'CurrentTradingEquipment'],
  [TradingEquipmentPrediction, 'TradingEquipmentPrediction'],
  [Comment, 'Comment'],
]), tradingEquipmentController.getTradingEquipment)

/*
  Get endpoint for information of all trading equipment's current values.
  Check controller function for more detail
*/
router.get('', modelBinder(CurrentTradingEquipment, 'CurrentTradingEquipment'), tradingEquipmentController.getCurrentValues)

/*
  Post endpoint for following specific trading equipment.
  Check controller function for more detail
*/
router.post('/follow', [isAuthenticated, modelBinder(TradingEquipmentFollow, 'TradingEquipmentFollow')], tradingEquipmentController.followTradingEq)

/*
  Post endpoint for unfollowing specific trading equipment.
  Check controller function for more detail
*/
router.post('/unfollow', [isAuthenticated, modelBinder(TradingEquipmentFollow, 'TradingEquipmentFollow')], tradingEquipmentController.unfollowTradingEq)

/*
  Post endpoint for making a prediction regarding the increase or decrease of a specific trading equipment.
  Check controller function for more detail
*/
router.post('/prediction', [isAuthenticated, modelBinder(TradingEquipmentPrediction, 'TradingEquipmentPrediction')], tradingEquipmentController.predictTradingEq)

module.exports = router
