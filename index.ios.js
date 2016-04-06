import React, {
  AppRegistry,
  Component,
  Navigator
} from 'react-native'
import App from './app/App'
import ViewImages from './app/ViewImages'

class RealmImgur extends Component {

  renderScene (route, navigator) {
    console.log('route name: ', route.name)
    if (route.name === 'App') {
      return <App navigator={navigator} {...route.passProps} />
    }
    if (route.name === 'ViewImages') {
      return <ViewImages navigator={navigator} {...route.passProps} />
    }
  }

  configureScene (route) {
    if (route.type === 'Modal') {
      return Navigator.SceneConfigs.FloatFromBottom
    }
    return Navigator.SceneConfigs.PushFromRight
  }

  render () {
    return (
      <Navigator
        configureScene={this.configureScene.bind(this)}
        style={{ flex: 1, backgroundColor: 'white' }}
        initialRoute={{ name: 'App' }}
        renderScene={this.renderScene.bind(this)} />
    )
  }
}

AppRegistry.registerComponent('RealmImgur', () => RealmImgur)
