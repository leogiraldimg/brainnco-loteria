import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Lotteries from "../containers/Lotteries";

import NotFoundPage from "./NotFoundPage";

const App: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Lotteries} />
        <Route component={NotFoundPage} />
      </Switch>
    </Router>
  );
};

export default App;
