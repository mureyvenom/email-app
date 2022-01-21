import { createSelector } from 'reselect';

const buildTemplates = (state) => state.templates;

export const selectTemplates = createSelector(
    [buildTemplates],
    templates => templates.templates
)