import React from 'react';
import { Route  } from 'react-router-dom';
import TemplatesTable from '../templates-table/templates';
import EditTemplatePage from '../edit-template/edit-template';

const TemplatesPage = ({match}) => {
    return(
        <div>
            <Route exact path={`${match.path}`} component={TemplatesTable} />
            <Route path={`${match.path}/:templateId`} component={EditTemplatePage} />
        </div>
    );
}

export default TemplatesPage;