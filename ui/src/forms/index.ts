import { FieldTemplates, LitForm } from '@lit-any/forms'
import * as BulmaComponents from './BulmaComponents'

LitForm.noShadow = true

FieldTemplates.default.useComponents(BulmaComponents)
