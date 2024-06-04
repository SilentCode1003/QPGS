import express from 'express'
import {
  createPreset,
  deletePreset,
  getPreset,
  getPresets,
  updatePreset,
} from '../handlers/terms.handler'

export const termsAndConditionsRouter = express.Router()

// Anyone can get terms and conditions presets
termsAndConditionsRouter.get('/', getPresets)

// Only admin can create preset
termsAndConditionsRouter.post('/', createPreset)

// Anyone can get preset
termsAndConditionsRouter.get('/:id', getPreset)

// Only admin can update a preset
termsAndConditionsRouter.put('/:id', updatePreset)

// Only admin cna delete a preset
termsAndConditionsRouter.delete('/:id', deletePreset)
