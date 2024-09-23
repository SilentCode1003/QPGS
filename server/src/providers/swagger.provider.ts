import { CONFIG_ENV } from '@/config/env.config'
import type { Express } from 'express'
import fs from 'node:fs'
import { serve, setup } from 'swagger-ui-express'
import YAML from 'yaml'

const v1File = fs.readFileSync('./src/docs/v1Doc.yaml', 'utf-8')
const v1Doc = YAML.parse(v1File)

export const initDocs = (app: Express) => {
  if (CONFIG_ENV.NODE_ENV === 'development') {
    app.use('/v1/api-docs', serve, setup(v1Doc))
  }
}
