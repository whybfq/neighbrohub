import { Component, PropsWithChildren } from 'react';
import './app.scss';

class App extends Component<PropsWithChildren> {
  componentDidMount() {
    console.log('邻选·履约 - 小程序启动');
  }

  render() {
    return this.props.children;
  }
}

export default App;
