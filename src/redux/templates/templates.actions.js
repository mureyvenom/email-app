import { TemplatesActionTypes } from './templates.types';

export const setTemplates = templates => ({
    type: TemplatesActionTypes.SET_TEMPLATES,
    payload: templates
})

export const clearTemplates = () => ({
    type: TemplatesActionTypes.SET_TEMPLATES,
    payload: null
})

// export const setTemplate = template => ({
//     type: TemplatesActionTypes.SET_TEMPLATE,
//     payload: template
// })