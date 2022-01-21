import { TemplatesActionTypes } from './templates.types';

const INITIAL_STATE = {
    templates: null,
    template: null
}

const templatesReducer = (state = INITIAL_STATE, action) => {
    switch(action.type){
        case TemplatesActionTypes.SET_TEMPLATES:
            return{
                ...state,
                templates: action.payload
            }
        // case TemplatesActionTypes.SET_TEMPLATE:
        //     return {
        //         ...state,
        //         template: action.payload
        //     }
        default: 
            return state
    }
}

export default templatesReducer;