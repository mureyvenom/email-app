import { Switch, Route, Redirect } from 'react-router-dom';
import Header from './components/header/header';
import Footer from './components/footer/footer';
import HomePage from './pages/homepage/homepage';
import DashboardPage from './pages/dashboard/dashboard';
import { createStructuredSelector } from 'reselect';
import { selectCurrentUser } from './redux/user/user.selector';
import { connect } from 'react-redux';
import AddTemplatePage from './pages/add-template/add-template';
import TemplatesPage from './pages/templates-page/templates-page';

const App = ({currentUser}) => {
  return (
    <div>
      <Header />
      <Switch>
        <Route exact path='/' render={() => currentUser ? <Redirect to='/dashboard' /> : <HomePage />} />
        <Route exact path='/dashboard' render={(props) => !currentUser ? <Redirect to='/' /> : <DashboardPage {...props} />} />        
        <Route exact path='/add-template' render={(props) => !currentUser ? <Redirect to='/' /> : <AddTemplatePage {...props} />} />        
        <Route path='/templates' render={(props) => !currentUser ? <Redirect to='/' /> : <TemplatesPage {...props} />} />       
      </Switch>
      <Footer />
    </div>
  );
}

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser
})

export default connect(mapStateToProps)(App);
