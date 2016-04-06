import React, {
  View,
  Text,
  Component,
  TextInput,
  StyleSheet,
  TouchableHighlight,
  ScrollView
} from 'react-native'

import Realm from 'realm'
import _ from 'lodash'

let realm = new Realm({
  schema: [{name: 'Categories', properties: {name: 'string'}}]
})

class App extends Component {

  constructor () {
    super()
    this.state = {
      input: '',
      favs: {}
    }
  }

  componentDidMount () {
    let favs = realm.objects('Categories')
    this.setState({
      favs: favs
    })
  }

  _closeModal () {
    this.props.navigator.pop()
  }

  _updateInput (input) {
    this.setState({ input })
  }

  _addItem () {
    if (this.state.input === '') return
    realm.write(() => {
      realm.create('Categories', { name: this.state.input })
    })
    this.setState({ input: '' })
  }

  _deleteItem (name) {
    let itemToDelete = _.filter(this.state.favs, (f) => {
      return f.name === name
    })
    realm.write(() => {
      realm.delete(itemToDelete[0])
    })
    let favs = realm.objects('Categories')
    this.setState({
      favs
    })
  }

  _viewImages (category) {
    this.props.navigator.push({
      name: 'ViewImages',
      passProps: {
        closeModal: this._closeModal,
        category
      }
    })
  }

  render () {
    let favs = _.map(this.state.favs, (f, i) => {
      return (
        <View key={i} style={style.favoriteButtonContainer}>
          <TouchableHighlight onPress={() => this._viewImages(f.name)} underlayColor='transparent' style={style.favorite}>
            <Text style={style.favoriteText}>{f.name}</Text>
          </TouchableHighlight>
          <TouchableHighlight style={style.deleteButton} onPress={() => this._deleteItem(f.name)}>
            <Text style={style.deleteText}>&times;</Text>
          </TouchableHighlight>
        </View>)
    })
    return (
      <View style={style.container}>
        <View style={style.headingContainer}>
          <Text style={style.heading}>Welcome to Realm Imgur Viewer</Text>
        </View>
        <ScrollView style={style.mainContainer}>
          <TextInput
            value={this.state.input}
            onChangeText={(text) => this._updateInput(text)}
            style={style.input}
            placeholder='What Do You Like?' />
          <View style={style.buttonContainer}>
            <TouchableHighlight underlayColor='#3f62aa' style={[ style.button ]} onPress={() => this._addItem()}>
              <Text style={style.buttonText}>Add Item</Text>
            </TouchableHighlight>
          </View>
          <View style={style.favContainer}>
            <Text style={style.favorites}>FAVORITES</Text>
            {favs}
          </View>
        </ScrollView>
      </View>
    )
  }
}

const style = StyleSheet.create({
  favoriteButtonContainer: {
    flexDirection: 'row'
  },
  deleteButton: {
    width: 57,
    height: 57,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e6e6e6'
  },
  deleteText: {
    color: '#979797',
    fontSize: 30
  },
  headingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
    borderBottomWidth: 1,
    borderBottomColor: '#ededed'
  },
  heading: {
    fontSize: 20,
    marginTop: 20
  },
  container: {
    flex: 1
  },
  favorite: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 13,
    marginLeft: 15,
    marginRight: 5,
    borderWidth: 1,
    borderColor: '#e6e6e6',
    marginBottom: 10,
    borderRadius: 4,
    flex: 1
  },
  favoriteText: {
    fontSize: 24,
    color: '#9f9f9f'
  },
  input: {
    height: 60,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    backgroundColor: '#ededed',
    borderRadius: 4,
    padding: 10,
    fontSize: 18,
    color: '#666666'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  button: {
    marginRight: 20,
    marginTop: 15,
    padding: 15,
    paddingLeft: 30,
    paddingRight: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3b5998',
    borderRadius: 4
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold'
  },
  favContainer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#ededed'
  },
  favorites: {
    color: '#c9c9c9',
    textAlign: 'center',
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 17
  },
  mainContainer: {
    flex: 1
  }
})

export default App